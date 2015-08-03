json.partial!("pokemon", :pokemon => @pokemon)

json.toys do
  json.array!(@toys) do |toy|
    json.partial!("toys/toy", toy: toy, display_toys: true)
  end
end
