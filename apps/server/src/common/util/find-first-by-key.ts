export function findFirstByKey(
  obj: unknown,
  targetKey: string,
): unknown | undefined {
  if (typeof obj === 'object' && obj !== null) {
    if (Array.isArray(obj)) {
      for (const item of obj) {
        const result = findFirstByKey(item, targetKey);
        if (result !== undefined) {
          return result;
        }
      }
    } else {
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          if (key === targetKey) {
            return obj[key];
          }
          const result = findFirstByKey(obj[key], targetKey);
          if (result !== undefined) {
            return result;
          }
        }
      }
    }
  }

  return undefined;
}
