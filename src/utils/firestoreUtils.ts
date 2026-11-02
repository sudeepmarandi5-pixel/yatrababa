/**
 * Recursively removes any keys with `undefined` values from an object.
 * Firestore `setDoc` and `updateDoc` throw an exception if any field is undefined.
 */
export function cleanFirestoreData<T extends Record<string, any>>(obj: T): T {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj) || obj instanceof Date) {
    return obj;
  }

  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
        cleaned[key] = cleanFirestoreData(value);
      } else {
        cleaned[key] = value;
      }
    }
  }
  return cleaned as T;
}
