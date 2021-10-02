// tests/acceptance/songs-test.js
import { module, test } from 'qunit';
import { visit, click, fillIn, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { getPageTitle } from 'ember-page-title/test-support';

module('Acceptance | Songs', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('Create a song', async function (assert) {
    this.server.create('band', { name: 'Radiohead' });
    await visit('/');
    await click('[data-test-rr=band-link]');
    assert.equal(getPageTitle(), 'Radiohead 🎸 Rock & Roll with Octane');
    await click('[data-test-rr="new-song-button"]');
    await fillIn('[data-test-rr=new-song-title]', 'Killer Cars');
    await click('[data-test-rr=save-song-button]');
    await waitFor('[data-test-rr=song-list-item]');
    assert
      .dom('[data-test-rr=song-list-item]')
      .exists({ count: 1 }, 'The new song is created');
  });

  test('Sort songs in various ways', async function (assert) {
    let band = this.server.create('band', { name: 'Them Crooked Vultures' });

    this.server.create('song', {
      title: 'Mind Eraser, No Chaser',
      rating: 2,
      band,
    });
    this.server.create('song', {
      title: 'Elephants',
      rating: 4,
      band,
    });
    this.server.create('song', {
      title: 'Spinning in Daffodils',
      rating: 5,
      band,
    });
    this.server.create('song', {
      title: 'New Fang',
      rating: 3,
      band,
    });

    await visit('/');
    await click('[data-test-rr=band-link]');

    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Elephants',
        'The first song is the one that comes first in the alphabet'
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Spinning in Daffodils',
        'The last song is the one that comes last in the alphabet'
      );
  });
});
