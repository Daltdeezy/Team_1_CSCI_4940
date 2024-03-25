def generate_message(event, delay, total_delay):
    if delay == 0:
        message = f"Hi, here is an update since it's been a few minutes. There have been no additional problems and the ETA is still INSERT MINUTES HERE!"
    else:
        message = f"Due to {event}, an additional delay of {delay} minutes is expected. Total delay so far: {total_delay} minutes. The new ETA is INSERT MINUTES HERE!"
    return message
