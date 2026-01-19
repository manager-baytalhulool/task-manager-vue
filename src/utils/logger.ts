export const logError = (...args: unknown[]) => {
  if (!import.meta.env.PROD) {
    console.error(...args)
  }
}
