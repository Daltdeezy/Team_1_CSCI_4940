// Define global variables
let busMarkers = []; // Array to hold bus marker instances
let messageQueue = [];
let messageIndex = 0;

// Initialize the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: { lat: 32.06012366850837, lng: -84.2327359745911 }, // Default center
  });
  updateBusMarkers();
}


let busRoutes = {}; // Object to store routes by bus number
let currentIndexes = {}; // Current index in the route for each bus

function fetchBusRoutes() {
    fetch('http://localhost:3000/api/latest-bus-locations') // Adjust this endpoint as necessary
        .then(response => response.json())
        .then(data => {
            data.forEach(bus => {
                if (!busRoutes[bus.busNumber]) {
                    busRoutes[bus.busNumber] = [];
                    currentIndexes[bus.busNumber] = 0;
                }
                busRoutes[bus.busNumber].push({ lat: Number(bus.latitude), lng: Number(bus.longitude) });
            });
            updateBusMarkers(); // Call to start updating markers
        })
        .catch(error => console.error('Error fetching bus routes:', error));
}

fetchBusRoutes(); // Initial call to fetch routes


// Call fetchBusLocations periodically to update data
//setInterval(fetchBusRoutes, 3000); // Fetch new data every 10 seconds
// Use setInterval to update the locations every few seconds
//setInterval(updateBusMarkers, 3000); // Update every 10 seconds


// Fetch delay messages
function fetchDelayMessages() {
  console.log('Fetching messages...');
  fetch('http://localhost:5000/get-delay-message')
    .then(response => response.json())
    .then(data => {
      messageQueue = data.messages; // Store the messages in the queue
      messageIndex = 0; // Reset the index to 0
      console.log(messageQueue);
    })
    .catch(error => console.error('Failed to fetch delay messages:', error));
    
    setInterval(displayNextMessage, 5000); // Display messages every 5 seconds
    setInterval(updateBusMarkers, 3000); // Update bus locations every 3 seconds
}

function updateBusMarkers() {
  Object.keys(busRoutes).forEach(busNumber => {
      let route = busRoutes[busNumber];
      let index = currentIndexes[busNumber];
      let currentLocation = route[index];

      if (!busMarkers[busNumber]) {
          // Create a new marker if one doesn't exist
          busMarkers[busNumber] = new google.maps.Marker({
              position: currentLocation,
              map: map,
              title: `Bus ${busNumber}`
          });
      } else {
          // Move the existing marker to the new position
          busMarkers[busNumber].setPosition(new google.maps.LatLng(currentLocation.lat, currentLocation.lng));
      }

      // Update the index for the next update
      currentIndexes[busNumber] = (index + 1) % route.length; // Loop back to the start
  });

  //setTimeout(updateBusMarkers, 3000); // Update position every 3 seconds
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

function checkAndToggleDirectionIfNeeded() {
  fetch('http://localhost:3000/api/toggle-direction')
    .then(response => response.text())
    .then(msg => console.log(msg))
    .catch(error => console.error('Error toggling direction:', error));
}


// DOMContentLoaded listener to set everything up
document.addEventListener('DOMContentLoaded', fetchDelayMessages);

  initMap(); // Initialize the map
  
  fetchDelayMessages(); // Fetch messages
 
