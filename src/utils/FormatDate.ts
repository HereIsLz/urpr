export function formatTime(timestamp: number) {
    let dt = new Date(timestamp)
    return dt.getFullYear() + " 年 " + (dt.getMonth() + 1) + " 月 " + dt.getDate() + " 日"
}
