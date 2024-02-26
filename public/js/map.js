

console.log(mapToken);

// Check if listing is properly populated
console.log(listing);

// Initialize mapboxgl using the token
mapboxgl.accessToken = mapToken;







const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v9',
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9 // starting zoom
});

// Check if map is correctly initialized
console.log(map);

// Add a marker to the map
const marker = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
      new mapboxgl.Popup({ offset: 25 })
          .setHTML(`<h4>${listing.title}</h4>`) // Ensure that listing.title is correctly populated
  )
  .addTo(map);