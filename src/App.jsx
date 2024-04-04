import { useRef } from "react";
import "./App.css";
import { io } from "socket.io-client";
const socket = io("http://localhost:3000");
import CryptoJS from "crypto-js";
const displayMessage = (message) => {
  const div = document.createElement("div");
  div.textContent = message;
  document.getElementById("message-container").append(div);
};
const decryptMessage = (encryptedMessage) => {
  const key = CryptoJS.enc.Utf8.parse(socket.id);
  const decrypted = CryptoJS.AES.decrypt(encryptedMessage, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};
socket.on("connect", () => {
  displayMessage(`you joined with id ${socket.id}`);
});
socket.on("custom-recieve-message", (str) => {
  displayMessage(str);
});
socket.on("custom-dm-event", (encryptedMessage) => {
  console.log(encryptedMessage);
  const decryptedMessage = decryptMessage(encryptedMessage);
  displayMessage(`DM received: ${decryptedMessage}`);
});
function App() {
  const encryptMessage = (message, recipientId) => {
    const key = CryptoJS.enc.Utf8.parse(recipientId);
    const encrypted = CryptoJS.AES.encrypt(message, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
  };

  const messageInputRef = useRef(null);
  const roomInputRef = useRef(null);
  const dmInputRef = useRef(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const message = messageInputRef.current.value;
    const room = roomInputRef.current.value;
    const dmRecipient = dmInputRef.current.value; // Get the value of the DM input field

    if (message === "") return;

    // If the DM input field is not empty, send the message as a DM
    if (dmRecipient) {
      const encryptedMessage = encryptMessage(message, dmRecipient);
      console.log(encryptedMessage);
      displayMessage(`dm sent to ${dmRecipient}:- ${message}`);
      socket.emit("custom-sent-message", encryptedMessage, dmRecipient);
    } else {
      displayMessage(message);
      socket.emit("custom-sent-message", message, room);
    }

    messageInputRef.current.value = "";
    dmInputRef.current.value = ""; // Clear the DM input field
  };

  const handleJoinRoom = () => {
    const room = roomInputRef.current.value;
    socket.emit("custom-join-room", room, (message) => {
      displayMessage(message);
    }); //you can pass in client side function as a callback functions inside the emit and server can call client side functions.
  };

  return (
    <div className="flex flex-col h-screen">
      <div id="message-container" className="overflow-y-auto flex-grow"></div>
      <form
        onSubmit={handleSubmit}
        id="form"
        className="flex flex-col space-y-4 p-4"
      >
        {/* Input fields */}
        <div className="flex flex-col">
          <label htmlFor="message-input" className="mb-1">
            Message
          </label>
          <input
            type="text"
            id="message-input"
            ref={messageInputRef}
            className="border border-gray-400 rounded px-2 py-1"
          />
        </div>
        <button
          type="submit"
          id="send-button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
        <div className="flex flex-col">
          <label htmlFor="dm-input" className="mb-1">
            DM Recipient
          </label>
          <input
            type="text"
            id="dm-input"
            ref={dmInputRef}
            className="border border-gray-400 rounded px-2 py-1"
            placeholder="Enter the recipient's socket ID"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="room-input" className="mb-1">
            Room
          </label>
          <input
            type="text"
            id="room-input"
            ref={roomInputRef}
            className="border border-gray-400 rounded px-2 py-1"
          />
        </div>
        <button
          type="button"
          id="room-button"
          onClick={handleJoinRoom}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Join
        </button>
      </form>
    </div>
  );
}

export default App;
