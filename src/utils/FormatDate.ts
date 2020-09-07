export function formatTime(timestamp: number) {
    let dt = new Date(timestamp)
    return dt.getFullYear() + " / " + (dt.getMonth() + 1) + " / " + dt.getDate()
}
