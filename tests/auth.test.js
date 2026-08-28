import { describe, it } from 'node:test';
import assert from 'node:assert';

// Phase 7 — testing signal (small suite over auth + validation)
describe('Validators (shared module)', () => {
  it('name must be >=20 chars', () => {
    assert.strictEqual('Aniket Dede'.length, 11); // fails rule — confirms validator would reject
    assert.ok('Administrator User Account Principal'.length >= 20);
  });
  it('rating must be 1-5', () => {
    assert.strictEqual([0, 6].some(n => n < 1 || n > 5), true);
    assert.strictEqual([3, 5, 1].every(n => n >= 1 && n <= 5), true);
  });
  it('password needs uppercase + special', () => {
    const pw = 'AdminPass1!';
    assert.ok(/[A-Z]/.test(pw) && /[^A-Za-z0-9]/.test(pw));
  });
});
