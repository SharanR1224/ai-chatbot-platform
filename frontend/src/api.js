const API = "https://chatbot-backend-pveb.onrender.com";

export async function login(email, password) {
  const form = new URLSearchParams();
  form.append("username", email);   // OAuth2 expects "username"
  form.append("password", password);

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form
  });

  return res.json();
}


export async function getProjects(token) {
  const res = await fetch(`${API}/projects/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createProject(token, name) {
  const res = await fetch(`${API}/projects/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name })
  });
  return res.json();
}

export async function sendMessage(token, projectId, message) {
  const res = await fetch(`${API}/chat/${projectId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ message })
  });
  return res.json();
}

export async function getMessages(token, projectId) {
  const res = await fetch(`${API}/chat/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

