// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export function debounce<T = Function>(func: T, wait: number, immediate?: boolean): T {
  var timeout: any;
  return function(this: any) {
    var context = this,
      args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) (func as any).apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) (func as any).apply(context, args);
  } as any;
}

export default debounce;
