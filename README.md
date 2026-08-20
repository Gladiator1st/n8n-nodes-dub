# n8n-nodes-dub

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-orange)
![npm version](https://img.shields.io/npm/v/@gladiator1st/n8n-nodes-dub)
![License](https://img.shields.io/npm/l/@gladiator1st/n8n-nodes-dub)

Official community node for **[Dub.co](https://dub.co)** in **n8n**. Create branded short links, generate high-resolution QR codes, track real-time click and conversion analytics, and integrate with AI Agents using LangChain tools!

---

## ⚡ Key Features

- **🔗 Short Links Management:** Create, retrieve, update, list, and delete custom branded links (`POST /links`, `GET /links`, `PATCH /links`, `DELETE /links`).
- **📱 Custom QR Codes:** Generate customized QR codes for any URL on the fly.
- **📊 Real-Time Analytics:** Query click counts, leads, sales, and group by country, city, device, browser, or referrers.
- **🏷️ Tag & Domain Organization:** Categorize links by marketing campaign tags and manage custom domains.
- **🤖 Autonomous AI Agent Tool (`usableAsTool: true`):** Wire directly into LangChain AI Agents to allow agents to generate short links and QR codes dynamically!

---

## 📦 Installation

### In n8n UI (Self-Hosted / Cloud Verified)
1. Go to **Settings > Community Nodes**.
2. Click **Install a community node**.
3. Enter `@gladiator1st/n8n-nodes-dub` and confirm.

---

## 🔑 Credentials Setup

1. Log into your **[Dub.co Dashboard](https://app.dub.co)**.
2. Go to **Settings > API Keys** and generate an API key.
3. In n8n, create a new credential for **Dub.co API** and paste your API key.

---

## 👨‍💻 Author

**Muhammad Qasim**
- GitHub: [@Gladiator1st](https://github.com/Gladiator1st)
- Email: qasimasif958@gmail.com

## 📄 License

[MIT](LICENSE)
