// print styles

const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'];
function hash(input: string): string {
  var hash = 0;
  if (input.length == 0) {
    return hash.toString();
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

type CssContext = {
  name: string;
  parent: CssContext;
  text: string;
  rules: string[];
};

class Css {
  sheet: any;
  prefix: string;
  speed: boolean;
  browser: boolean;
  sheetNode: HTMLStyleElement;

  generated: { [index: string]: string } = {};

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

  strip(a: string) {
    return a.replace(/\s*(\W)\s*/gm, '$1');
  }

  stripRules(context: CssContext) {
    return this.strip(context.rules.join(';') + ';');
  }

  addRule(media: { [media: string]: string[] }, context: CssContext) {
    // find if there is media parent
    let parent = context.parent;
    let mediaName = '';
    while (parent !== null) {
      if (parent.name.startsWith('@')) {
        mediaName = parent.name;
        break;
      }
      parent = parent.parent;
    }
    if (media[mediaName] == null) {
      media[mediaName] = [];
    }
    media[mediaName].push(`${context.name} {${this.stripRules(context)}}`);
  }

  css = (strings: TemplateStringsArray, ...interpolations: any[]) => {
    let rule = this.interleave(strings, interpolations).trim();

    let className: string = '';
    let h = hash(rule);

    if (this.generated[h]) {
      // do not add the same name twice
      return this.generated[h];
    }

    // find the debug name: /* name:NAME */
    let name = rule.match(nameMatch);
    if (name) {
      className = name[1] + '-';
      rule = rule.replace(nameMatch, '').trim();
    }
    let result = this.prefix + className + h;
    this.generated[h] = result;
    className = '.' + result;

    let context: CssContext = {
      name: className,
      parent: null,
      text: '',
      rules: []
    };

    // parse the input
    let media: { [media: string]: string[] } = {};

    for (let i = 0; i < rule.length; i++) {
      let c = rule[i];
      if (c === '{') {
        let name = context.text.trim();

        // flush existing rules
        if (context.rules.length) {
          this.addRule(media, context);
          context.rules = [];
        }

        // name differs based on first letter
        let parentName = context.name.startsWith('@') ? context.parent.name : context.name;
        switch (name[0]) {
          case '&':
            name = parentName + name.substring(1).trim();
            break;
          case ':':
            name = parentName + name;
            break;
          case '@':
            name = name;
            break;
          default:
            name = parentName + ' ' + name;
            break;
        }

        context = {
          parent: context,
          name,
          text: '',
          rules: []
        };
      } else if (c === ';') {
        context.rules.push(context.text.trim());
        context.text = '';
      } else if (c === '}') {
        // forgotten semi-column
        if (context.text.trim()) {
          context.rules.push(context.text.trim());
        }
        if (context.rules.length) {
          this.addRule(media, context);
        }
        context = context.parent;
        context.text = '';
      } else {
        context.text += c;
      }
    }

    if (context.rules.length) {
      this.addRule(media, context);
    }

    rule = Object.getOwnPropertyNames(media)
      .map(k => (k === '' ? media[k].join('\n') : `${k} {\n${media[k].join('\n')}\n}`))
      .join('\n');

    this.insertRule(rule);

    return result;
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
