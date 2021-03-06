// Allows us to create a websocket
import io from "socket.io-client";
import React, { useState, useEffect } from 'react';

const username = prompt("What is your username?");

// Open socket.io server to localhost:3000
const socket = io("http://localhost:3000",{
  // Need to specify transports in order to bypass waiting messages (buffers)
  transports: ["websocket", "polling"]
})

function App() {

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Creating a list of events for socket.io
  useEffect(()=> {
      socket.on("connect", () => {
        socket.emit("username", username)
      });

      socket.on("users", users => {
        setUsers(users)
      });

      socket.on("message", message => {
        setMessages(messages => [...messages, message])
      });

      socket.on("connected", user => {
        setUsers(users => [...users, user]);
      })

      socket.on("disconnected", id => {
        setUsers(users => {
            users.filter(user => user.id !== id);
        });
      });
  }, []);

  function handleSubmit(e){
    e.preventDefault();
    socket.emit("send", message);
    setMessage("")
  }

  return (
    <div>
    
    </div>
  );
}

export default App;
