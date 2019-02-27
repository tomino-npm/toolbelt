import { engine, css, initCss } from '../css';

it('renders simple rules', () => {
  const { css, renderCss } = initCss('simple-');
  css`
    /* name:test */
    background-color: #efefef;
    color: #efefef;
  `;

  expect(renderCss()).toBe(`.simple-test-Abajijaffei {background-color:#efefef;color:#efefef;}`);
});

it('allows to generate multiple styles', () => {
  css`
    opacity: 0.75;
  `;

  // add the same style again, should not add a new one
  css`
    opacity: 0.75;
  `;

  css`
    font-weight: bold;
  `;

  expect(engine.renderCss()).toBe(
    `.style-caabfajfbi {opacity:0.75;}
.style-bidfffiaba {font-weight:bold;}`
  );
});

it('allows to add sub classes', () => {
  const { css, renderCss } = initCss('mine-');
  css`
    background-color: white;
    .m {
      color: blue;
    }
    & .n {
      color: yellow;
    }
    :hover {
      color: green;
    }
    background-color: black;
  `;
  expect(renderCss()).toBe(
    `.mine-Acagdedahhg {background-color:white;}
.mine-Acagdedahhg .m {color:blue;}
.mine-Acagdedahhg.n {color:yellow;}
.mine-Acagdedahhg:hover {color:green;}
.mine-Acagdedahhg {background-color:black;}`
  );
});

it('allows to add sub elements', () => {
  const { css, renderCss } = initCss('mine-');
  css`
    table td {
      color: blue;
    }
  `;
  expect(renderCss()).toBe(`.mine-bdighefjhg table td {color:blue;}`);
});

it('allows hierarchic sub classes', () => {
  const { css, renderCss } = initCss('mine-');
  css`
    background-color: white;
    .m {
      color: blue;

      & .n {
        color: yellow;
      }

      .o {
        color: pale;
      }
    }
    background-color: black;
  `;
  expect(renderCss()).toBe(`.mine-bjajdeabg {background-color:white;}
.mine-bjajdeabg .m {color:blue;}
.mine-bjajdeabg .m.n {color:yellow;}
.mine-bjajdeabg .m .o {color:pale;}
.mine-bjajdeabg {background-color:black;}`);
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
  ).toBe(`.css-Tomi-Abhfcigdhhi {color:white;}
.css-Tomi-Abhfcigdhhi::before {content:'A';}
.css-Tomi-Abhfcigdhhi:hover {color:red;}
.css-Tomi-Abhfcigdhhi.i .love {color:pink;}
.css-Tomi-Abhfcigdhhi .me .loves {color:blue;}
.css-Tomi-Abhfcigdhhi .he.loves {color:white;}
.css-Tomi-Abhfcigdhhi .you {color:blue;}`);
});

it('allows to add media queries', () => {
  const e = initCss('css-');
  e.css`
    .me { background-color: #efefef; }

    @media (min-width: 1000px) {
      .me { 
        color: green; 
        .he { color: blue }
      }
    }
  `;

  expect(
    e.renderCss()
    //.replace(/\s/g, '')
  ).toBe(`.css-Abfacbaebah .me {background-color:#efefef;}
@media (min-width: 1000px) {
.css-Abfacbaebah .me {color:green;}
.css-Abfacbaebah .me .he {color:blue;}
}`);
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
    `.custom-test-Abieifihbgd {background-color:#efefef;}
.custom-test-Abieifihbgd td {padding:10px;}`
  );
});

// it('allows to use custom name', () => {
//   const { css, renderCss } = initCss('custom-');
//   const style1 = css`
//     max-height: 200px;
//     overflow: auto;

//     table {
//       width: 100%;
//       background: white;
//       color: black;
//     }

//     .diff {
//       border-collapse: collapse;
//       white-space: pre-wrap;
//     }
//   `;

//   expect(renderCss()).toBe(``);
// });
