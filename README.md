# @gladiator1st/n8n-nodes-dub

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-orange?style=flat-square)
[![npm version](https://img.shields.io/npm/v/@gladiator1st/n8n-nodes-dub?style=flat-square&color=cb3837)](https://www.npmjs.com/package/@gladiator1st/n8n-nodes-dub)
[![npm downloads](https://img.shields.io/npm/dt/@gladiator1st/n8n-nodes-dub?style=flat-square&color=blue)](https://www.npmjs.com/package/@gladiator1st/n8n-nodes-dub)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)

Official n8n community node for **[Dub.co](https://dub.co)** — the modern, open-source link management platform. Create branded short links, generate customized high-resolution QR codes, track real-time click and conversion analytics, and connect directly with LangChain AI Agents using dynamic tools!

---

## ⚡ Superpowers Included

```text
                      ┌─────────────────────────────────────────────────────┐
                      │          @gladiator1st/n8n-nodes-dub                │
                      └──────────────────────────┬──────────────────────────┘
                                                 │
        ┌──────────────────────────────┬─────────┴─────────┬──────────────────────────────┐
        ▼                              ▼                   ▼                              ▼
 🔗 Link Operations             📱 QR Codes         📊 Real-Time Analytics          🏷️ Tags & Domains
 • Create (Branded Slugs)       • Generate Custom   • Clicks, Leads & Sales         • Create & List Tags
 • Get & List Many Links          Resolution QRs    • Group by Country, City,       • View Verified Workspace
 • Update Destination URL                             Device, Browser & Referrers     Custom Domains
 • Delete Links by ID
```

---

## 📦 Key Capabilities

- **🔗 Branded Short Links:** Create, update, retrieve, list, and delete custom branded short links on `dub.sh` or your verified custom domains.
- **📱 Dynamic QR Code Generation:** Instantly generate customizable high-resolution QR codes for marketing flyers, campaigns, or social posts.
- **📊 Granular Analytics & Attribution:** Query click counts, conversion leads, and sales broken down by country, city, device, browser, referrer, or hourly/daily timeseries.
- **🏷️ Campaign Organization:** Tag and categorize links dynamically across marketing channels.
- **🤖 Autonomous AI Agent Tool (`usableAsTool: true`):** Connect directly into LangChain AI Agents or Tools Agents in n8n so AI assistants can shorten links and output QR codes dynamically during conversation.

---

## 🚀 Installation

### In n8n UI (Community Nodes)
1. In your n8n instance, go to **Settings** ➔ **Community Nodes**.
2. Click **Install a community node**.
3. Enter:
   ```text
   @gladiator1st/n8n-nodes-dub
   ```
4. Confirm the installation terms and click **Install**.

---

## 🔑 Credentials Setup

1. Sign up or log into your **[Dub.co Dashboard](https://app.dub.co)**.
2. Navigate to **Settings** ➔ **API Keys** and generate a new API key.
3. In n8n, create a new credential for **Dub.co API** and paste your API key.

---

## 📖 Step-by-Step Usage Examples

### Example 1: Create a Custom Branded Short Link

This workflow demonstrates how to generate a custom branded short link from a long URL (e.g. from an RSS feed, webhook trigger, or blog post).

```text
┌──────────────────────────────┐
│ Webhook / Form Trigger       │ ➔ Long URL: "https://example.com/blog/how-to-scale-ai-agents"
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Dub.co (Resource: Link)      │ ➔ Resource: Link | Operation: Create
└──────────────┬───────────────┘   Slug: "ai-agents" | Domain: "dub.sh"
               │
               ▼
┌──────────────────────────────┐
│ Output: Branded Short Link   │ ➔ Returns "https://dub.sh/ai-agents" & tracking metadata
└──────────────────────────────┘
```

#### Node Parameters:
- **Resource:** `Link`
- **Operation:** `Create`
- **Destination URL:** `https://example.com/blog/how-to-scale-ai-agents`
- **Short Key / Slug:** `ai-agents` *(leave blank for a randomly generated slug)*
- **Custom Domain:** `dub.sh` *(or select your custom verified domain)*

#### Sample Output Returned by the Node:
```json
{
  "id": "clk_01j7abc123def456ghi",
  "domain": "dub.sh",
  "key": "ai-agents",
  "url": "https://example.com/blog/how-to-scale-ai-agents",
  "shortLink": "https://dub.sh/ai-agents",
  "qrCode": "https://api.dub.co/qr?url=https://dub.sh/ai-agents",
  "clicks": 0,
  "leads": 0,
  "sales": 0,
  "createdAt": "2026-09-04T12:00:00.000Z",
  "updatedAt": "2026-09-04T12:00:00.000Z"
}
```

---

### Example 2: Retrieve Link Click Analytics & Geographic Insights

Query real-time click and conversion statistics for a specific link or across your entire workspace, grouped by geographic country or referrer.

```text
┌──────────────────────────────┐
│ Daily Schedule Trigger       │ ➔ Runs every morning at 9:00 AM
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Dub.co (Analytics)           │ ➔ Resource: Analytics | Operation: Get Clicks Analytics
└──────────────┬───────────────┘   Group By: Countries | Interval: Last 7 Days
               │
               ▼
┌──────────────────────────────┐
│ Slack / Email Notification   │ ➔ Sends daily geographic engagement summary
└──────────────────────────────┘
```

#### Node Parameters:
- **Resource:** `Analytics`
- **Operation:** `Get Clicks Analytics`
- **Event Type:** `Clicks`
- **Group By:** `Countries`
- **Interval:** `Last 7 Days`
- **Filter by Link ID:** `clk_01j7abc123def456ghi` *(optional, leave empty for workspace-wide aggregate)*

#### Sample Output Returned by the Node:
```json
[
  {
    "country": "US",
    "city": "Wildwood",
    "clicks": 1420
  },
  {
    "country": "GB",
    "city": "London",
    "clicks": 532
  },
  {
    "country": "DE",
    "city": "Frankfurt",
    "clicks": 310
  }
]
```

---

### Example 3: Generate Dynamic High-Resolution QR Codes

Generate a high-resolution QR code image for print media, event badges, or marketing campaigns.

```text
┌──────────────────────────────┐
│ Campaign Trigger             │ ➔ Campaign Link: "https://dub.sh/ai-agents"
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│ Dub.co (Resource: QR Code)   │ ➔ Resource: QR Code | Operation: Generate
└──────────────┬───────────────┘   URL: "https://dub.sh/ai-agents" | Size: 600px
               │
               ▼
┌──────────────────────────────┐
│ Output: QR Image URL / SVG   │ ➔ Send via email or attach to customer receipt
└──────────────────────────────┘
```

#### Node Parameters:
- **Resource:** `QR Code`
- **Operation:** `Generate`
- **QR Code URL:** `https://dub.sh/ai-agents`
- **Size (Pixels):** `600`

#### Sample Output Returned by the Node:
```json
{
  "url": "https://api.dub.co/qr?url=https://dub.sh/ai-agents&size=600",
  "status": 200,
  "contentType": "image/png"
}
```

---

### Example 4: Autonomous AI Agent Integration (`usableAsTool: true`)

Attach the **Dub.co** node directly to an **AI Agent** (e.g. OpenAI or Gemini) in n8n. The AI agent will autonomously decide when to shorten long URLs or provide QR codes during conversational user chats.

```text
┌──────────────────────────────┐       ┌────────────────────────────┐
│ AI Agent (OpenAI / Gemini)   │ ◄──── │ Dub.co Node as Tool        │
└──────────────┬───────────────┘       └────────────────────────────┘
               │
               ▼
┌──────────────────────────────┐
│ "Here is your branded link:  │ ➔ The agent dynamically invoked Dub.co
│  https://dub.sh/ai-agents"   │   and returned the short URL to the user!
└──────────────────────────────┘
```

---

## 🛠️ Operations & Parameters Reference

| Resource | Operation | Description | Required Parameters |
| :--- | :--- | :--- | :--- |
| **Link** | `Create` | Create a new branded short link | `Destination URL` |
| **Link** | `Get` | Retrieve details and metadata for a specific link | `Link ID` |
| **Link** | `Get Many` | List many short links in the workspace | — *(Optional `Custom Domain`, `Limit`)* |
| **Link** | `Update` | Update the destination URL of an existing short link | `Link ID`, `New Destination URL` |
| **Link** | `Delete` | Permanently delete a short link by ID | `Link ID` |
| **QR Code** | `Generate` | Generate a customized high-resolution QR code image | `QR Code URL` |
| **Analytics** | `Get Clicks Analytics` | Retrieve real-time click and conversion analytics | — *(Optional `Event Type`, `Group By`, `Interval`, `Link ID`)* |
| **Tag** | `Create` | Create a new colored organization tag | `Tag Name`, `Tag Color` |
| **Tag** | `Get Many` | List all tags configured in the workspace | — |
| **Domain** | `Get Many` | List all verified custom domains in the workspace | — |

---

## 👨‍💻 Author

**Muhammad Qasim**
- GitHub: [@Gladiator1st](https://github.com/Gladiator1st)
- Email: qasimasif958@gmail.com

---

## 📄 License

[MIT](LICENSE) © Muhammad Qasim
