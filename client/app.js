document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const chatForm = document.getElementById("chatForm");
    const userInput = document.getElementById("userInput");
    const chatContainer = document.getElementById("chatContainer");
    const sendBtn = document.getElementById("sendBtn");
    const ttsToggle = document.getElementById("ttsToggle");

    // Voice Controls
    const voicePauseBtn = document.getElementById("voicePauseBtn");
    const voiceResumeBtn = document.getElementById("voiceResumeBtn");
    const voiceStopBtn = document.getElementById("voiceStopBtn");

    let isWaiting = false;

    // ----- CLOCK & DATE -----
    function updateClock() {
        const now = new Date();
        document.getElementById("clockDisplay").textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById("dateDisplay").textContent = now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // ----- WEATHER -----
    async function fetchWeather() {
        try {
            // Using a generic lat/lon (e.g., San Francisco) since we can't reliably get geolocation without HTTPS permissions
            const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current_weather=true");
            const data = await res.json();
            const temp = data.current_weather.temperature;
            document.getElementById("weatherDisplay").innerHTML = `☁️ ${temp}°C`;
        } catch (e) {
            document.getElementById("weatherDisplay").textContent = "Unknown";
        }
    }
    fetchWeather();

    // ----- QUOTES -----
    const quotes = [
        "There are no accidents.",
        "Yesterday is history, tomorrow is a mystery.",
        "Your mind is like this water, my friend.",
        "One often meets his destiny on the road he takes to avoid it.",
        "You just need to believe."
    ];
    document.getElementById("quoteDisplay").textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    setInterval(() => {
        document.getElementById("quoteDisplay").textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    }, 60000); // Change quote every minute

    // ----- TIMERS (POMODORO & STOPWATCH) -----
    let pomoInterval = null;
    let stopwInterval = null;
    let stopwMs = 0;

    const tabPomo = document.getElementById("tabPomodoro");
    const tabStopw = document.getElementById("tabStopwatch");
    const viewPomo = document.getElementById("pomodoroView");
    const viewStopw = document.getElementById("stopwatchView");

    tabPomo.addEventListener("click", () => {
        tabPomo.classList.add("active");
        tabStopw.classList.remove("active");
        viewPomo.classList.add("active");
        viewStopw.classList.remove("active");
    });

    tabStopw.addEventListener("click", () => {
        tabStopw.classList.add("active");
        tabPomo.classList.remove("active");
        viewStopw.classList.add("active");
        viewPomo.classList.remove("active");
    });

    // Pomodoro Logic
    document.getElementById("pomodoroStartBtn").addEventListener("click", (e) => {
        if (e.target.textContent === "Start Focus") {
            e.target.textContent = "Stop Focus";
            startPomodoro();
        } else {
            e.target.textContent = "Start Focus";
            clearInterval(pomoInterval);
            document.getElementById("pomodoroDisplay").textContent = "25:00";
        }
    });

    function startPomodoro() {
        clearInterval(pomoInterval);
        let timeLeft = 25 * 60;
        
        function updateDisplay() {
            const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            document.getElementById("pomodoroDisplay").textContent = `${m}:${s}`;
        }
        updateDisplay();
        
        pomoInterval = setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                clearInterval(pomoInterval);
                document.getElementById("pomodoroStartBtn").textContent = "Start Focus";
                document.getElementById("pomodoroDisplay").textContent = "00:00";
                addMessage("Pomodoro session complete. Time for a short break, my young friend.", false);
                speakText("Pomodoro session complete. Time for a short break, my young friend.");
            } else {
                updateDisplay();
            }
        }, 1000);
    }

    // Stopwatch Logic
    const swStartBtn = document.getElementById("stopwatchStartBtn");
    const swStopBtn = document.getElementById("stopwatchStopBtn");
    
    swStartBtn.addEventListener("click", () => {
        if (swStartBtn.textContent === "Start") {
            swStartBtn.textContent = "Pause";
            stopwInterval = setInterval(() => {
                stopwMs += 100;
                const totalSec = Math.floor(stopwMs / 1000);
                const m = Math.floor(totalSec / 60).toString().padStart(2, '0');
                const s = (totalSec % 60).toString().padStart(2, '0');
                const ms = Math.floor((stopwMs % 1000) / 100);
                document.getElementById("stopwatchDisplay").textContent = `${m}:${s}.${ms}`;
            }, 100);
        } else {
            swStartBtn.textContent = "Start";
            clearInterval(stopwInterval);
        }
    });

    swStopBtn.addEventListener("click", () => {
        clearInterval(stopwInterval);
        swStartBtn.textContent = "Start";
        stopwMs = 0;
        document.getElementById("stopwatchDisplay").textContent = "00:00.0";
    });


    // ----- SPEECH SYNTHESIS (TTS) CHUNKING & CONTROLS -----
    // We break the text into sentences so it sounds less flat and breathes naturally
    let utteranceQueue = [];
    
    function speakText(text) {
        if (!ttsToggle.checked || !window.speechSynthesis) return;
        
        window.speechSynthesis.cancel(); // stop current
        utteranceQueue = [];
        
        // Chunk by punctuation for natural pauses
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
        
        sentences.forEach(sentence => {
            const ut = new SpeechSynthesisUtterance(sentence.trim());
            
            const voices = window.speechSynthesis.getVoices();
            // Prefer premium/enhanced voices on Mac for better intonation
            let voice = voices.find(v => v.lang.includes('en') && (v.name.includes('Premium') || v.name.includes('Enhanced') || v.name.includes('Daniel') || v.name.includes('Siri')));
            if (!voice) voice = voices.find(v => v.lang.includes('en') && v.name.includes('Male'));
            
            if (voice) ut.voice = voice;
            ut.rate = 0.85; // Slow, wise
            ut.pitch = 0.6; // Deep
            
            utteranceQueue.push(ut);
        });

        // Play the first chunk
        if (utteranceQueue.length > 0) {
            playNextUtterance(0);
        }
    }

    function playNextUtterance(index) {
        if (index >= utteranceQueue.length) return;
        const ut = utteranceQueue[index];
        ut.onend = () => {
            playNextUtterance(index + 1);
        };
        window.speechSynthesis.speak(ut);
    }

    voicePauseBtn.addEventListener("click", () => {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
        }
    });

    voiceResumeBtn.addEventListener("click", () => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    });

    voiceStopBtn.addEventListener("click", () => {
        window.speechSynthesis.cancel();
        utteranceQueue = [];
    });

    window.speechSynthesis.onvoiceschanged = () => { window.speechSynthesis.getVoices(); };


    // ----- CHAT HELPER -----
    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${isUser ? 'user-message' : 'system-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = text;
        
        msgDiv.appendChild(contentDiv);
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function addLoadingIndicator() {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message system-message loading-msg';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
        
        msgDiv.appendChild(contentDiv);
        chatContainer.appendChild(msgDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
        return msgDiv;
    }

    // ----- FORM SUBMIT -----
    chatForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const text = userInput.value.trim();
        if (!text || isWaiting) return;
        
        addMessage(text, true);
        userInput.value = "";
        
        isWaiting = true;
        sendBtn.disabled = true;
        
        const loadingMsg = addLoadingIndicator();
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            
            const data = await response.json();
            chatContainer.removeChild(loadingMsg);
            
            if (data.response) {
                addMessage(data.response, false);
                speakText(data.response);
            } else {
                addMessage("I am currently meditating.", false);
            }
            
        } catch (error) {
            chatContainer.removeChild(loadingMsg);
            addMessage("The stream of connection is broken.", false);
            console.error(error);
        } finally {
            isWaiting = false;
            sendBtn.disabled = false;
            userInput.focus();
        }
    });
});
