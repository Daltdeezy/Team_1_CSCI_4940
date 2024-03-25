import numpy as np

# Define events and their probabilities
events = ['snow', 'heavy traffic', 'light traffic', 'accident', 'clear']
probabilities = [0.05, 0.3, 0.3, 0.05, 0.3]  # Ensure these sum to 1

# Define a simple impact model for each event, delays in minutes
delay_impact = {
    'snow': 30,
    'heavy traffic': 10,
    'light traffic': 5,
    'accident': 20,
    'clear': 0,
}

# Function to simulate receiving an event and calculating its delay impact
def simulate_event_and_delay():
    event = np.random.choice(events, p=probabilities)
    delay = delay_impact[event]
    return event, delay

