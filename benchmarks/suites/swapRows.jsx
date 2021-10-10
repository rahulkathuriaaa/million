/**
 * @name swapRows
 * @description swap 2 rows for table with 1,000 rows
 */

import { createElement, patch, UPDATE } from '../../src/index';
import { Suite, clone } from '../benchmark';
import { buildData } from '../data';
import * as tiny_vdom from '../tiny-vdom';
import * as virtual_dom from 'virtual-dom';
import * as snabbdom from 'snabbdom';

const data = buildData(1000);
const oldVNode = (
  <table>
    {data.map(({ id, label }) => (
      <tr>
        <td>{id}</td>
        <td>{label}</td>
      </tr>
    ))}
  </table>
);
const el = () => createElement(oldVNode);

const row1 = 0;
const row2 = 1;
const temp = data[row1];
data[row1] = data[row2];
data[row2] = temp;

const vnode = (
  <table delta={[UPDATE(row1), UPDATE(row2)]}>
    {data.map(({ id, label }) => (
      <tr>
        <td>{id}</td>
        <td>{label}</td>
      </tr>
    ))}
  </table>
);

const suite = Suite('swap rows (swap 2 rows for table with 1,000 rows)', {
  million: () => {
    patch(el(), vnode);
  },
  'tiny-vdom': () => {
    tiny_vdom.patch(el(), clone(oldVNode), clone(oldVNode));
  },
  'virtual-dom': () => {
    const patches = virtual_dom.diff(clone(oldVNode), clone(vnode));
    virtual_dom.patch(el(), patches);
  },
  snabbdom: () => {
    const patch = snabbdom.init([snabbdom.propsModule]);
    patch(el(), clone(vnode));
  },
  DOM: () => {
    const elClone = el();
    const tr1 = elClone.childNodes[row1];
    const tr2 = elClone.childNodes[row2];
    elClone.replaceChild(tr1.cloneNode(true), tr2);
    elClone.replaceChild(tr2.cloneNode(true), tr1);
  },
  innerHTML: () => {
    let html = '';
    data.forEach(({ id, label }) => {
      html += `<tr><td>${String(id)}</td><td>${label}</td></tr>`;
    });
    el().innerHTML = html;
  },
});

export default suite;