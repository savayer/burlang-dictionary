export default function groupBy<T extends Record<string, any>>(
  array: T[],
  property: keyof T,
): Record<string, T[]> {
  return array.reduce<Record<string, T[]>>((memo, x) => {
    const key = String(x[property]);

    if (!memo[key]) {
      memo[key] = [];
    }
    memo[key].push(x);

    return memo;
  }, {});
}
