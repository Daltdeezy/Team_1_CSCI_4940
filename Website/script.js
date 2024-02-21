// This script is linked in an HTML file that also includes the Google Maps API.
let map; // This will hold the map instance.

function initMap() {
  // Initialize the map and store it in the 'map' variable.
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 32.06012366850837, lng: -84.2327359745911}, // Default center
  });

  // Call the function to update bus locations on the map.
  updateBusLocationsOnMap();
}

function updateBusLocationsOnMap() {
  fetch('http://localhost:3000/api/latest-bus-locations') // Adjust the endpoint as necessary.
    .then(response => response.json())
    .then(data => {
      // Clear existing markers if necessary.
      // If you keep a reference to old markers, you could remove them here.

      // Create a marker for each bus location received.
      // Create a marker for each bus location received.
    data.forEach(bus => {
       new google.maps.Marker({
        position: {lat: Number(bus.latitude), lng: Number(bus.longitude)}, // Make sure lat and lng are numbers
       map: map,
    title: `Bus ${bus.busNumber}` // match the case of `busNumber`
    });
  });

    })
    .catch(error => console.error('Error fetching bus locations:', error));
}

// No need for the DOMContentLoaded listener if you are using the 'defer' attribute in the script tag.
// But if you are not using 'defer', then this is needed.
document.addEventListener('DOMContentLoaded', initMap);
