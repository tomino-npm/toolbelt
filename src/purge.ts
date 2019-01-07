export function purge<T>(params: T): T {
  let p: any = params;
  for (let key of Object.getOwnPropertyNames(p)) {
    if (p[key] instanceof Object) {
      purge(p[key]);
    } else if (Array.isArray(p[key])) {
      if (p[key].length === 0) {
        delete p[key];
      }
    } else if (p[key] == null) {
      delete p[key];
    }
  }
  return params;
}

export default purge;
