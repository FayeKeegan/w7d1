Pokedex.Models.Pokemon = Backbone.Model.extend({
  urlRoot: "/pokemon",

  toys: function () {
    this._toys = this._toys ||
      new Pokedex.Collections.Toys([], { pokemon: this });
    return this._toys;
  },

  parse: function (payload) {
    if (payload.toys) {
      this.toys().set(payload.toys, { parse: true });
      delete payload.toys;
    }

    return payload;
  }

});
