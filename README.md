# 📖 Verse AI – FYP Project

An AI-powered story generation platform where users can input a prompt via text or speech, select a genre, style, and duration, and receive a fully narrated, image-backed story video—all generated using cutting-edge AI models and cloud-based technologies.

---

## 🚀 Features

- 🔐 **User Authentication** with Firebase (Google & Email login)
- 📝 **Text or Voice Prompt Input** (Mic integration)
- 🎭 **Genre and Style Selection**
- ⏱️ **Custom Story Duration**
- 🧠 **LLM-based Story Generation** using GPT-4 (with model experiments from GPT-2, LLaMA, DeepSeek)
- 🖼️ **Image Generation** for each scene (Stable Diffusion & DALL·E)
- 🗣️ **Text-to-Speech Narration** via Google TTS
- 🎬 **Video Creation** combining narration + images
- ☁️ **Cloudinary Integration** for storing final videos (no local storage)
- 🌐 **Public/Private Toggle** for each generated story

---

## 🧠 Tech Stack

| Layer             | Technology Used                               |
|------------------|------------------------------------------------|
| **Frontend**      | React, Tailwind CSS, Framer Motion             |
| **Backend**       | Node.js (with Python services for ML)         |
| **LLMs**          | GPT-2, LLaMA (fine-tuned), DeepSeek, GPT-4     |
| **Image Models**  | Stable Diffusion, DALL·E                       |
| **TTS**           | gTTS (Google Text-to-Speech)                   |
| **Video Rendering**| ffmpeg or equivalent logic                    |
| **Auth**          | Firebase Authentication                        |
| **Storage**       | Cloudinary                                     |

---

## 📸 How It Works

1. **User Login** – via Firebase (Google or email).
2. **Prompt Input** – via text or microphone.
3. **User Customization** – choose genre, image style, duration, and privacy.
4. **Story Generation** – handled by GPT-4 (earlier GPT-2, LLaMA, DeepSeek experiments).
5. **Scene Image Creation** – generated via DALL·E (Stable Diffusion tested earlier).
6. **Narration** – with gTTS converting the text story to audio.
7. **Video Compilation** – image + audio stitched as a playable story.
8. **Cloud Upload** – final video stored securely on Cloudinary.
9. **Playback/Share** – user can view or share story (public/private setting).

---

## Install Frontend
cd client
npm install
npm run dev

## Install Backend
cd server
npm install
npm run dev

## Setup your .env files with:
Firebase credentials
Cloudinary API keys
OpenAI or LLM API keys