export const setItem = (key: string, value: unknown) => {
  try {
    key === "token"
      ? window.localStorage.setItem(key, value as string)
      : window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    
  }
};
export const getItem = (key: string) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? (key !== "token" ? JSON.parse(item) : item) : undefined;
  } catch (error) {
    
  }
};
export const removeItem = (key: string) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    
  }
};
