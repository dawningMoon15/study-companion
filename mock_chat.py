import time
import threading

def pomodoro_timer(minutes=25):
    print(f"\n[!] Master Oogway starts a Pomodoro timer for {minutes} minutes.")
    print("[!] Focus on your breathing, and your studies. (Simulating timer for 5 seconds...)")
    time.sleep(5) # Simulated 25 minutes
    print("\n[!] Pomodoro session complete! Time for a short break, my young friend.")

print("========= Master Oogway Study Companion (MOCK MODE) =========")
print("This is a simulation. No microphone or API keys are required.")
print("Type your message and press ENTER (type 'quit' to exit).")
print("=============================================================\n")

while True:
    try:
        user_input = input("\nYou: ")
    except (KeyboardInterrupt, EOFError):
        break

    if user_input.lower() in ['quit', 'exit']:
        print("\nMaster Oogway: Goodbye, my student.")
        break

    if "pomodoro" in user_input.lower() or "study" in user_input.lower():
        t = threading.Thread(target=pomodoro_timer, args=(25,))
        t.daemon = True
        t.start()
        print("\nMaster Oogway: There are no accidents. Let us focus our minds and begin the journey of learning.")
    else:
        print("\nMaster Oogway: Ah, I hear you. Remember, the present is a gift, which is why it is called the present. Stay focused on your path.")
