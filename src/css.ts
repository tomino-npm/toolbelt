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

class Css {
  sheet: any;
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;

    if ((global as any).document) {
      const styleEl = document.createElement('style');
      document.head.appendChild(styleEl);
      this.sheet = styleEl.sheet;
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

  css = (strings: TemplateStringsArray, ...interpolations: any[]) => {
    const styleString = this.interleave(strings, interpolations);

    let className: string;
    let rule: string;

    // console.log('style: ' + styleString);

    // we can use pre-defined class names
    if (styleString.trim().startsWith('.')) {
      className = styleString
        .trim()
        .match(/[^\{]*/)[0]
        .split(' ')[0]
        .substring(1);
      // console.log('Named ' + className);

      let newClassName = className + '-' + hash(styleString);

      // console.log('New ' + newClassName);
      rule = styleString.replace(new RegExp(className, 'g'), newClassName);
      className = newClassName;

      // console.log(className);
      // console.log(rule);
    } else {
      // console.log('Unnamed');

      className = `${this.prefix.trim()}-${hash(styleString)}`;
      rule = '';
    }

    // split rules if more than one is expected

    // console.log('processing rule: ' + rule);

    if (rule.indexOf('}') >= 0) {
      let splits = rule.split('}');
      for (let split of splits) {
        if (!split.trim()) {
          continue;
        }
        const index = this.sheet.cssRules.length;
        // console.log('inserting rule: ' + split + '}');
        this.sheet.insertRule(split + '}', index);
      }
    } else {
      // simple rules
      const index = this.sheet.cssRules.length;
      rule = `.${className} { ${styleString} }`;

      // console.log('inserting rule: ' + rule);
      this.sheet.insertRule(rule, index);
    }

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

export const engine = initCss('style');
export const css = engine.css;
