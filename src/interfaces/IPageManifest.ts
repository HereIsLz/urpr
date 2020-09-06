
export interface IClickablePageLink{
    hint: string,
    url: string
}

export interface IPageManifest {
    fileName: string,
    displayName: string,
    thumbnail?: string,
    //link?: IClickablePageLink,
    publishedTimestamp?: number,
    author?: string
}