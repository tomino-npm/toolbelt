// print styles

const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
function hash(input: string) {
  var hash = 0;
  if (input.length == 0) {
    return hash;
  }
  for (var i = 0; i < input.length; i++) {
    var char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  let outputHash = '';
  let strHash = hash.toString(10);

  for (let i = 0; i < strHash.length; i++) {
    outputHash += strHash[i] === '-' ? 'A' : chars[strHash[i] as any];
  }
  return outputHash;
}

const nameMatch = /\/\*\s*name:\s*(\S+)\s*\*\//;

class Css {
  sheet: any;
  prefix: string;
  speed: boolean;
  browser: boolean;
  sheetNode: HTMLStyleElement;

  generated: { [index: string]: boolean } = {};

  constructor(prefix: string) {
    this.prefix = prefix;
    this.speed = process.env.NODE_ENV === 'production';
    this.browser = typeof document !== 'undefined';

    // head = document.getElementsByTagName('head')[0];
    // stylesheet = document.createElement('link');
    // link.rel = 'stylesheet';
    // link.href = 'data:text/css,' + escape(css);  // IE needs this escaped
    // head.appendChild(link);

    if (this.browser) {
      this.sheetNode = document.createElement('style');
      document.head.appendChild(this.sheetNode);
      this.sheet = this.sheetNode.sheet;
    } else {
      this.sheet = {
        cssRules: [],
        insertRule(rule: any, index: number) {
          this.cssRules[index] = { cssText: rule };
        }
      };
    }
  }

  interleave(strings: TemplateStringsArray, interpolations: any[]) {
    return strings.reduce(
      (final, str, i) => final + str + (interpolations[i] === undefined ? '' : interpolations[i]),
      ''
    );
  }

  insertRule(rule: string) {
    if (this.browser && !this.speed) {
      this.sheetNode.appendChild(document.createTextNode(rule));
    } else {
      this.sheet.insertRule(rule, this.sheet.cssRules.length);
    }
  }

  cssProp = (strings: TemplateStringsArray, ...interpolations: any[]) => {
    return { className: this.css(strings, interpolations) };
  };

  css = (strings: TemplateStringsArray, ...interpolations: any[]) => {
    let rule = this.interleave(strings, interpolations).trim();

    let className: string = '';
    let h = hash(rule);

    if (this.generated[h]) {
      // do not add the same name twice
      return;
    }
    this.generated[h] = true;

    // find the debug name: /* name:NAME */
    let name = rule.match(nameMatch);
    if (name) {
      className = name[1] + '-';
      rule = rule.replace(nameMatch, '').trim();
    }
    className = (this.prefix + className + h) as string;

    // add index for loose ".a .b" subclasses
    rule = rule.replace(/(^\s*)\./gm, '$1\n.' + className + ' .');
    // add index for tight ".a.b" subclasses
    rule = rule.replace(/(^\s*\&)/gm, '\n.' + className);
    // add index for selectors ":hover"
    rule = rule.replace(/(^\s*:)/gm, '\n.' + className + ':');
    // add index for elements "td { color: blue }"
    rule = rule.replace(/^ *([a-zA-Z\.0-9 ]+) *\{/gm, '\n.' + className + ' $1{'); /*?*/

    rule = rule.trim(); /*?*/

    // if it has unnamed start so we add the classname to it
    let match = /\.[a-zA-Z_]/.exec(rule);
    let indexOfDot = match ? match.index : rule.length;

    if (indexOfDot > 0) {
      rule = `.${className} {\n  ${rule.substring(0, indexOfDot).trim()}\n}\n${rule.substring(
        indexOfDot
      )}`;
    }

    rule = rule.replace(/\s*(\W)\s*/gm, '$1');
    rule = rule.replace(/\}(\.|@)/g, '}\n$1'); /*?*/

    this.insertRule(rule);

    return className;
  };

  renderCss = () => {
    if (!(global as any).document) {
      // console.log(this.sheet);

      return this.sheet.cssRules.map((rule: any) => rule.cssText).join('\n');
    }
    return '';
  };
}

export const initCss = (prefix: string) => {
  var engine = new Css(prefix);
  return engine;
};

export const engine = initCss('style-');
export const css = engine.css;
export const cssProp = engine.cssProp;
