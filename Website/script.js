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

function updateBusLocationsOnMap() {
  // Clear existing markers from the map
  busMarkers.forEach(marker => marker.setMap(null));
  busMarkers = []; // Reset the markers array

  fetch('http://localhost:3000/api/latest-bus-locations') 
    .then(response => response.json())
    .then(data => {
      // Create a marker for each bus location received.
      data.forEach(bus => {
        let marker = new google.maps.Marker({
          position: {lat: Number(bus.latitude), lng: Number(bus.longitude)}, 
          map: map,
          title: `Bus ${bus.busNumber}` // Ensuring `busNumber` is correctly referenced
        });
        busMarkers.push(marker); // Add the marker to the array for later reference
      });
    })
    .catch(error => console.error('Error fetching bus locations:', error));
}


document.addEventListener('DOMContentLoaded', function() {
  // Existing code for message input and button handling
  
  initMap(); // Initialize the map

  // Update bus locations every 30 seconds
  setInterval(updateBusLocationsOnMap, 1000); // Adjust the interval as needed
});

function fetchDelayMessages() {
  fetch('http://localhost:5000/get-delay-message')
      .then(response => response.json())
      .then(data => {
          const logsContainer = document.querySelector('.scrollable-content');
          logsContainer.innerHTML = ''; // Clear existing content
          data.messages.forEach(message => {
              const p = document.createElement('p');
              p.textContent = message;
              logsContainer.appendChild(p);
          });
      })
      .catch(error => console.error('Failed to fetch delay messages:', error));
}

// Call the function to fetch and display messages as soon as the page loads
document.addEventListener('DOMContentLoaded', fetchDelayMessages);


