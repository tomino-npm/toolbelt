import { groupByArray } from '../group-by-array';

it('groupByArray: creates grouped array', () => {
  const array = [{ foo: 'A', boo: '1' }, { foo: 'A' }, { foo: 'B' }];
  let grouped = groupByArray(array, 'foo');
  expect(grouped).toEqual([
    { key: 'A', values: [{ boo: '1', foo: 'A' }, { foo: 'A' }] },
    { key: 'B', values: [{ foo: 'B' }] }
  ]);

  grouped = groupByArray(array, a => a.foo);
  expect(grouped).toEqual([
    { key: 'A', values: [{ boo: '1', foo: 'A' }, { foo: 'A' }] },
    { key: 'B', values: [{ foo: 'B' }] }
  ]);
});
