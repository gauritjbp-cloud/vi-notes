import { useState } from "react";
import Login from "./components/Login";
import Editor from "./components/Editor";

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  // If no token/not logged in, show login/register
  if (!token) return <Login setToken={setToken} setUsername={setUsername} />;

  // After login/register, show Editor
  return <Editor token={token} username={username} />;
}

export default App;