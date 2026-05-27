# Study Companion

A completely local, completely free, browser-based LLM study dashboard built with Python and JavaScript. I wanted to make something that helps me focus while studying, so this bot acts a bit like Master Oogway—calm, patient, and motivating. 

It runs entirely on your local machine using **Ollama** and Llama 3, and uses your browser's native Text-to-Speech (TTS) so it can speak back to you with zero API costs.

## Features

- **Master Oogway Personality**: Configured to be a wise teacher rather than a generic assistant.
- **Web Dashboard**: A beautiful, dark-mode, glassmorphism UI.
- **Timer Suite**: Includes a 25-minute Pomodoro focus timer and a Stopwatch.
- **Lo-Fi Player**: Embedded YouTube Picture-in-Picture (PiP) player for 24/7 Lo-Fi beats.
- **Live Widgets**: Real-time clock, date, local weather, and rotating Oogway wisdom quotes.
- **Natural Voice Engine**: Uses browser-native TTS with smart sentence-chunking for natural pauses, plus dedicated Pause/Play/Stop buttons.
- **100% Free & Local**: No OpenAI API keys required. Powered by Ollama.

## Setup

1. **Install Ollama**: Download it from [ollama.com](https://ollama.com/).
2. **Download the Model**: Run this in your terminal to download Llama 3 and start the server:
   ```bash
   ollama run llama3
   ```
3. **Install Python Dependencies**: 
   ```bash
   pip3 install pyyaml openai
   ```

## Configuration

Settings are controlled via `character_config.yaml`. By default, it is wired up for Ollama:

```yaml
OPENAI_API_KEY: ollama
base_url: "http://localhost:11434/v1"
history_file: chat_history.json
model: "llama3"
```
*(You can also optionally swap it back to OpenAI by placing your real API key here and removing `base_url`).*

## Running the app

Start the lightweight Python web server:

```bash
python3 server/web_server.py
```

Then open your browser and navigate to:
**http://localhost:8000**


