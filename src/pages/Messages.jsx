import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, getDoc, doc, writeBatch } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { Send, MessageSquare } from 'lucide-react';

export default function Messages() {
  const { currentUser, userData } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  
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
      // Sort in memory to avoid needing a Firebase Composite Index
      msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setMessages(msgs);
      
      // Mark unread messages as read
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

  // Auto-scroll to bottom
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
      // Ensure all fields have a valid value to prevent addDoc failure
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
    <div className="container animate-fade-in" style={{ paddingTop: '2rem', paddingBottom: '2rem', height: 'calc(100vh - 80px)' }}>
      <div className="card" style={{ height: '100%', display: 'flex', padding: 0, overflow: 'hidden' }}>
        
        {/* Left Pane - Contacts */}
        <div style={{ width: '300px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem' }}>Inbox</h2>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {conversations.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No active conversations.
              </div>
            ) : (
              conversations.map(contact => (
                <div 
                  key={contact.uid} 
                  onClick={() => setActiveContact(contact)}
                  style={{ 
                    padding: '1rem 1.5rem', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    backgroundColor: activeContact?.uid === contact.uid ? 'var(--bg-secondary)' : 'transparent',
                    borderBottom: '1px solid var(--border-color)'
                  }}
                >
                  <img src={contact.avatarUrl} alt={contact.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div className="flex justify-between items-center">
                      <h4 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{contact.name}</h4>
                      {contact.unreadCount > 0 && (
                        <span style={{ backgroundColor: 'var(--danger-color)', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>
                          {contact.unreadCount}
                        </span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {contact.lastMessage}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane - Chat */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-secondary)' }}>
          {activeContact ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img src={activeContact.avatarUrl} alt={activeContact.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                <h3 style={{ margin: 0 }}>{activeContact.name}</h3>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 'auto', marginBottom: 'auto' }}>
                    Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.senderId === currentUser.uid;
                    return (
                      <div key={msg.id} style={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: isMine ? 'flex-end' : 'flex-start' 
                      }}>
                        <div style={{
                          maxWidth: '70%',
                          padding: '0.75rem 1rem',
                          borderRadius: '1rem',
                          backgroundColor: isMine ? 'var(--accent-color)' : 'var(--bg-primary)',
                          color: isMine ? 'white' : 'var(--text-primary)',
                          borderBottomRightRadius: isMine ? '4px' : '1rem',
                          borderBottomLeftRadius: isMine ? '1rem' : '4px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                          {msg.content}
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div style={{ padding: '1rem 1.5rem', backgroundColor: 'var(--bg-primary)', borderTop: '1px solid var(--border-color)' }}>
                <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Type a message..." 
                    style={{ flex: 1, borderRadius: '2rem' }}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={!newMessage.trim()}>
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              <MessageSquare size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <h3>Your Messages</h3>
              <p>Select a conversation from the sidebar to start chatting.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
