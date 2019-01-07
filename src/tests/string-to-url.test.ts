import { registerStringUrlExtension } from '../string-to-url';

it('converts strings to nice urls', () => {
  registerStringUrlExtension();

  expect('url'.url()).toBe('url');
  expect('url '.url()).toBe('url-');
  expect('url url'.url()).toBe('url-url');
  expect('url  url'.url()).toBe('url-url');
  expect('url          url         UR1'.url()).toBe('url-url-ur1');
  expect('URL'.url()).toBe('url');
});
