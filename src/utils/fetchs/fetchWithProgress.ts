// TODO: 要加锁吗？？
var fetchItemCount = 0;

// TODO: cached fetch?

// TODO: LocalStorage API?

// TODO: 遇到 Expire 时新数据替换而不是增加

// 10min
const EXPIRE_TIME_MILLISECOND = 36000

export interface fetchedItem {
    key: string,
    value: any,
    expire: number,
}

var fetchedItemsStorage: fetchedItem[] = []

export async function fetchTextWithProgress(url: string): Promise<string> {
    let fetchedItemsStorageQueryResult = fetchedItemsStorage.find(itm => itm.key == url && itm.expire > new Date().getTime())
    if (fetchedItemsStorageQueryResult) {
        return fetchedItemsStorageQueryResult.value
    }
    fetchItemCount++;
    document.getElementById('navigate-shimmer')?.classList.add('shimmering')
    return await (await fetch(url, { cache: "no-store" })).text()
        .then(
            str => { fetchedItemsStorage.push({ key: url, value: str, expire: new Date().getTime() + EXPIRE_TIME_MILLISECOND }); return str }
        )
        .catch(
            //() => { document.getElementById('navigate-shimmer')?.classList.remove('shimmering'); alert("拉取数据错误。"); return "" }
        ).finally(
            () => {
                fetchItemCount--;
                if (fetchItemCount <= 0)
                    document.getElementById('navigate-shimmer')?.classList.remove('shimmering');
            }
        )

}

export async function fetchJsonWithProgress(url: string): Promise<any> {
    let fetchedItemsStorageQueryResult = fetchedItemsStorage.find(itm => itm.key == url && itm.expire > new Date().getTime())
    if (fetchedItemsStorageQueryResult) {
        return fetchedItemsStorageQueryResult.value
    }
    fetchItemCount++;
    document.getElementById('navigate-shimmer')?.classList.add('shimmering')
    return await (await fetch(url, { cache: "no-store" })).json()
        .then(

            json => { fetchedItemsStorage.push({ key: url, value: json, expire: new Date().getTime() + EXPIRE_TIME_MILLISECOND }); return json }
        )
        .catch(
            //() => { document.getElementById('navigate-shimmer')?.classList.remove('shimmering'); alert("拉取数据错误。"); return "" }
        ).finally(
            () => {
                fetchItemCount--;
                if (fetchItemCount <= 0)
                    document.getElementById('navigate-shimmer')?.classList.remove('shimmering');
            }
        )
}
