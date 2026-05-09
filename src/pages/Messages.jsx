import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, addDoc, getDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare, ArrowLeft, CheckCheck, Sparkles } from 'lucide-react';

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
  }, [location, navigate]);

  useEffect(() => {
    if (!currentUser) return;
    let sentMsgs = [], receivedMsgs = [];
    function process(msgs, type) {
      if (type === 'sent') sentMsgs = msgs;
      else receivedMsgs = msgs;
      const combined = [...sentMsgs, ...receivedMsgs];
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const map = new Map();
      combined.forEach(msg => {
        const isSender = msg.senderId === currentUser.uid;
        const cid = isSender ? msg.receiverId : msg.senderId;
        if (!map.has(cid)) {
          map.set(cid, {
            uid: cid, name: isSender ? msg.receiverName : msg.senderName,
            avatarUrl: isSender ? msg.receiverAvatar : msg.senderAvatar,
            lastMessage: msg.content, timestamp: msg.createdAt,
            unreadCount: (!isSender && !msg.isRead) ? 1 : 0
          });
        } else if (!isSender && !msg.isRead) {
          map.get(cid).unreadCount += 1;
        }
      });
      setConversations(Array.from(map.values()));
    }
    const u1 = onSnapshot(query(collection(db, "Messages"), where("senderId", "==", currentUser.uid)),
      snap => process(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'sent'));
    const u2 = onSnapshot(query(collection(db, "Messages"), where("receiverId", "==", currentUser.uid)),
      snap => process(snap.docs.map(d => ({ id: d.id, ...d.data() })), 'received'));
    return () => { u1(); u2(); };
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !activeContact) return;
    const convId = [currentUser.uid, activeContact.uid].sort().join('_');
    const q = query(collection(db, "Messages"), where("conversationId", "==", convId));
    const unsub = onSnapshot(q, async snap => {
      const msgs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(msgs);
      const batch = writeBatch(db);
      let hasUnread = false;
      snap.docs.forEach(d => {
        if (d.data().receiverId === currentUser.uid && !d.data().isRead) {
          batch.update(doc(db, "Messages", d.id), { isRead: true });
          hasUnread = true;
        }
      });
      if (hasUnread) await batch.commit();
    });
    return unsub;
  }, [currentUser, activeContact]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() || !activeContact) return;
    const content = newMessage.trim();
    setNewMessage('');
    const convId = [currentUser.uid, activeContact.uid].sort().join('_');
    try {
      await addDoc(collection(db, "Messages"), {
        conversationId: convId,
        senderId: currentUser.uid, senderName: userData?.name || "User",
        senderAvatar: userData?.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`,
        receiverId: activeContact.uid, receiverName: activeContact.name || "User",
        receiverAvatar: activeContact.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${activeContact.uid}`,
        content, isRead: false, createdAt: new Date().toISOString()
      });
    } catch (err) { console.error(err); }
  }

  return (
    <div className="min-h-screen bg-[#060812] text-white flex flex-col overflow-hidden" style={{ height: 'calc(100dvh - 80px)' }}>
      <div className="flex-1 flex overflow-hidden">
        {/* --- INBOX PANE --- */}
        <div className={`w-full md:w-80 flex-col bg-[#0e1328] border-r border-white/5 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-6 py-6 flex justify-between items-center">
            <h2 className="text-xl font-black">Messages <span className="bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded-lg text-[10px] ml-2">2</span></h2>
            <button className="text-slate-500 hover:text-white transition-colors">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
          </div>

          <div className="px-6 pb-4 relative">
             <div className="absolute left-9 top-2.5 text-slate-600"><Search size={16} /></div>
             <input type="text" placeholder="Search messages..." className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:ring-0 focus:border-violet-500/50 transition-all outline-none" />
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-8 opacity-40">
                <MessageSquare size={48} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">No chats yet</p>
              </div>
            ) : (
              conversations.map(c => (
                <div key={c.uid} onClick={() => { setActiveContact(c); setShowMobileChat(true); }} className={`px-6 py-5 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-all ${activeContact?.uid === c.uid ? 'bg-white/5 border-r-2 border-violet-500' : ''}`}>
                  <div className="relative flex-shrink-0">
                    <img src={c.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover grayscale opacity-80" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#0e1328] rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="text-sm font-black truncate">{c.name}</h4>
                      <span className="text-[9px] font-bold text-slate-600">3:45 PM</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <p className="text-xs text-slate-500 truncate font-medium">{c.lastMessage}</p>
                       {c.unreadCount > 0 && <span className="w-4 h-4 bg-violet-600 rounded-full text-[8px] font-black flex items-center justify-center text-white">{c.unreadCount}</span>}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- CHAT PANE --- */}
        <div className={`flex-1 flex flex-col bg-[#060812] ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {activeContact ? (
            <>
              <div className="px-6 py-4 flex items-center justify-between bg-[#0e1328]/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowMobileChat(false)} className="md:hidden text-slate-400 mr-2"><ArrowLeft size={20} /></button>
                  <img src={activeContact.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="text-sm font-black">{activeContact.name}</h3>
                    <p className="text-[10px] font-bold text-emerald-500">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                   <button className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></button>
                   <button className="hover:text-white transition-colors"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6 no-scrollbar">
                <div className="text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Today</div>
                
                {messages.map((msg) => {
                  const isMine = msg.senderId === currentUser.uid;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-xs font-semibold leading-relaxed ${isMine ? 'bg-violet-600 text-white rounded-tr-none shadow-lg shadow-violet-900/20' : 'bg-[#0e1328] text-slate-300 border border-white/5 rounded-tl-none'}`}>
                        {msg.content}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 px-1 opacity-40">
                         <span className="text-[8px] font-black">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                         {isMine && <CheckCheck size={10} />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-6 py-6 bg-[#0e1328] border-t border-white/5">
                <form onSubmit={handleSend} className="flex gap-3 items-center">
                  <button type="button" className="text-slate-500 hover:text-white transition-colors"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
                  <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 bg-white/5 border border-white/5 rounded-xl px-5 py-3 text-xs font-medium focus:ring-0 focus:border-violet-500/50 outline-none" />
                  <button type="submit" disabled={!newMessage.trim()} className="text-violet-500 hover:text-violet-400 transition-colors disabled:opacity-20"><Send size={20} /></button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10 opacity-30">
               <MessageSquare size={64} className="mb-6" />
               <h3 className="text-xl font-black mb-2">Your Conversations</h3>
               <p className="text-xs font-bold text-slate-500 max-w-xs leading-relaxed">Select a contact from the list to start chatting about your next world-class project.</p>
            </div>
          )}
        </div>
      </div>
  );
}
