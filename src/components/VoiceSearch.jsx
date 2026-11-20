import { useState } from "react";

function VoiceSearch({ onResult }) {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setMessage("Listening... Speak now 🎙️");
    };

    recognition.onresult = event => {
      const text = event.results[0][0].transcript;
      onResult(text);
      setMessage("Searching: " + text);
    };

    recognition.onerror = () => {
      setMessage("Could not recognize your voice. Try again.");
    };

    recognition.onend = () => setListening(false);

    recognition.start();
  };

  return (
    <div className="voice-search">
      <button
        className={listening ? "voice-btn listening" : "voice-btn"}
        onClick={startListening}
        disabled={listening}
      >
        {listening ? "🎙️ Listening..." : "🎤 Voice Search"}
      </button>
      {message && <small>{message}</small>}
    </div>
  );
}

export default VoiceSearch;