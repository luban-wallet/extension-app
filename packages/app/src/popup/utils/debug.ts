export function log(tag: string, ...args: unknown[]) {
  if(import.meta.env.PROD) {
    return
  }
  console.log(tag, ...args)
}
