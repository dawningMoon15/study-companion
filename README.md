# Study Companion

A voice-based LLM study companion built with Python. I wanted to make something that helps me focus while studying, so this bot acts a bit like Master Oogway—calm, patient, and motivating. 

It listens to your voice, responds using OpenAI's API, and uses TTS to speak back. It also has a built-in Pomodoro timer to help structure study sessions.

## Features

- **Voice Chat**: Talk to the bot via microphone. It uses Faster-Whisper for local speech-to-text.
- **Study Mode / Pomodoro**: If you say "start studying" or "pomodoro", it kicks off a 25-minute background timer and reminds you when it's time for a break.
- **Personality**: Configured to be a wise teacher (Oogway vibe) rather than a generic assistant.
- **Voice Synthesis**: Uses GPT-SoVITS to generate the audio responses.

## Setup

You'll need a few things installed:

```bash
pip install uv 
uv pip install -r extra-req.txt
uv pip install -r requirements.txt
```

Note: If you want to use Faster-Whisper on your GPU, make sure you have CUDA and cuDNN set up. You also need `ffmpeg` installed on your system for the audio processing to work.

## Configuration

Everything is controlled via `character_config.yaml`. Add your OpenAI API key there:

```yaml
OPENAI_API_KEY: sk-YOURAPIKEY
history_file: chat_history.json
model: "gpt-4.1-mini"
```

You can also tweak the system prompt in that file if you want to change the personality.

## Running the app

1. Start your GPT-SoVITS API server first (it expects this to be running for voice synthesis).
2. Run the main script:

```bash
python server/main_chat.py
```

The app will listen for your voice, transcribe it, get a response from the LLM, generate the audio, and play it back.


