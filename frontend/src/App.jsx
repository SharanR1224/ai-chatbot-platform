import { useEffect, useState } from "react";
import { login, getProjects, createProject, sendMessage, getMessages } from "./api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) loadProjects();
  }, [token]);

  async function loadProjects() {
    const data = await getProjects(token);
    setProjects(data);
    if (data.length > 0) {
      setCurrentProject(data[0]);
      const msgs = await getMessages(token, data[0].id);
      setMessages(msgs);
    }
  }

  async function handleLogin() {
    const res = await login(email, password);
    if (res.access_token) {
      localStorage.setItem("token", res.access_token);
      setToken(res.access_token);
    } else alert("Login failed");
  }

  async function handleCreateProject() {
    const name = prompt("Project name:");
    if (!name) return;
    await createProject(token, name);
    loadProjects();
  }

  async function handleSend() {
    if (!input || !currentProject || loading) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendMessage(token, currentProject.id, input);
      setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
    } catch {
      alert("AI error. Check backend.");
    }

    setLoading(false);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setProjects([]);
    setCurrentProject(null);
    setMessages([]);
  }

  // ---------------- LOGIN ----------------
  if (!token) {
    return (
      <div style={styles.loginBox}>
        <h2>AI Chat Platform</h2>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p style={{ opacity: 0.7 }}>Use your backend registered account</p>
      </div>
    );
  }

  // ---------------- UI ----------------
  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={{ marginBottom: 12 }}>AI Chat Platform</h2>

        <button style={styles.newBtn} onClick={handleCreateProject}>+ New Project</button>

        {projects.map(p => (
          <div
            key={p.id}
            onClick={async () => {
              setCurrentProject(p);
              const msgs = await getMessages(token, p.id);
              setMessages(msgs);
            }}
            style={{
              ...styles.project,
              background: currentProject?.id === p.id ? "#2563eb" : "#111"
            }}
          >
            {p.name}
          </div>
        ))}

        {/* LOGOUT BOTTOM */}
        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            style={{ ...styles.newBtn, background: "#dc2626", color: "white" }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* CHAT */}
      <div style={styles.chatArea}>
        <div style={styles.chatHeader}>
          <h2>{currentProject?.name}</h2>
          <div style={styles.profile}>👤 {email || "User"}</div>
        </div>

        <div style={styles.messagesWrapper}>
          <div style={styles.messages}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...styles.msg,
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  background: m.role === "user" ? "#2563eb" : "#222"
                }}
              >
                {m.content}
              </div>
            ))}

            {loading && <div style={{ opacity: 0.6 }}>AI is typing...</div>}
          </div>
        </div>

        <div style={styles.inputRow}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
            onKeyDown={e => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            style={{
              ...styles.sendBtn,
              opacity: loading ? 0.5 : 1,
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- STYLES ----------------

const styles = {
  container: { 
    display: "flex", 
    height: "100vh", 
    background: "#0f0f0f", 
    color: "white" 
  },

  sidebar: {
    width: 260,
    padding: 20,
    background: "#050505",
    display: "flex",
    flexDirection: "column"
  },

  newBtn: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "none",
    cursor: "pointer"
  },

  project: { 
    padding: 12, 
    borderRadius: 8, 
    marginTop: 6, 
    cursor: "pointer" 
  },

  chatArea: { 
    flex: 1, 
    display: "flex", 
    flexDirection: "column", 
    padding: 20 
  },

  chatHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  profile: {
    background: "#111",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 14,
    opacity: 0.9
  },

  /* ✅ FIXED PART */
  messagesWrapper: {
    flex: 1,
    display: "flex",
    overflow: "hidden"
  },

  messages: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
    overflowY: "auto",
    paddingRight: 10
  },

  msg: { 
    maxWidth: "70%", 
    padding: 12, 
    borderRadius: 12, 
    whiteSpace: "pre-wrap" 
  },

  inputRow: { 
    display: "flex", 
    gap: 10, 
    width: "100%" 
  },

  input: { 
    flex: 1, 
    padding: 12, 
    borderRadius: 10, 
    border: "none" 
  },

  sendBtn: { 
    padding: "12px 18px", 
    border: "none", 
    borderRadius: 8, 
    background: "#2563eb", 
    color: "white" 
  },

  loginBox: {
    height: "100vh",
    background: "#0f0f0f",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  }
};

