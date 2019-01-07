import { Indexable } from './common';

export function groupBy<T>(xs: T[], key: string): Indexable<T[]> {
  return xs.reduce(function(previous: any, current: Indexable<any>) {
    // Indexable<Array<Indexable<T>>>
    (previous[current[key]] = previous[current[key]] || []).push(current);
    return previous;
  }, {});
}

export default groupBy;
