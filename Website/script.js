// Assuming this script is linked in an HTML file that also includes the Google Maps API and a map is initialized
let busMarker; // Define this globally if you want to update the same marker position

function initMap() {
  // Initialize your map and store it in a global variable if needed
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 32.06012366850837, lng: -84.2327359745911}, // Default center
  });
  busMarker = new google.maps.Marker({
    position: {lat: 32.06012366850837, lng: -84.2327359745911}, // Default position
    map: map,
    title: 'Bus Location'
  });
  updateBusLocationOnMap(map);
}

function updateBusLocationOnMap(map) {
  fetch('/api/latest-bus-location')
    .then(response => response.json())
    .then(data => {
      const newPos = new google.maps.LatLng(data.latitude, data.longitude);
      busMarker.setPosition(newPos);
      map.setCenter(newPos);
    })
    .catch(error => console.error('Error fetching latest bus location:', error));
}

document.addEventListener('DOMContentLoaded', initMap); // Call initMap when the page loads
