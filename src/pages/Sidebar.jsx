import React from 'react';
import { formatTime } from '../Utils/formatTime';

function Sidebar({ users, onSelectUser }) {
  return (
    <div className="w-64 flex flex-col h-full bg-white dark:bg-gray-800 border-r shadow-xl overflow-y-auto">
      
      {/* Header */}
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between shadow-md">
        <h2 className="text-lg font-bold tracking-wide uppercase">Chats</h2>
      </div>

      {/* User list */}
      <ul className="flex-1 overflow-y-auto">
        {users.map((u) => {
          const LastMessage = u.LastMessage ? u.LastMessage.text : "No messages yet";
          const LastMessageTime = u.LastMessage ? formatTime(u.LastMessage.createdAt) : "";

          return (
            <li
              key={u._id}
              onClick={() => onSelectUser(u)}
              className="p-3 md:p-4 border-b cursor-pointer flex items-center hover:bg-indigo-100 dark:hover:bg-gray-700 transition-colors duration-300 group"
            >
              {/* Avatar */}
              <div className="w-12 h-12 md:w-10 md:h-10 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white rounded-full flex-shrink-0 text-lg font-bold shadow">
                {u.username.charAt(0).toUpperCase()}
              </div>

              {/* Username + last message */}
              <div className="flex-1 ml-3 overflow-hidden">
                
                {/* Top row: name + time */}
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-700 transition-colors duration-300">
                    {u.username}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                    {LastMessageTime}
                  </span>
                </div>

                {/* Bottom row: last message */}
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                  {LastMessage.length > 35 ? LastMessage.substring(0, 35) + "..." : LastMessage}
                </p>

              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
