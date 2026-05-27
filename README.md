# Study Companion

Welcome to your wise, patient, Oogway-style study companion. 
This project listens to your speech, maintains a calm and motivating conversation, and gently guides you through your Pomodoro study sessions.

## ✨ Features

- 💬 **Motivating Dialogue**: Driven by an OpenAI LLM, configured with a wise teacher persona.
- ⏱️ **Pomodoro Sessions**: Integrated Pomodoro timer. Say "start studying" or "pomodoro" to initiate a focused study session.
- 🔊 **Voice Generation**: High-quality voice synthesis with GPT-SoVITS.
- 🎧 **Speech Recognition**: Voice input powered by Faster-Whisper.
- 🧠 **Contextual Memory**: Keeps track of your study session and conversation history.

## ⚙️ Configuration

Your companion's personality and voice are defined in `character_config.yaml`.

```yaml
OPENAI_API_KEY: sk-YOURAPIKEY
history_file: chat_history.json
model: "gpt-4.1-mini"
```

## 🛠️ Setup

### Install Dependencies

```bash
pip install uv 
uv pip install -r extra-req.txt
uv pip install -r requirements.txt
```

**For GPU Acceleration (Faster-Whisper)**:
* Ensure CUDA & cuDNN are installed.
* `ffmpeg` is required for audio processing.

## 🧪 Usage

1. **Launch the GPT-SoVITS API** to serve the voice synthesis model.
2. **Run the study companion**:

```bash
python server/main_chat.py
```

The flow:
1. The companion listens to your microphone.
2. Faster-Whisper transcribes your speech.
3. If you say "pomodoro" or "study", a 25-minute focus timer starts in the background.
4. The LLM generates a thoughtful response.
5. GPT-SoVITS synthesizes the companion's voice, which is played back to you.

## 📜 License

MIT — feel free to modify and build your own learning companions.
