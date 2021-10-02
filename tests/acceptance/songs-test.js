// tests/acceptance/songs-test.js
import { module, test } from 'qunit';
import { visit, click, fillIn, waitFor, currentURL } from '@ember/test-helpers';
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

    await click('[data-test-rr=sort-by-title-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText(
        'Spinning in Daffodils',
        'The first song is the one that comes last in the alphabet'
      );
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText(
        'Elephants',
        'The last song is the one that comes first in the alphabet'
      );
    assert.ok(
      currentURL().includes('s=-title'),
      'The sort query param appears in the URL with the correct value'
    );

    await click('[data-test-rr=sort-by-rating-asc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText('Mind Eraser, No Chaser', 'The first song is the lowest rated');
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasText('Spinning in Daffodils', 'The last song is the highest rated');
    assert.ok(
      currentURL().includes('s=rating'),
      'The sort query param appears in the URL with the correct value'
    );

    await click('[data-test-rr=sort-by-rating-desc]');
    assert
      .dom('[data-test-rr=song-list-item]:first-child')
      .hasText('Spinning in Daffodils', 'The first song is the highest rated');
    assert
      .dom('[data-test-rr=song-list-item]:last-child')
      .hasAnyText(
        'Mind Eraser, No Chaser',
        'The last song is the lowest rated'
      );
    assert.ok(
      currentURL().includes('s=-rating'),
      'The sorting query param appears in the URL with the correct value'
    );
  });
});
