import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, getDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, ArrowLeft, MoreVertical, Shield } from 'lucide-react';

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
    <div className="bg-[#fcfdff] h-[calc(100vh-64px)] overflow-hidden">
      <div className="container mx-auto h-full flex md:p-6 p-0 md:gap-6">
        
        {/* Left Pane - Inbox */}
        <div className={`flex-col bg-white border border-slate-200 md:rounded-[2.5rem] shadow-sm overflow-hidden md:w-[400px] w-full ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-900">Inbox</h2>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-full">
              <MessageSquare size={20} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <MessageSquare size={32} />
                </div>
                <h3 className="font-bold text-slate-900">No messages yet</h3>
                <p className="text-sm text-slate-400 mt-2">Start a conversation from the job board!</p>
              </div>
            ) : (
              conversations.map(contact => (
                <div 
                  key={contact.uid} 
                  onClick={() => {
                    setActiveContact(contact);
                    setShowMobileChat(true);
                  }}
                  className={`px-8 py-6 cursor-pointer flex items-center gap-5 border-b border-slate-50 transition-all hover:bg-indigo-50/30 ${activeContact?.uid === contact.uid ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                >
                  <img src={contact.avatarUrl} alt="" className="w-14 h-14 rounded-full border border-slate-100 object-cover shadow-sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-extrabold text-slate-900 text-sm truncate">{contact.name}</h4>
                      {contact.unreadCount > 0 && (
                        <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate font-medium">
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Chat Window */}
        <div className={`flex-1 flex-col bg-white border border-slate-200 md:rounded-[2.5rem] shadow-sm overflow-hidden ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between shadow-sm z-10 bg-white">
                <div className="flex items-center gap-4">
                  <button 
                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-indigo-600"
                    onClick={() => setShowMobileChat(false)}
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div className="relative">
                    <img src={activeContact.avatarUrl} alt="" className="w-12 h-12 rounded-full border border-slate-100 object-cover" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg leading-tight">{activeContact.name}</h3>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      <Shield size={10} className="text-cyan-500" />
                      <span>Verified Client</span>
                    </div>
                  </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-600">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col gap-6 bg-[#fcfdff]">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 my-auto text-sm italic">
                    Be the first to say hello!
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    const isMine = msg.senderId === currentUser.uid;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} animate-fade-in`}>
                        <div className={`max-w-[80%] md:max-w-[65%] px-6 py-4 rounded-[2rem] shadow-sm text-sm font-medium leading-relaxed ${
                          isMine 
                            ? 'bg-slate-900 text-white rounded-tr-none' 
                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                        }`}>
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-slate-300 mt-2 font-bold uppercase tracking-widest px-2">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-8 bg-white border-t border-slate-100">
                <form onSubmit={handleSendMessage} className="flex gap-4 max-w-5xl mx-auto">
                  <input 
                    type="text" 
                    className="flex-1 px-8 py-4 bg-slate-50 border border-slate-100 rounded-full focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 font-medium transition-all"
                    placeholder="Write a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit" 
                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white rounded-full w-14 h-14 flex items-center justify-center transition-all shadow-lg shadow-indigo-100 hover:-translate-y-0.5"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} className="ml-1" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 p-8 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6">
                <MessageSquare size={48} className="opacity-20" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Your Conversations</h3>
              <p className="text-slate-400 mt-3 max-w-sm">Select a contact from the left to start chatting about your next world-class project.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
