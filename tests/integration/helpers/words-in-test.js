// tests/integration/helpers/words-in-test.js
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Helper | words-in', function (hooks) {
  setupRenderingTest(hooks);

  test('It counts each word once', async function (assert) {
    this.set(
      'description',
      'Pearl Jam is an American rock band, formed in Seattle, Washington in 1990.'
    );
    await render(hbs`{{words-in this.description}}`);
    assert.dom(this.element).hasText('13');
  });

  test('It returns 0 when passed undefined or null', async function (assert) {
    this.set('description', undefined);
    await render(hbs`{{words-in this.description}}`);
    assert.dom(this.element).hasText('0');

    this.set('description', null);
    assert.dom(this.element).hasText('0');
  });
});
