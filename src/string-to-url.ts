export function url(this: string, a: string) {
  let result = (this || a).replace(/\:/g, '');
  result = result.replace(/ - /g, '-');
  result = result.replace(/\W/g, '-');
  do {
    result = result.replace(/--/g, '-');
  } while (result.indexOf('--') >= 0);
  return result.toLowerCase();
}

export function registerStringUrlExtension() {
  String.prototype.url = url as any;
}

export default registerStringUrlExtension;
