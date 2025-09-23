import { useEffect, useRef, useState } from "react";
import axios from "axios";
import {FaTelegram} from "react-icons/fa"
import { removeauth } from "../Utils/auth";
import {io} from 'socket.io-client'
import { useNavigate } from "react-router-dom";

const socket = io(import.meta.env.VITE_BACKEND_BASEURL,{
  transports: ["websocket"],
})



export default function ChatWindow({ activeChat, currentUser, token }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const navigate = useNavigate()
  const { user: otherUser, conversation } = activeChat;
  console.log("Chatwindow conversation:", conversation);

  const messageEndRef = useRef(null);
  // Auto scroll
  const ScrollToBottom = ()=>{
    messageEndRef.current?.scrollIntoView({behavior: "Smooth"})
  }
  useEffect(ScrollToBottom,[messages])
  const handlelogout = ()=>{
    removeauth()
    navigate("/login")
  }

 
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/chats/messages/${conversation._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(" Messages fetched:", res.data);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error(" Error fetching messages", err.response?.data || err);
      }
    };

    if(conversation?._id){
      fetchMessages();
      // join socket room
      socket.emit("joinRoom", conversation._id)

      // listen for new message
      socket.on("receiveMessage", (msg)=>{
        if(msg.roomId === conversation._id){
          setMessages((prev)=> [...prev, msg])
        }
      })

    }

    return ()=>{
      socket.off("receiveMessage")
    }

    
  }, [conversation._id, token]);

  // Send message
  const handleSend = async () => {
    if (!text.trim()) return;

    try {
      const payload = {
        roomId: conversation._id,
        senderId: currentUser._id,
        receiverId: otherUser._id,
        text,
      };

      console.log(" Sending payload:", payload);

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/chats/send`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(" Message sent:", res.data);

      // Append new message to chat
      setMessages((prev) => [...prev, res.data.message]);
      setText(""); 
    } catch (err) {
      console.error(" Error when sending message", err.response?.data || err);
    }
  };

  return (
    <div className="p-4 space-y-3 overflow-y-auto bg-gray-50 rounded-lg overflow-hidden shadow-xl flex flex-col h-full">
      <div className="flex justify-between text-white rounded-t-lg shadow-md p-4 bg-blue-600 items-center border-b ">
        <h2 className="text-lg font-bold">
           Chats with {otherUser?.username}
        </h2>
        <button onClick={handlelogout} className='bg-red-500 p-2 rounded-lg hover:bg-red-600'>Logout</button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg,i)=>{
          const isMine = msg.sender._id === currentUser._id;
          return(
            <div
            key={i}
            className={`flex items-end ${isMine?"justify-end":"justify-start"}`}
            >
              {/*Avatar*/}
              {!isMine&&(
                <div className="w-8 h-8 bg-blue-200 flex text-white mr-2 justify-center items-center rounded-full">
                  {otherUser.username.charAt(0).toUpperCase()}
                </div>
                

              )}

              <div className={`p-3 rounded-xl max-w-xs break-words shadow-md ${
                isMine?"bg-blue-500 text-white rounded-br-none":"bg-white rounded-bl-none text-gray-800"
              }`}>

                <div>{msg.text}</div>

                <div className="text-xs text-gray-500 mt-1 text-right font-semibold">
                  {new Date(msg.createdAt).toLocaleTimeString([],{
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </div>
              </div>

            </div>
          )
        })}
        <div ref={messageEndRef}></div>
      </div>

      <div className="flex p-4 border-t">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 focus:ring-blue-500 py-2 mr-2 focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg"
        >
          
          <FaTelegram size={25}/>
        </button>
      </div>
    </div>
  );
}
