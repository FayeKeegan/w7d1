json.(pokemon, :id, :attack, :defense, :image_url, :moves, :name, :poke_type)

if (:display_toys)
  json.toys do
    json.array!(@toys) do |toy|
      json.partial!("toys/toy", toy: toy, display_toys: true)
    end
  end
end
