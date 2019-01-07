declare global {
  interface String {
    interpolate(params: any): string;
  }
}

export function interpolate(str: string, params: any) {
  const names = Object.keys(params);
  const vals = Object.values(params);
  return new Function(...names, `return \`${str}\`;`)(...vals);
}

export function registerStringInterpolateExtension() {
  String.prototype.interpolate = function(params: any) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
  };
}
