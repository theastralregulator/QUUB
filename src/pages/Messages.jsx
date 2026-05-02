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
    <div className="page-bg flex flex-col" style={{ height: 'calc(100dvh - 56px)', overflow: 'hidden' }}>
      {/* Animated top accent bar */}
      <div className="md:hidden h-1 w-full" style={{ background: 'linear-gradient(90deg, #7C3AED, #06B6D4)' }} />

      <div className="flex-1 flex overflow-hidden md:container md:mx-auto md:py-5 md:px-4 md:gap-5">

        {/* ---- INBOX PANE ---- */}
        <div className={`flex-col w-full md:w-[380px] bg-white md:rounded-[2.5rem] border-0 md:border border-slate-100 md:shadow-xl md:shadow-violet-100/30 overflow-hidden flex-shrink-0 ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="px-6 py-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 60%, #06B6D4 100%)' }}>
            <div>
              <h2 className="text-xl font-black text-white">Inbox</h2>
              <p className="text-white/60 text-xs font-bold">{conversations.length} conversations</p>
            </div>
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <MessageSquare size={20} className="text-white" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-8">
                <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg, rgba(91,33,182,0.1), rgba(6,182,212,0.1))' }}>
                  <MessageSquare size={36} className="text-violet-300" />
                </div>
                <h3 className="font-black text-slate-900 mb-2">No Messages Yet</h3>
                <p className="text-sm text-slate-400 font-medium">Start chatting from the job board!</p>
              </div>
            ) : (
              <div className="stagger-children">
                {conversations.map(c => (
                  <div key={c.uid}
                    onClick={() => { setActiveContact(c); setShowMobileChat(true); }}
                    className={`px-6 py-5 cursor-pointer flex items-center gap-4 transition-all duration-200 border-b border-slate-50 hover:bg-violet-50/50 active:bg-violet-100/50 ${activeContact?.uid === c.uid ? 'bg-violet-50 border-l-[3px] border-l-violet-600' : ''}`}>
                    <div className="relative flex-shrink-0">
                      <img src={c.avatarUrl} alt="" className="w-13 h-13 rounded-2xl border-2 border-violet-100 object-cover shadow-sm" style={{ width: '52px', height: '52px' }} />
                      <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h4 className="font-extrabold text-slate-900 text-sm truncate">{c.name}</h4>
                        {c.unreadCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white animate-bounce-in"
                            style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)' }}>
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate font-medium">{c.lastMessage}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ---- CHAT PANE ---- */}
        <div className={`flex-1 flex-col bg-white md:rounded-[2.5rem] border-0 md:border border-slate-100 md:shadow-xl md:shadow-violet-100/30 overflow-hidden ${!showMobileChat ? 'hidden md:flex' : 'flex'}`}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div className="px-5 md:px-8 py-4 flex items-center justify-between border-b border-slate-50"
                style={{ background: 'linear-gradient(135deg, #5B21B6, #7C3AED 60%, #0891B2)' }}>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowMobileChat(false)} className="md:hidden p-2 -ml-2 text-white/80 hover:text-white">
                    <ArrowLeft size={22} />
                  </button>
                  <div className="relative">
                    <img src={activeContact.avatarUrl} alt="" className="w-11 h-11 rounded-2xl border-2 border-white/30 object-cover" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base leading-tight">{activeContact.name}</h3>
                    <div className="flex items-center gap-1">
                      <Sparkles size={10} className="text-yellow-300" />
                      <span className="text-white/60 text-[10px] font-bold">Active now</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 md:px-8 py-6 flex flex-col gap-4"
                style={{ background: 'linear-gradient(180deg, #fafbff 0%, #f4f0ff 100%)' }}>
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 my-auto">
                    <div className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mx-auto mb-4"
                      style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(6,182,212,0.1))' }}>
                      <MessageSquare size={28} className="text-violet-400" />
                    </div>
                    <p className="font-bold text-sm">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMine = msg.senderId === currentUser.uid;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} animate-fade-in`}>
                        <div className={`max-w-[82%] md:max-w-[68%] px-5 py-3.5 rounded-[1.5rem] text-sm font-semibold leading-relaxed shadow-sm ${
                          isMine
                            ? 'text-white rounded-tr-[0.5rem]'
                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-[0.5rem]'
                        }`}
                          style={isMine ? { background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' } : {}}
                        >
                          {msg.content}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 px-1">
                          <span className="text-[10px] text-slate-300 font-bold">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && <CheckCheck size={12} className="text-violet-400" />}
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-5 md:px-8 py-4 bg-white border-t border-slate-50">
                <form onSubmit={handleSend} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Write something amazing..."
                    className="flex-1 px-6 py-3.5 rounded-2xl border border-slate-100 bg-slate-50 text-slate-800 font-medium text-sm focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-50 transition-all"
                  />
                  <button type="submit" disabled={!newMessage.trim()}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white disabled:opacity-30 transition-all active:scale-95 flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7C3AED, #06B6D4)', boxShadow: '0 6px 20px rgba(124,58,237,0.4)' }}>
                    <Send size={20} className="ml-0.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-10">
              <div className="w-28 h-28 rounded-[3rem] flex items-center justify-center mb-8"
                style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(6,182,212,0.08))' }}>
                <MessageSquare size={56} className="text-violet-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Your Conversations</h3>
              <p className="text-slate-400 font-medium max-w-sm text-sm leading-relaxed">
                Select a contact from the inbox to start chatting about your next world-class project.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
