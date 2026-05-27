from faster_whisper import WhisperModel
from process.asr_func.asr_push_to_talk import record_and_transcribe
from process.llm_funcs.llm_scr import llm_response
from process.tts_func.sovits_ping import sovits_gen, play_audio
from pathlib import Path
import os
import time
### transcribe audio 
import uuid
import soundfile as sf


def get_wav_duration(path):
    with sf.SoundFile(path) as f:
        return len(f) / f.samplerate


import threading

def pomodoro_timer(minutes=25):
    print(f"\n[!] Pomodoro timer started for {minutes} minutes. Focus on your breathing, and your studies.")
    time.sleep(minutes * 60)
    print("\n[!] Pomodoro session complete! Time for a short break, my young friend.")
    # Could trigger an audio alert here

print(' \n ========= Starting Study Session... ================ \n')
whisper_model = WhisperModel("base.en", device="cpu", compute_type="float32")

while True:

    conversation_recording = output_wav_path = Path("audio") / "conversation.wav"
    conversation_recording.parent.mkdir(parents=True, exist_ok=True)

    user_spoken_text = record_and_transcribe(whisper_model, conversation_recording)
    
    if "pomodoro" in user_spoken_text.lower() or "study" in user_spoken_text.lower():
        # Start a background timer for 25 minutes
        t = threading.Thread(target=pomodoro_timer, args=(25,))
        t.daemon = True
        t.start()

    ### pass to LLM and get a LLM output.

    llm_output = llm_response(user_spoken_text)

    tts_read_text = llm_output

    ### file organization 

    # 1. Generate a unique filename
    uid = uuid.uuid4().hex
    filename = f"output_{uid}.wav"
    output_wav_path = Path("audio") / filename
    output_wav_path.parent.mkdir(parents=True, exist_ok=True)

    # generate audio and save it to client/audio 
    gen_aud_path = sovits_gen(tts_read_text,output_wav_path)


    play_audio(output_wav_path)
    # clean up audio files
    [fp.unlink() for fp in Path("audio").glob("*.wav") if fp.is_file()]