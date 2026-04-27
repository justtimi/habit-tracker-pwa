export const getItem = <T>(key: string): T | null => {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T
}
export const setItem = <T>(key: string, value: T):void => {
    localStorage.setItem(key, JSON.stringify(value))
}
export const removeItem = (key: string): void => {
    localStorage.removeItem(key)
}