import { useState, useRef } from "react";
//useState - to store data (text, events, etc.)
//useRef - to store values without re-rendering


type EventType = {//structure of each event
  type: string;
  timestamp: number;
  duration: number;
  pastedLength?: number;
};

interface EditorProps {
  token: string;//jwt token
  username: string | null;
}

function Editor({ token, username }: EditorProps) {
  const [text, setText] = useState("");
  const [events, setEvents] = useState<EventType[]>([]);//stores all actions
  const [lastTime, setLastTime] = useState(Date.now());//stores last event time
  const [copyAlert, setCopyAlert] = useState("normal");

  const isPastingRef = useRef(false);
  //used to detect if current action is paste
// if true paste happens else vice versa


  // HANDLE TYPING
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {//runs whenever texts changes
    const now = Date.now();

    //events-an array where we store every user action that happens inside the editor
    if (!isPastingRef.current) {
      const newEvent: EventType = {
        type: "key",//event created by typing key
        timestamp: now,
        duration: now - lastTime,
      };

      setEvents((prev) => [...prev, newEvent]);//add event to array
      setLastTime(now);
    }

    // always update text
    setText(e.target.value);
  };

  // HANDLE PASTE
  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData("text");//gets pasted content
    const now = Date.now();

    const pasteEvent: EventType = {
      type: "paste",//user inserted content instantly
      timestamp: now,
      duration: now - lastTime,
      pastedLength: pastedText.length,
    };
//This is stored in your events[]

//we save it here
    setEvents((prev) => [...prev, pasteEvent]);
    setLastTime(now);//update time to now

    isPastingRef.current = true;
    setCopyAlert("copied");

    alert(`⚠️ Pasted ${pastedText.length} characters!`);

    setTimeout(() => {
      isPastingRef.current = false;
      setCopyAlert("normal");
    }, 0);
  };

  // ANALYZE TYPING
  const analyzeTyping = () => {
    if (events.length === 0) {
      alert("No data to analyze");
      return;
    }

    const totalTime = events.reduce((sum, e) => sum + e.duration, 0);

    const wordCount =text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
      //Splits text based on any whitespace,tabs,newlines

    const pauses = events.filter((e) => e.duration > 1000);
//It finds all typing events where the user paused for more than 1 second

    const pasteEvents = events.filter((e) => e.type === "paste");
    //new object added to array events[]
    //we filter is done of events type:paste and then count
    const totalPasted = pasteEvents.reduce(
      (sum, e) => sum + (e.pastedLength || 0),
      0
    );//sum pasted charc

    alert(`
📊 Typing Analysis:
Words: ${wordCount}
Total Time: ${(totalTime / 1000).toFixed(2)} sec
Pauses: ${pauses.length}

🚨 Paste Detection:
Pastes: ${pasteEvents.length}
Pasted Characters: ${totalPasted}
    `);
  };

  //  SAVE SESSION
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