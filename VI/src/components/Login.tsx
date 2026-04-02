//handles login/register ui

import { useState } from "react";

interface LoginProps {
  setToken: (token: string) => void;
  setUsername: (username: string | null) => void;
}

function Login({ setToken, setUsername }: LoginProps) {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegister ? "register" : "login";
//decide api
    try {
      const res = await fetch(`http://localhost:5000/api/${endpoint}`, { //sends request using post
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });    

      const data = await res.json();

      if (res.ok) {
        if (isRegister) {
          // ✅ ONLY ALERT FOR REGISTER, DO NOT CALL setToken
          alert("✅ Registered successfully! Please login.");
          setIsRegister(false); // Switch to login
        } else {
          // ✅ LOGIN SUCCESS → go to editor
          setToken(data.token);// login sucess
          setUsername(data.username);
        }
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Server error!");
    }
  };

  return (
    <div className="app">
      <h2>{isRegister ? "Register" : "Login"}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          required
        />
        <br /><br />
        <input
          type="password"
          placeholder="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          required
        />
        <br /><br />
        <button type="submit">{isRegister ? "Register" : "Login"}</button>
      </form>

      <p
        style={{ cursor: "pointer", color: "#00c6ff", marginTop: "10px" }}
        onClick={() => setIsRegister(!isRegister)}
      >
        {isRegister
          ? "Already have an account? Login"
          : "Don't have an account? Register"}
      </p>
    </div>
  );
}

export default Login;