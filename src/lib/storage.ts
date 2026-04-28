export const getItem = <T>(key: string): T | null => {
    if (typeof window === "undefined") return null;
    try {
       const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as T 
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return null
    }
}
export const setItem = <T>(key: string, value: T):void => {
    if (typeof window !== "undefined") {
        try {
    localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    }
}
export const removeItem = (key: string): void => {
      if (typeof window === "undefined") return;
    localStorage.removeItem(key)
}