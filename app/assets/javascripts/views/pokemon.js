Pokedex.Views.Pokemon = Backbone.View.extend({
  initialize: function () {
    this.$pokeList = this.$el.find('.pokemon-list');
    this.$pokeDetail = this.$el.find('.pokemon-detail');
    this.$newPoke = this.$el.find('.new-pokemon');
    this.$toyDetail = this.$el.find('.toy-detail');

    this.pokemon = new Pokedex.Collections.Pokemon();
    this.$pokeList.on("click", "li.poke-list-item", this.selectPokemonFromList.bind(this))
    this.$newPoke.on("submit", this.submitPokemonForm.bind(this));
    this.$pokeDetail.on("click", "li.toy-list-item", this.selectToyFromList.bind(this))
  },

  selectPokemonFromList: function (event) {
    var $li = $(event.currentTarget);
    // debugger
    var pokemon = this.pokemon.get($li.data("id"));
    this.renderPokemonDetail(pokemon);
  },

  selectToyFromList: function (event) {
    var $li = $(event.currentTarget);
    // var toy = new Pokedex.Models.Toy({ id: $li.data("id") });
    var view = this;
    var pokemon = this.pokemon.get($li.data("pokemon-id"));
    pokemon.fetch({
      success: function () {
        var pokeToy = pokemon.toys().get($li.data("id"));
        view.renderToyDetail(pokeToy);
      }
    });
  },

  addPokemonToList: function (pokemon) {
    this.$pokeList.append(
      $("<li>")
      .addClass("poke-list-item")
      .data("id", pokemon.get("id"))
      .text("Name:" + pokemon.get("name")
        + "   Poketype: " + pokemon.get("poke_type")
      )
    )
  },

  refreshPokemon: function () {
    var view = this;
    this.pokemon.fetch({
      success: function () {
        view.pokemon.each( function (pokemon) {
          view.addPokemonToList(pokemon);
        });
      }
    });
  },

  renderPokemonDetail: function (pokemon) {
    this.$toyDetail.children().remove();
    var $div = $("<div>").addClass("detail");
    var $img = $("<img>");
    $img.attr("src", pokemon.get("image_url"));
    $div.append($img);
    for (attr in pokemon.toJSON()) {
      var $li = $("<li>").text(attr + ": " + pokemon.get(attr));
      if (attr!== "image_url"){
        $div.append($li);
      }
    }
    var $toys = $("<ul>").addClass("toys");
    pokemon.fetch({
        success: function(){
          var pokeToys = pokemon.toys();
          pokeToys.forEach( function (toy) {
            var $li = $("<li>")
              .addClass("toy-list-item")
              .data("id", toy.get("id"))
              .data("pokemon-id", pokemon.get("id"));
            $li.text("id: " + toy.get("id") + "  name: " + toy.get("name"))
            $toys.append($li);
          })
        }
    })
    this.$pokeDetail.html($div);
    this.$pokeDetail.append($toys);
  },

  renderToyDetail: function(toy){
    var $toyDiv = $("<div>").addClass("toy-detail")
    var $img = $("<img>").attr("src", toy.get("image_url"));
    $toyDiv.append($img);
    for (attr in toy.toJSON()) {
      var $toy_li = $("<li>").text(attr + ": " + toy.get(attr)).addClass("toy-list-item");
      $toyDiv.append($toy_li);
    }
    this.$toyDetail.html($toyDiv);
  },

  createPokemon: function (attributes, callback) {
    var view = this;
    var pokemon = new Pokedex.Models.Pokemon(attributes);
    pokemon.save({}, {
      success: function () {
        view.pokemon.add(pokemon);
        view.addPokemonToList(pokemon);
        callback(pokemon);
      }
    });
  },

  submitPokemonForm: function(event){
    var view = this;
    event.preventDefault();
    var newPokemon = $(event.currentTarget).serializeJSON();
    this.createPokemon(newPokemon, view.renderPokemonDetail.bind(view));
  }
});
