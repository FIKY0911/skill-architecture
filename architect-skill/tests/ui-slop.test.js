'use strict';
const assert = require('assert');
const { scanText } = require('../scripts/validate-ui-slop.js');

const ids = (src, f = 'a.tsx') => scanText(f, src).map((x) => x.id);

assert.deepStrictEqual(ids('<span className="bg-blue-500/10 text-blue-600">x</span>').sort(), ['S2', 'S4']);
assert.ok(ids('<div className="bg-[#ff0000]"/>').includes('S3'));
assert.ok(ids('<div style={{ background: "red" }}/>').includes('S5'));
assert.ok(ids('<h1 className="bg-clip-text text-transparent"/>').includes('S7'));
assert.ok(ids('const c = "#fff";').includes('S1'));
assert.deepStrictEqual(ids('<Card className="bg-card text-card-foreground border-2 shadow-base"/>'), []);
assert.deepStrictEqual(ids('<i className="bg-blue-500/10"/> // anti-slop-allow: S2 x').filter((i) => i === 'S2'), []);
assert.deepStrictEqual(ids(':root{--primary:#000;}', 'theme-tokens.css'), []);
assert.deepStrictEqual(ids(':root{ --a:#000; }', 'x.css'), []);
console.log('ui-slop tests passed');
