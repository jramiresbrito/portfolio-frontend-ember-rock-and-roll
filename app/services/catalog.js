import Service from '@ember/service';
import { tracked } from 'tracked-built-ins';
import Band from 'rock-and-roll/models/band';
import Song from 'rock-and-roll/models/song';

function extractRelationships(object) {
  let relationships = {};
  for (let relationshipName in object) {
    relationships[relationshipName] = object[relationshipName].links.related;
  }

  return relationships;
}

export default class CatalogService extends Service {
  storage = {};

  constructor() {
    super(...arguments);
    this.storage.bands = tracked([]);
    this.storage.songs = tracked([]);
  }

  async fetchAll(type) {
    if (type === 'bands') {
      let response = await fetch('/bands');
      let json = await response.json();
      this.loadAll(json);

      return this.bands;
    }

    if (type === 'songs') {
      let response = await fetch('/songs');
      let json = await response.json();
      this.loadAll(json);

      return this.songs;
    }
  }

  loadAll(json) {
    let records = [];
    for (const item of json.data) {
      records.push(this.#loadResource(item));
    }

    return records;
  }

  #loadResource(data) {
    let record;
    let { id, type, attributes, relationships } = data;
    if (type === 'bands') {
      let rels = extractRelationships(relationships);
      record = new Band({ id, ...attributes }, rels);
      this.add('band', record);
    }

    if (type === 'songs') {
      let rels = extractRelationships(relationships);
      record = new Song({ id, ...attributes }, rels);
      this.add('song', record);
    }

    return record;
  }

  add(type, record) {
    let collection = type === 'band' ? this.storage.bands : this.storage.songs;
    collection.push(record);
  }

  find(type, filterFn) {
    let collection = type === 'band' ? this.bands : this.songs;
    return collection.find(filterFn);
  }

  get bands() {
    return this.storage.bands;
  }

  get songs() {
    return this.storage.songs;
  }
}
