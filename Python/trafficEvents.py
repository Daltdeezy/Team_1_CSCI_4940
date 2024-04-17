import numpy as np

# Define events and base probabilities
events = ['snow', 'heavy traffic', 'light traffic', 'accident', 'clear']
base_probabilities = np.array([0.05, 0.3, 0.3, 0.05, 0.3])

# Delay impact model for each event
delay_impact = {
    'snow': 30,
    'heavy traffic': 10,
    'light traffic': 5,
    'accident': 20,
    'clear': 0,
}

# Time-dependent adjustments
time_adjustments = {
    'morning': np.array([0.05, 0.4, 0.25, 0.05, 0.25]),
    'afternoon': np.array([0.05, 0.2, 0.35, 0.05, 0.35]),
    'evening': np.array([0.05, 0.4, 0.25, 0.05, 0.25]),
    'night': np.array([0.1, 0.1, 0.1, 0.1, 0.6]),
    'day': np.array([0.05, 0.3, 0.4, 0.05, 0.2]) 
}

# History buffer to store recent events for dynamic probability adjustment
event_history = []

# Event occurrence counter
event_counter = {event: 0 for event in events}

# Adjust probabilities based on time of day and recent events
def adjust_probabilities(time_of_day):
    time_probs = base_probabilities * time_adjustments[time_of_day]
    if event_history:
        recent_event_counts = np.array([event_history.count(e) for e in events])
        dynamic_adjustment = 1.0 / (1.0 + recent_event_counts / len(event_history))  # Reducing likelihood of recent events
        adjusted_probs = time_probs * dynamic_adjustment
    else:
        adjusted_probs = time_probs
    
    adjusted_probs /= np.sum(adjusted_probs)  # Normalize to sum to 1
    return adjusted_probs

# Simulate multiple events and calculate their delay impacts
def simulate_multiple_events_and_delays(time_of_day, num_events):
    events_and_delays = []
    for _ in range(num_events):
        probs = adjust_probabilities(time_of_day)
        event = np.random.choice(events, p=probs)
        delay = delay_impact[event]
        events_and_delays.append((event, delay))
        event_history.append(event)  # Update history
        event_counter[event] += 1  # Increment event counter
        #Limit history size to last N events
        history_limit = 10
        if len(event_history) > history_limit:
            event_history.pop(0)
    return events_and_delays, probs

# Set time of day for testing purposes
time_of_day = 'day'  

# Number of events per simulation iteration
num_events_per_iteration = 5

# Run the simulation 10 times
for i in range(10):
    events_and_delays, adjusted_probs = simulate_multiple_events_and_delays(time_of_day, num_events_per_iteration)
    print(f"Simulation {i+1}:")
    for j, (event, delay) in enumerate(events_and_delays):
        print(f"  Event {j+1}: {event}, Delay: {delay} minutes")
    print(f"  Adjusted Probabilities after Simulation: {adjusted_probs}\n")

# Display event occurrence count
print("Event occurrence count:")
for event, count in event_counter.items():
    print(f"{event}: {count}")
