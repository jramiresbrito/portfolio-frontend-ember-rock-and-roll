export default function () {
  // https://www.ember-cli-mirage.com/docs/route-handlers/shorthands
  this.get('/bands');
  this.get('/bands/:id');
  this.get('/bands/:id/songs', function (schema, request) {
    let id = request.params.id;
    return schema.songs.where({ bandId: id });
  });

  this.post('/bands');
}
