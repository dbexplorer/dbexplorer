export function cssPrefix(className: string): string {
  return "jsde-" + className;
}

export function keysEqual(a: string | string[], b: string | string[]): boolean {
  if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((val, index) => val === b[index]);
  return a === b;
}