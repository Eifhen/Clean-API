


export default function isObject<T>(value: T | object): value is T {
  return typeof value === 'object' && value !== null;
}