# Chat & Mingle

## Introduction
Chat & Mingle is an online full-stack chatting application that connects people worldwide through real-time, anonymous conversations with a peer-to-peer connection model. Designed to foster meaningful interactions, it provides a safe and engaging platform where users can explore diverse perspectives, make new friends, and enjoy casual chats with individuals from different backgrounds and cultures.

Focused on privacy and anonymity, the app ensures secure interactions, encouraging users to step out of their comfort zones, exchange ideas, and experience the richness of global perspectives.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Usage Guide](#usage-guide)
4. [Testing](#testing)
5. [License](#license)

## Features

- **Real-Time Peer-to-Peer Chat**: Facilitates direct, secure, and real-time interactions between users, ensuring a smooth and private chatting experience.
- **Secure, Private, and Anonymous**: Prioritizes user privacy with encrypted communication, enabling safe, confidential, and anonymous interactions without revealing personal information.
- **No Signup Required**: Users can access the platform without the need for signup or registration, making it quick and easy to start chatting.
- **CAPTCHA Verification**: Ensures that users are human by requiring CAPTCHA verification before accessing the chat, preventing bots and ensuring a genuine experience.
- **Report User Button**: Allows users to report inappropriate behavior or violations of platform guidelines, helping maintain a safe and respectful environment.

## Technologies Used

### 1. Frontend
- **HTML5**: For structuring the content and layout of the application.
- **CSS3**: For styling and creating a responsive, user-friendly interface.
- **JavaScript**: For client-side logic and real-time interaction within the chat.
- **EJS (Embedded JavaScript)**: For rendering dynamic HTML templates on the frontend.

### 2. Backend
- **Node.js**: A JavaScript runtime used for building the server-side logic and handling requests.
- **Express.js**: A web framework for Node.js, used to build the RESTful API and manage routing and server-side logic.

### 3. Database
- **MongoDB**: A NoSQL database for storing user activity logs and other data, providing scalability and flexibility.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, used to interact with the database.

### 4. Real-Time Communication
- **WebSockets**: Provides a persistent, full-duplex communication channel between the client and server, enabling low-latency messaging and seamless real-time updates during chat sessions.
- **WebRTC**: Establishes direct peer-to-peer communication between users, supporting real-time audio, video, and data sharing without routing traffic through the server, which optimizes performance and reduces server load.

### 5. Security and Authentication
- **reCAPTCHA**: Integrated to prevent bots from accessing the platform by verifying that users are human.
- **JWT (JSON Web Tokens)**: Used for securely transmitting user authentication tokens between the server and the client.


## Usage Guide
### 1. Accessing the Platform
- Visit the [Chat & Mingle](https://chat-and-mingle.onrender.com/) website, hosted on Render, a cloud platform, through any modern browser.  Since it's running on the free tier, please allow up to *50 seconds* for the application to initialize and fully load.

  ![c1](https://github.com/user-attachments/assets/a05ce7e1-4432-4af0-8657-b6d90c06b6d0)

### 2. CAPTCHA Verification
- Click *Start Chatting* to begin. Check the box to confirm you're not a robot, solve the CAPTCHA challenge to verify you're human, and then click *Submit* to proceed.

  ![c2](https://github.com/user-attachments/assets/4909e116-1999-40c2-8506-6147d8c9d923)

### 3. Start your Chat
- Once the CAPTCHA is complete, you'll be connected to another user in a peer-to-peer chat session. Type your message and press Enter or click the Send button to send. The conversation will happen in real-time, and you'll see messages instantly.
- To switch to a new chat, simply click the *Next* button. This will end your current conversation and connect you to a new anonymous user, allowing for a smooth transition to the next chat.
  
  ![c3](https://github.com/user-attachments/assets/1d4152a0-5807-446c-ae51-6e6ecce04042)

## Testing
- If you see *1 online now*, it means you're the only one online. To establish a peer-to-peer connection, at least two users are required. Therefore, open the Chat & Mingle website in two different browsers or on two separate devices.
- Once both browsers are open and the CAPTCHA verification is completed on each, you'll be connected for a peer-to-peer chat session with yourself.
- Else, if there is more than one user online, you will be automatically connected to an anonymous peer for a real-time chat session.


## License
This project is proprietary and not licensed for public use - see the [LICENSE](LICENSE) file for details.


