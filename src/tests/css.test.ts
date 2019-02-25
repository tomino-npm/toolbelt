import { engine, css, initCss } from '../css';

it('allows to generate multiple styles', () => {
  const style1 = css`
    opacity: 0.75;
  `;
  expect(style1).toBe('style-caabfajfbi');

  // add the same style again, should not add a new one
  css`
    opacity: 0.75;
  `;

  css`
    font-weight: bold;
  `;

  expect(engine.renderCss()).toBe(
    `.style-caabfajfbi{opacity:0.75;}
.style-bidfffiaba{font-weight:bold;}`
  );
});

it('add classname to sub classes', () => {
  const e = initCss('css-');
  const css = e.css;
  css`
    /* name:Tomi */
    color: white;
    ::before {
      content: 'A';
    }
    :hover {
      color: red;
    }
    &.i .love {
      color: pink;
    }
    .me .loves {
      color: blue;
    }
    .he.loves {
      color: white;
    }
    .you {
      color: blue;
    }
  `;

  expect(
    e.renderCss()
    //.replace(/\s/g, '')
  ).toBe(`.css-Tomi-Abhfcigdhhi{color:white;}
.css-Tomi-Abhfcigdhhi::before{content:'A';}
.css-Tomi-Abhfcigdhhi:hover{color:red;}
.css-Tomi-Abhfcigdhhi.i.love{color:pink;}
.css-Tomi-Abhfcigdhhi.me.loves{color:blue;}
.css-Tomi-Abhfcigdhhi.he.loves{color:white;}
.css-Tomi-Abhfcigdhhi.you{color:blue;}`);
});

it('allows to add media queries', () => {
  const e = initCss('css-');
  e.css`
    .me { background-color: #efefef; }

    @media (min-width: 1000px) {
      .me { color: green; }
    }
  `;

  expect(
    e.renderCss()
    //.replace(/\s/g, '')
  ).toBe(`.css-Afifhhaifd.me{background-color:#efefef;}
@media(min-width:1000px){.css-Afifhhaifd.me{color:green;}}`);
});

it('allows to add custom prefix', () => {
  const { css } = initCss('mine-');
  const style1 = css`
    .m {
      color: blue;
    }
    .n {
      color: blue;
    }
    background-color: #efefef;
  `;
  expect(style1).toBe('mine-Ahhbebacec');
});

it('allows to use custom name', () => {
  const { css, renderCss } = initCss('custom-');
  const style1 = css`
    /* name:test */
    background-color: #efefef;
    td {
      padding: 10px;
    }
  `;
  expect(style1).toBe('custom-test-Abieifihbgd');

  expect(renderCss()).toBe(
    `.custom-test-Abieifihbgd{background-color:#efefef;}
.custom-test-Abieifihbgd td{padding:10px;}`
  );
});

it('allows to use custom name', () => {
  const { css, renderCss } = initCss('custom-');
  const style1 = css`
    max-height: 200px;
    overflow: auto;

    table {
      width: 100%;
      background: white;
      color: black;
    }

    .diff {
      border-collapse: collapse;
      white-space: pre-wrap;
    }
  `;

  expect(renderCss()).toBe(``);
});
