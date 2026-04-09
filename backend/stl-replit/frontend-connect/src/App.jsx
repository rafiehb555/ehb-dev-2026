import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import { clearSession, getSessionUser, login, saveSession, signup } from "./services/api";

function AuthPanel({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setError("");
      if (mode === "login") {
        const res = await login(email, password);
        saveSession(res.data.token, res.data.user);
      } else {
        const res = await signup({ userId, email, password });
        saveSession(res.data.token, res.data.user);
      }
      onAuthed(getSessionUser());
    } catch (e) {
      setError(e?.response?.data?.msg || "Auth failed");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "40px auto", padding: 20, border: "1px solid #1f2937", borderRadius: 12 }}>
      <h2>{mode === "login" ? "Login" : "Signup"}</h2>
      {mode === "signup" ? (
        <input
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ display: "block", width: "100%", marginBottom: 10 }}
        />
      ) : null}
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 10 }}
      />
      <button onClick={submit}>{mode === "login" ? "Login" : "Signup"}</button>
      <button onClick={() => setMode(mode === "login" ? "signup" : "login")} style={{ marginLeft: 8 }}>
        Switch to {mode === "login" ? "Signup" : "Login"}
      </button>
      {error ? <p style={{ color: "tomato" }}>{error}</p> : null}
    </div>
  );
}

function App() {
  const [session, setSession] = useState(() => getSessionUser());

  if (!session?.userId) {
    return <AuthPanel onAuthed={setSession} />;
  }

  return (
    <>
      <div style={{ padding: "8px 20px" }}>
        <button
          onClick={() => {
            clearSession();
            setSession(null);
          }}
        >
          Logout
        </button>
      </div>
      <Dashboard userId={session.userId} />
    </>
  );
}

export default App;

