import yaml
import json
import os
from openai import OpenAI

with open('character_config.yaml', 'r') as f:
    char_config = yaml.safe_load(f)

# Uses Ollama if base_url is set, otherwise defaults to OpenAI
client = OpenAI(
    api_key=char_config.get('OPENAI_API_KEY', 'ollama'),
    base_url=char_config.get('base_url', 'http://localhost:11434/v1')
)

HISTORY_FILE = char_config.get('history_file', 'chat_history.json')
MODEL = char_config.get('model', 'llama3')
SYSTEM_PROMPT = [
    {
        "role": "system",
        "content": char_config['presets']['default']['system_prompt']
    }
]

def load_history():
    if os.path.exists(HISTORY_FILE):
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    return SYSTEM_PROMPT.copy()

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f, indent=2)

def llm_response(user_input):
    messages = load_history()
    
    messages.append({
        "role": "user",
        "content": user_input
    })

    # Standard chat completion API (works with both OpenAI and Ollama)
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.7,
        max_tokens=2048,
    )
    
    output_text = response.choices[0].message.content

    messages.append({
        "role": "assistant",
        "content": output_text
    })

    save_history(messages)
    return output_text

if __name__ == "__main__":
    print('running main')