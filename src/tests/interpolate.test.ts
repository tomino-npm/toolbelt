import { interpolate } from '../interpolate';

it('interpolates string', () => {
  expect(
    interpolate('Test ${my} works ${result.current}', {
      my: '007',
      result: {
        old: 'ignore',
        current: 'great'
      }
    })
  ).toBe('Test 007 works great');
});
