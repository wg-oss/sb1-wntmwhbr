import React, { useState, useEffect } from 'react';
import { Send, Phone, Video, Info, ArrowLeft } from 'lucide-react';
import { User } from '../types';

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
}

interface MessagingInterfaceProps {
  currentUser: User;
  recipient: User;
  onClose: () => void;
  onViewProfile: (user: User) => void;
  initialMessages?: Message[];
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({
  currentUser,
  recipient,
  onClose,
  onViewProfile,
  initialMessages = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleViewProfileAndClose = () => {
    onViewProfile(recipient); // Navigate to the recipient's profile
    onClose(); // Close the chat
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-50">
      <div className="p-3 border-b flex items-center gap-3 bg-white">
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleViewProfileAndClose} // Updated to call both actions
        >
          <img
            src={recipient.photo}
            alt={recipient.name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <span className="font-semibold">{recipient.name}</span>
            <p className="text-xs text-gray-500">{recipient.company}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-blue-500 cursor-pointer" />
          <Video className="w-5 h-5 text-blue-500 cursor-pointer" />
          <Info className="w-5 h-5 text-blue-500 cursor-pointer" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => {
          const isCurrentUser = message.senderId === currentUser.id;
          return (
            <div
              key={message.id}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isCurrentUser
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900'
                }`}
              >
                <p className="text-sm sm:text-base">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 rounded-full bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessagingInterface;