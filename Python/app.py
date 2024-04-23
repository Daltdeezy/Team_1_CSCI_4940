from flask import Flask, jsonify
from flask_cors import CORS
from trafficEvents import simulate_events  # Adjusted import
from nlpMessaging import generate_message

app = Flask(__name__)
CORS(app)

@app.route('/get-delay-message', methods=['GET'])
def get_delay_message():
    total_delay = 0
    messages = []
    
    # Simulate 5 events
    time_of_day = 'day'  # This can be dynamically determined as needed
    simulated_events = simulate_events(time_of_day, num_events=5)

    for event, delay in simulated_events:
        total_delay += delay
        message = generate_message(event, delay, total_delay)
        messages.append(message)
    
    final_message = f"Final total expected delay: {total_delay} minutes."
    messages.append(final_message)
    
    return jsonify(messages=messages)

if __name__ == '__main__':
    app.run(debug=True)
