from flask import Flask, jsonify
from trafficEvents import simulate_event_and_delay
from nlpMessaging import generate_message
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/get-delay-message', methods=['GET'])
def get_delay_message():
    total_delay = 0
    messages = []
    
    for _ in range(4):  # Simulate receiving 4 events throughout a day
        event, delay = simulate_event_and_delay()
        total_delay += delay
        message = generate_message(event, delay, total_delay)
        messages.append(message)
    
    final_message = f"Final total expected delay: {total_delay} minutes."
    messages.append(final_message)
    
    return jsonify(messages=messages)

if __name__ == '__main__':
    app.run(debug=True)
