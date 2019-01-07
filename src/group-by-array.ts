import { Indexable, Group } from './common';

export function groupByArray<T>(xs: T[], key: string | ((x: T) => any)): Array<Group<T>> {
  return xs.reduce(function(previous: any, current: Indexable<any>) {
    let v = key instanceof Function ? key(current as any) : current[key];
    let el = previous.find((r: any) => r && r.key === v);
    if (el) {
      el.values.push(current);
    } else {
      previous.push({
        key: v,
        values: [current]
      });
    }
    return previous;
  }, []);
}

export default groupByArray;
