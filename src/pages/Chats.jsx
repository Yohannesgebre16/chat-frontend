import Sidebar from "./Sidebar"
import ChatWindow from "./ChatWindow"
import axios from "axios"
import { FaTypo3 , FaComment, FaComments } from "react-icons/fa"
import { useEffect, useState } from "react"
import { getauth } from "../Utils/auth"

export default function Chats() {
  const [users, setUsers] = useState([])
  const [activeChat, setActiveChat] = useState(null)


  const auth = getauth()

  if (!auth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-xl font-bold text-red-600">
          You are not logged in. Please login to access chats.
        </h1>
      </div>
    )
  }

  const { token, user } = auth


  console.log("Current user:", user)
  console.log("Token:", token)

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/users/`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        const otherUsers = res.data.users.filter(u => u._id !== user._id)


      const userswithLastMessage = await Promise.all(
  otherUsers.map(async (u) => {
    try {
      const conversationRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/rooms/create`,
        { userId1: user._id, userId2: u._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const conversation =
        conversationRes.data.conversation ||
        conversationRes.data.room ||
        conversationRes.data;

      if (!conversation._id) {
        console.error("No conversation._id for:", u._id);
        return { ...u, LastMessage: null };
      }

      const msgRes = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/chats/messages/${conversation._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const msgs = msgRes.data.messages || [];  
      const last = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      

      return {
        ...u,

        LastMessage: last,
        LastMessageTime: last
          ? new Date(last.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : null,
        conversation,
      };
    } catch (err) {
      console.error("Error fetching last message for user", u._id, err);
      return { ...u, LastMessage: null };
    }
  })
);
        console.log("Fetched users:", otherUsers)

        userswithLastMessage.sort((c,d)=>{
          const timeC = c.LastMessage? new Date(c.LastMessage.createdAt).getTime():0;
          const timeD = d.LastMessage? new Date(d.LastMessage.createdAt).getTime(): 0;
          return timeD - timeC;
        })



        setUsers(userswithLastMessage)
      } catch (err) {
        console.error("Error fetching users:", err)
      }
    }

    fetchUsers()
  }, [token, user._id])

  // Handle selecting a user
 const handleSelectUser = async (otherUser) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_BASEURL}/api/rooms/create`,
      { userId1: user._id, userId2: otherUser._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log(" Room creation response:", res.data);


    const conversation =
      res.data.conversation || res.data.room || res.data;

    if (!conversation._id) {
      console.error("No conversation._id in response:", res.data);
      return;
    }

    setActiveChat({ user: otherUser, conversation });
  } catch (err) {
    console.error(
      " Error starting conversation",
      err.response?.data || err
    );
  }
};



  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar users={users} onSelectUser={handleSelectUser} />

      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <ChatWindow
            activeChat={activeChat}
            currentUser={user}
            token={token}
          />
        ) : (
          <div className="bg-gray-900 flex-1 flex justify-center items-center">
            <h1 className="text-3xl animate-pulse font-bold text-white">
              <FaComments className="text-sky-500" size={30}/>Select a user to start chating</h1>
          </div>
        )}
      </div>
    </div>
  )
}

