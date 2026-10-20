// Self-check for the reminder rule: node test.js
const vm = require('vm'), fs = require('fs'), assert = require('assert');
const ctx = {}; vm.runInNewContext(fs.readFileSync(__dirname + '/Code.gs', 'utf8'), ctx);
const r = ctx.shouldRemind_;
assert.equal(r('2026-10-22', '2026-10-19', 3, ''), true);   // 3 days out
assert.equal(r('2026-10-23', '2026-10-19', 3, ''), false);  // 4 days out
assert.equal(r('2026-10-01', '2026-10-19', 3, ''), true);   // overdue
assert.equal(r('2026-10-22', '2026-10-19', 3, 'Reminded 2026-10-19 for 2026-10-22'), false); // already done
assert.equal(r('2026-11-20', '2026-11-18', 3, 'Reminded 2026-10-19 for 2026-10-22'), true);  // new due date
assert.equal(r('2026-10-22', '2026-10-19', 3, 'ERROR: bad address'), true); // errors retried
console.log('ok');
assert.equal(ctx.findDoneCol_(['Email', 'Due Date', 'Paid']), 2);
assert.equal(ctx.findDoneCol_(['Email', 'Done?', 'Paid date']), -1);
for (const v of ['TRUE', 'yes', 'x', '✓', 'Oct 3']) assert.equal(ctx.isDone_(v), true, v);
for (const v of ['FALSE', 'no', 'N', '', ' ']) assert.equal(ctx.isDone_(v), false, v);
console.log('ok done-column');
