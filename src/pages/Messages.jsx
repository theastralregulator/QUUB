import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, getDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, ArrowLeft } from 'lucide-react';

export default function Messages() {
  const { currentUser, userData } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Extract contactId from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const contactId = params.get('contactId');
    if (contactId && contactId !== activeContact?.uid) {
      getDoc(doc(db, "Users", contactId)).then(snap => {
        if (snap.exists()) {
          setActiveContact({ uid: snap.id, ...snap.data() });
          setShowMobileChat(true);
          navigate('/messages', { replace: true });
        }
      });
    }
  }, [location, navigate, activeContact]);

  // Fetch unique conversations
  useEffect(() => {
    if (!currentUser) return;

    const q1 = query(collection(db, "Messages"), where("senderId", "==", currentUser.uid));
    const q2 = query(collection(db, "Messages"), where("receiverId", "==", currentUser.uid));

    let sentMsgs = [];
    let receivedMsgs = [];

    function processMessages(msgs, type) {
      if (type === 'sent') sentMsgs = msgs;
      if (type === 'received') receivedMsgs = msgs;
      
      const combined = [...sentMsgs, ...receivedMsgs];
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      const uniqueContacts = new Map();
      
      combined.forEach(msg => {
        const isSender = msg.senderId === currentUser.uid;
        const contactId = isSender ? msg.receiverId : msg.senderId;
        const contactName = isSender ? msg.receiverName : msg.senderName;
        const contactAvatar = isSender ? msg.receiverAvatar : msg.senderAvatar;
        
        if (!uniqueContacts.has(contactId)) {
          uniqueContacts.set(contactId, {
            uid: contactId,
            name: contactName,
            avatarUrl: contactAvatar,
            lastMessage: msg.content,
            timestamp: msg.createdAt,
            unreadCount: (!isSender && !msg.isRead) ? 1 : 0
          });
        } else {
          if (!isSender && !msg.isRead) {
            const c = uniqueContacts.get(contactId);
            c.unreadCount += 1;
          }
        }
      });
      
      setConversations(Array.from(uniqueContacts.values()));
    }

    const unsubscribe1 = onSnapshot(q1, (snap) => {
      processMessages(snap.docs.map(d => ({id: d.id, ...d.data()})), 'sent');
    });
    
    const unsubscribe2 = onSnapshot(q2, (snap) => {
      processMessages(snap.docs.map(d => ({id: d.id, ...d.data()})), 'received');
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [currentUser]);

  // Listen for messages in active conversation
  useEffect(() => {
    if (!currentUser || !activeContact) return;

    const convId = [currentUser.uid, activeContact.uid].sort().join('_');
    const q = query(collection(db, "Messages"), where("conversationId", "==", convId));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map(document => ({ id: document.id, ...document.data() }));
      msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(msgs);
      
      const batch = writeBatch(db);
      let hasUnread = false;
      snapshot.docs.forEach(document => {
        const data = document.data();
        if (data.receiverId === currentUser.uid && !data.isRead) {
          batch.update(doc(db, "Messages", document.id), { isRead: true });
          hasUnread = true;
        }
      });
      if (hasUnread) {
        await batch.commit();
      }
    });

    return unsubscribe;
  }, [currentUser, activeContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;

    const content = newMessage.trim();
    setNewMessage('');
    const convId = [currentUser.uid, activeContact.uid].sort().join('_');

    try {
      await addDoc(collection(db, "Messages"), {
        conversationId: convId,
        senderId: currentUser.uid,
        senderName: userData?.name || "User",
        senderAvatar: userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        receiverId: activeContact.uid,
        receiverName: activeContact.name || "User",
        receiverAvatar: activeContact.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeContact.uid}`,
        content: content,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <div className="container mx-auto px-0 md:px-4 py-0 md:py-6" style={{ height: 'calc(100vh - 64px)' }}>
      <div className="bg-white md:rounded-2xl border-0 md:border border-gray-200 overflow-hidden shadow-sm flex h-full">
        
        {/* Left Pane - Contacts */}
        <div className={`w-full md:w-[350px] border-r border-gray-200 flex flex-col bg-white ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Inbox</h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No active conversations.
              </div>
            ) : (
              conversations.map(contact => (
                <div 
                  key={contact.uid} 
                  onClick={() => {
                    setActiveContact(contact);
                    setShowMobileChat(true);
                  }}
                  className={`p-4 cursor-pointer flex items-center gap-4 border-b border-gray-100 transition-colors hover:bg-gray-50 ${activeContact?.uid === contact.uid ? 'bg-green-50' : ''}`}
                >
                  <img src={contact.avatarUrl} alt={contact.name} className="w-12 h-12 rounded-full object-cover border border-gray-200" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-gray-900 text-sm truncate pr-2">{contact.name}</h4>
                      {contact.unreadCount > 0 && (
                        <span className="bg-[#1dbf73] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Chat */}
        <div className={`flex-1 flex flex-col bg-[#f7f9fa] ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm z-10">
                <button 
                  className="md:hidden mr-3 p-2 -ml-2 text-gray-500 hover:text-[#1dbf73] transition-colors"
                  onClick={() => setShowMobileChat(false)}
                >
                  <ArrowLeft size={24} />
                </button>
                <img src={activeContact.avatarUrl} alt={activeContact.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 mr-3" />
                <h3 className="font-bold text-gray-900">{activeContact.name}</h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 my-auto">
                    Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderId === currentUser.uid;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] md:max-w-[70%] p-3 md:p-4 rounded-2xl shadow-sm ${
                          isMine 
                            ? 'bg-[#1dbf73] text-white rounded-br-sm' 
                            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-gray-400 mt-1 font-medium px-1">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-4 max-w-4xl mx-auto">
                  <input 
                    type="text" 
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#1dbf73] focus:ring-1 focus:ring-[#1dbf73] transition-all"
                    placeholder="Type your message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="bg-[#1dbf73] hover:bg-[#19a463] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full w-12 h-12 flex items-center justify-center transition-colors shrink-0 shadow-md"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <MessageSquare size={64} className="opacity-20 mb-4" />
              <h3 className="text-xl font-bold text-gray-700">Your Messages</h3>
              <p className="text-gray-500 mt-2">Select a conversation from the sidebar to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
