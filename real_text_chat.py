import sys
import os

# Add server to path so process imports work
sys.path.append(os.path.join(os.path.dirname(__file__), 'server'))

from process.llm_funcs.llm_scr import llm_response

print("========= Master Oogway Study Companion (TEXT MODE) =========")
print("Using your actual OpenAI API key to talk to Master Oogway.")
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

    response = llm_response(user_input)
    print(f"\nMaster Oogway: {response}")
