<p align="center">
  <img src="/chatty-banner.png" alt="Chatty Banner" width="100%">
</p>

<p align="center">
**Chatty** is a modern real-time messaging application built using the **MERN stack**, powered by **Socket.io**, and styled with **TailwindCSS + DaisyUI**.  
It supports **JWT authentication**, **real-time messaging**, **online presence**, **image uploads**, and **AES-256 database-level encryption** for secure message storage.
</p>


![Demo App]()




---

##  Features

-  **Real-time messaging** with Socket.io  
-  **AES-256 encrypted** messages and images (server-side)  
-  **JWT authentication** & protected routes  
-  **Online/offline user presence** indicator  
-  **Image upload support** via Cloudinary  
-  **Global state management** using Zustand  
-  **Responsive UI** built with TailwindCSS + DaisyUI  
-  **Clean and modular** folder structure  
-  **Live updates** through WebSockets  
-  **Fully MERN-based architecture**


---

## Encryption (Database-Level AES-256)

Chatty uses **AES-256-CBC** encryption to protect:
- Message text
- Image URLs
  
 Messages stored in MongoDB are encrypted like this:
```makefile
iv:ciphertext
```

 Example stored value:
```ruby
dhtuzgm5dzd19jpgayaing==:tY+J/lmglkjaNM5llR94Qpz1fg...
```
 But the frontend still receives decrypted data, so users see:
```ruby
Hi
https://cloudinary.com/.../image.jpg
```

- MongoDB never stores plaintext
- Backend handles encryption & decryption
- Perfect for secure messaging applications
---


##  Tech Stack

### **Frontend**
- React (Vite)
- TailwindCSS
- DaisyUI
- Zustand
- Socket.io Client

### **Backend**
- Node.js + Express
- MongoDB + Mongoose
- Socket.io
- JWT Authentication
- AES-256 Encryption
- Bcrypt (password hashing)
- Cloudinary (Image uploads)

---

##  Installation & Setup

###  Clone the Project
```bash
git clone <your-repo-url>
cd chatty
```


### Setup .env file

```js
MONGODB_URI=...
PORT=5001
JWT_SECRET=...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
MESSAGE_SECRET_KEY=...
NODE_ENV=development
```

### Build the app

```shell
npm run build
```

### Start the app

```shell
npm start
```
---
##  API Routes

###  Auth Routes

| Method | Endpoint                   | Description                   |
|--------|-----------------------------|-------------------------------|
| POST   | /api/auth/signup           | Register a new user           |
| POST   | /api/auth/login            | Login & receive JWT           |
| POST   | /api/auth/logout           | Clear JWT cookie              |
| GET    | /api/auth/check            | Validate logged-in user       |
| PUT    | /api/auth/update-profile   | Update profile picture        |


###  Message Routes

| Method | Endpoint                 | Description                           |
|--------|---------------------------|---------------------------------------|
| GET    | /api/messages/users       | Get all users except current          |
| GET    | /api/messages/:id         | Get chat history (AES decrypted)      |
| POST   | /api/messages/send/:id    | Send text/image message               |

---


##  Real-Time Flow (Socket.io)

- User logs in → frontend sends `userId` in handshake  
- Backend stores `socketId`  
- When user sends a message → backend saves **encrypted** message  
- Backend emits **decrypted** message to the receiver  
- Receiver sees the message instantly  
---
##  Message Encryption Flow

**Before storing → Encrypt**
```js
const encrypted = encryptValue(text);
```
**After fetching → Decrypt**
```js
const decrypted = decryptValue(message.text);

```
**MongoDB never stores readable messages.**

---
<p align="center">
  <b>Chatty — <i>Simple. Fast. Real-Time.</i></b>
</p>


