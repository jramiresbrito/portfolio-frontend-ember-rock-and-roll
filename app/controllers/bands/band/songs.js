import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class BandsBandSongsController extends Controller {
  @service catalog;

  @tracked showAddSong = true;
  @tracked title = '';
  @tracked sortBy = 'title';
  @tracked searchTerm = '';

  get matchingSongs() {
    let searchTerm = this.searchTerm.toLowerCase();
    return this.model.songs.filter((song) => {
      return song.title.toLowerCase().includes(searchTerm);
    });
  }

  get sortedSongs() {
    let sortBy = this.sortBy;
    let isDescendingSort = false;
    if (sortBy.charAt(0) === '-') {
      sortBy = this.sortBy.slice(1);
      isDescendingSort = true;
    }

    return this.matchingSongs.sort((s1, s2) => {
      if (s1[sortBy] < s2[sortBy]) return isDescendingSort ? 1 : -1;
      if (s1[sortBy] > s2[sortBy]) return isDescendingSort ? -1 : 1;

      return 0;
    });
  }

  @action
  updateTitle(event) {
    this.title = event.target.value;
  }

  @action
  updateSearchTerm(event) {
    this.searchTerm = event.target.value;
  }

  @action
  async updateRating(song, rating) {
    song.rating = rating;
    this.catalog.update('song', song, { rating });
  }

  @action
  async saveSong() {
    let song = await this.catalog.create(
      'song',
      { title: this.title },
      { band: { data: { id: this.model.id, type: 'bands' } } }
    );

    this.model.songs = [...this.model.songs, song];
    this.cancel();
  }

  @action
  cancel() {
    this.title = '';
    this.sortBy = 'title';
    this.searchTerm = '';
    this.showAddSong = true;
  }
}
