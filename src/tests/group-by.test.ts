import { groupBy } from '../group-by';

it('groupBy: creates groups in object', () => {
  const array = [{ foo: 'A', boo: '1' }, { foo: 'A' }, { foo: 'B' }];
  let grouped = groupBy(array, 'foo');
  expect(grouped.A).toEqual([{ boo: '1', foo: 'A' }, { foo: 'A' }]);
  expect(grouped.B).toEqual([{ foo: 'B' }]);
});
