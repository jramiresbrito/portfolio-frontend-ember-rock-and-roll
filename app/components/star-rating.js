import Component from '@glimmer/component';
import { action, set } from '@ember/object';

export default class StarRatingComponent extends Component {
  get enableSpin() {
    return this.args.enableSpin ?? false;
  }

  get maxRating() {
    return this.args.maxRating ?? 5;
  }

  get stars() {
    let stars = [];

    for (let i = 1; i <= this.maxRating; i++) {
      stars.push({ rating: i, full: i <= this.args.rating, spin: false });
    }

    return stars;
  }

  @action
  shouldSpin([star, value]) {
    if (this.enableSpin) set(star, 'spin', value);
  }
}
