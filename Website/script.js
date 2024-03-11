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
