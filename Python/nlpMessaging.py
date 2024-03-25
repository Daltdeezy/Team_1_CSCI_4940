def generate_message(event, delay, total_delay):
    if delay == 0:
        message = f"No additional delay from {event}. Total delay remains at {total_delay} minutes."
    else:
        message = f"Due to {event}, an additional delay of {delay} minutes is expected. Total delay so far: {total_delay} minutes."
    return message
