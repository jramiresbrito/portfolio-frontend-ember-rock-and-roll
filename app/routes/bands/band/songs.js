import Route from '@ember/routing/route';

export default class BandsBandSongsRoute extends Route {
  resetController(controller) {
    controller.cancel();
  }
}
