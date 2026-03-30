import { useState, useRef } from "react";

type EventType = {
  type: string;
  timestamp: number;
  duration: number;
};

interface EditorProps {
  token: string;
  username: string | null;
}

function Editor({ token, username }: EditorProps) {
  const [text, setText] = useState("");
  const [events, setEvents] = useState<EventType[]>([]);
  const [lastTime, setLastTime] = useState(Date.now());
  const [copyAlert, setCopyAlert] = useState<"normal" | "copied">("normal");

  const isPastingRef = useRef(false);

  // 🔹 Handle typing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isPastingRef.current) {
      const now = Date.now();

      const newEvent: EventType = {
        type: "key",
        timestamp: now,
        duration: now - lastTime,
      };

      setEvents((prev) => [...prev, newEvent]);
      setLastTime(now);
      setText(e.target.value);
    }
  };

  // 🔹 Detect paste
  const handlePaste = () => {
    isPastingRef.current = true;
    setCopyAlert("copied");

    alert("⚠️ Copy/Paste detected! Session will not be saved.");

    setTimeout(() => {
      isPastingRef.current = false;
      setCopyAlert("normal");
    }, 200);
  };

  //  Analyze typing 
  const analyzeTyping = () => {
    if (events.length === 0) {
      alert("No data to analyze");
      return;
    }

    const totalTime = events.reduce((sum, e) => sum + e.duration, 0);

    const wordCount =
      text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

    const pauses = events.filter((e) => e.duration > 1000);

    alert(`
📊 Typing Analysis:
Words: ${wordCount}
Total Time: ${(totalTime / 1000).toFixed(2)} sec
Pauses: ${pauses.length}
    `);
  };

  // 🔹 Save session
  const handleSave = async () => {
    if (copyAlert === "copied") {
      alert("❌ Cannot save session: Copy/Paste detected!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sessionId: "session_" + Date.now(),
          events,
          text,
          username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Session saved successfully!");
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("❌ Failed to save session");
    }
  };

  return (
    <div className="app">
      <h2>Vi-Notes Editor</h2>
      {username && <p>Logged in as: {username}</p>}

      {/* Copy Alert */}
      <div className={`copy-alert ${copyAlert}`}>
        {copyAlert === "copied"
          ? "⚠️ Copy/Paste Detected!"
          : "Start typing..."}
      </div>

      <textarea
        rows={10}
        cols={50}
        value={text}
        onChange={handleChange}
        onPaste={handlePaste}
        placeholder="Type here..."
      />

      <div className="button-group">
        <button onClick={handleSave}>Save Session</button>
        <button onClick={analyzeTyping}>Analyze Typing</button>
      </div>
    </div>
  );
}

export default Editor;