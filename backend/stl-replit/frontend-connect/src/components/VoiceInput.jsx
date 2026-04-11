import { useState } from "react";
import { askAI } from "../services/api";

export default function VoiceInput({ userId }) {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");

  const sendToAI = async (message) => {
    try {
      setError("");
      const res = await askAI(message, userId);
      const r = res.data?.reply;
      setReply(typeof r === "string" ? r : JSON.stringify(r));
    } catch (e) {
      setError(e?.response?.data?.msg || "AI request failed");
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const speech = event.results?.[0]?.[0]?.transcript || "";
      setText(speech);
      if (speech) sendToAI(speech);
    };
    recognition.onerror = () => setError("Voice capture failed. Try again.");
    recognition.start();
  };

  return (
    <div className="card" style={{ marginTop: 20 }}>
      <h3>Voice AI</h3>
      <button onClick={startListening}>Speak</button>
      {text ? <p style={{ marginTop: 10 }}>You said: {text}</p> : null}
      {reply ? <p style={{ marginTop: 10 }}>AI: {reply}</p> : null}
      {error ? <p style={{ marginTop: 10, color: "tomato" }}>{error}</p> : null}
    </div>
  );
}

