import Route from '@ember/routing/route';

export default class BandsBandRoute extends Route {
  model({ id }) {
    let bands = this.modelFor('bands');
    return bands.find((band) => band.id === id);
  }
}
