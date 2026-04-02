//tells whether to show login page or editor page
import { useState } from "react";//usestate to store data
import Login from "./components/Login";//login page
import Editor from "./components/Editor";//editor page

function App() {
  const [token, setToken] = useState<string | null>(null);
  //token tells wthere logged in or not , if null then not otherwise vice versa
  const [username, setUsername] = useState<string | null>(null);

  // If no token/not logged in, show login/register
  if (!token) return <Login setToken={setToken} setUsername={setUsername} />;

  // After login/register, show Editor
  return <Editor token={token} username={username} />;
}

export default App;