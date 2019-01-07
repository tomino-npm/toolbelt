import { engine, css, initCss } from '../css';

it('allows to generate multiple styles', () => {
  const style1 = css`
    background-color: #efefef;
  `;
  expect(style1).toBe('style-ijagaibjd');

  const style2 = css`
    font-weight: bold;
  `;

  expect(engine.renderCss().replace(/\s/g, '')).toBe(
    `.style-ijagaibjd{background-color:#efefef;}.style-diecjjfcg{font-weight:bold;}`
  );
});

it('allows to add custom prefix', () => {
  const { css } = initCss('mine');
  const style1 = css`
    background-color: #efefef;
  `;
  expect(style1).toBe('mine-ijagaibjd');
});

it('allows to use custom name', () => {
  const { css, renderCss } = initCss('Custom');
  const style1 = css`
    .test {
      background-color: #efefef;
    }
    .test td {
      padding: 10px;
    }
  `;
  expect(style1).toBe('.test-cbdcgbeheg');

  expect(renderCss().replace(/\s/g, ' ')).toBe(
    `     .test-cbdcgbeheg {       background-color: #efefef;     }      .test-cbdcgbeheg td {       padding: 10px;     }`
  );
});
