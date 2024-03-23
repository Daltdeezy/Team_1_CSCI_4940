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

// Wait for the DOM content to be loaded
document.addEventListener("DOMContentLoaded", function() {
  // Get the input field and send button elements
  var inputField = document.querySelector('.message-input input[type="text"]');
  var sendButton = document.querySelector('.message-input button');
  var scrollableContent = document.querySelector('.scrollable-content');

  // Add click event listener to the send button
  sendButton.addEventListener('click', function() {
      // Get the value of the input field
      var message = inputField.value;

      // Check if the message is not empty
      if (message.trim() !== '') {
          // Create a new paragraph element
          var newMessage = document.createElement('p');
          // Set the text content of the new paragraph to the message
          newMessage.textContent = message;
          // Append the new paragraph to the scrollable content
          scrollableContent.appendChild(newMessage);
          // Clear the input field
          inputField.value = '';
          // Scroll to the bottom of the scrollable content
          scrollableContent.scrollTop = scrollableContent.scrollHeight;
      }
  });

  // Optionally, you can also allow pressing Enter key to send the message
  inputField.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          // Prevent the default form submission behavior
          event.preventDefault();
          // Trigger the click event on the send button
          sendButton.click();
      }
  });
});


let busMarkers = []; // Array to hold bus marker instances

// Assuming each bus object has a unique 'id' you can use for tracking
function updateBusLocationsOnMap() {
  fetch('http://localhost:3000/api/latest-bus-locations') 
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Received data:', data); // Log data for debugging

      const newBusData = new Map(data.map(bus => [bus.busNumber, bus])); // Create a map of new bus data

      // Update or create markers
      newBusData.forEach((bus, busNumber) => {
        const existingMarker = busMarkers.find(marker => marker.busNumber === busNumber);
        if (existingMarker) {
          // Update position of existing marker
          existingMarker.setPosition(new google.maps.LatLng(bus.latitude, bus.longitude));
        } else {
          // Create a new marker
          const marker = new google.maps.Marker({
            position: new google.maps.LatLng(bus.latitude, bus.longitude),
            map: map,
            title: `Bus ${busNumber}`,
          });
          marker.busNumber = busNumber; // Assign busNumber for reference
          busMarkers.push(marker);
        }
      });

      // Remove markers for buses that are no longer present
      busMarkers = busMarkers.filter(marker => {
        return newBusData.has(marker.busNumber);
      });
    })
    .catch(error => console.error('Error fetching bus locations:', error)); // Log errors
}



document.addEventListener('DOMContentLoaded', function() {
  // Existing code for message input and button handling
  
  initMap(); // Initialize the map

  setInterval(updateBusLocationsOnMap, 1000); // Adjust the interval as needed
});

setInterval(updateBusLocationsOnMap, 1000);

