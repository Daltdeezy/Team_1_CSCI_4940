// Define global variables
let map;
let busMarkers = []; // Array to hold bus marker instances
let messageQueue = [];
let messageIndex = 0;

// Initialize the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 32.06012366850837, lng: -84.2327359745911 }, // Default center
  });
  updateBusLocationsOnMap();
}

// Update bus locations
function updateBusLocationsOnMap() {
  // Clear existing markers from the map
  busMarkers.forEach(marker => marker.setMap(null));
  busMarkers = []; // Reset the markers array
  fetch('http://localhost:3000/api/latest-bus-locations')
    .then(response => response.json())
    .then(data => {
      data.forEach(bus => {
        let marker = new google.maps.Marker({
          position: { lat: Number(bus.latitude), lng: Number(bus.longitude) },
          map: map,
          title: `Bus ${bus.busNumber}` // Ensuring `busNumber` is correctly referenced
        });
        busMarkers.push(marker); // Add the marker to the array for later reference
      });
    })
    .catch(error => console.error('Error fetching bus locations:', error));
}

// Fetch delay messages
function fetchDelayMessages() {
  console.log('Fetching messages...');
  fetch('http://localhost:5000/get-delay-message')
    .then(response => response.json())
    .then(data => {
      messageQueue = data.messages; // Store the messages in the queue
      messageIndex = 0; // Reset the index to 0
    })
    .catch(error => console.error('Failed to fetch delay messages:', error));
    console.log(messageQueue);
    setInterval(displayNextMessage, 5000); // Display messages every 5 seconds
    setInterval(updateBusLocationsOnMap, 1000); // Update bus locations every 30 seconds
}

// Display the next message from the queue
function displayNextMessage() {
  console.log('Displaying next message...');
  const logsContainer = document.querySelector('.scrollable-content');
  if (messageIndex < messageQueue.length) {
    const message = messageQueue[messageIndex]; // Get the next message
    const updateLabel = `Update ${messageIndex + 1}:`; // Construct the update label
    const formattedMessage = `${updateLabel} ${message}`; // Prepend the message with the update label
    const p = document.createElement('p');
    p.textContent = formattedMessage;
    logsContainer.appendChild(p);
    messageIndex++; // Increment the index to point to the next message
    logsContainer.scrollTop = logsContainer.scrollHeight; // Scroll to the bottom
  }
}

// DOMContentLoaded listener to set everything up
document.addEventListener('DOMContentLoaded', fetchDelayMessages);

  initMap(); // Initialize the map
  
  fetchDelayMessages(); // Fetch messages
 
