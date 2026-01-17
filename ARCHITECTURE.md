# 📐 Architecture & Design

## Overview

The system is a multi-user chatbot platform with project-based AI agents.

Frontend (React) communicates with Backend (FastAPI) via REST APIs.

Backend handles:
- Authentication (JWT)
- User isolation
- Project management
- Chat storage
- AI communication via OpenRouter

---

## Architecture

[ React Frontend ]
        |
        | REST API
        |
[ FastAPI Backend ]
        |
        | SQLAlchemy ORM
        |
[ SQLite Database ]

Backend also connects to:
[ OpenRouter API ] → AI model responses

---

## Core Modules

Auth Module:
- User registration & login
- Password hashing
- JWT token creation

Project Module:
- Create chatbot agents
- Link projects to users

Chat Module:
- Store chat history
- Inject system prompt
- Send messages to LLM API
- Save AI responses

---

## Database Schema

User
- id
- email
- password

Project
- id
- name
- system_prompt
- user_id

Message
- id
- role
- content
- project_id
- timestamp

---

## Key Design Principles

- Secure route protection
- User data isolation
- Scalable modular structure
- Real AI integration
- Project-based agents
