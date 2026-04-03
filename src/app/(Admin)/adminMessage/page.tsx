'use client';

import React, { useRef, useState } from 'react';
import { AdminSidebar } from '../../../components/(Admin)/Sidebar';
import { useAutoLogout } from '../../../hooks/useAutoLogout';
import { 
  Send, Search, ShieldAlert, MoreVertical, Paperclip, 
  User, Loader2, Zap, ChevronLeft 
} from 'lucide-react';
import { useAdminChat } from '../../../hooks/useAdminChat';

export default function AdminMessagePage() {
  useAutoLogout();
  const {
    isReady, currentUser, filteredContacts, activeChat, setActiveChat,
    messages, input, setInput, handleSend, searchTerm, setSearchTerm, 
    scrollRef, uploadToCloudinary, isUploading
  } = useAdminChat();

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mobile navigation state
  const [showChatMobile, setShowChatMobile] = useState(false);

  // FIXED: Removed the useEffect that was causing the cascading render error.
  // Instead, we handle the state transition directly in the click handler below.

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isReady) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-500" />
    </div>
  );

  return (
    <main className="h-screen w-full flex flex-col lg:flex-row bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase">
      <AdminSidebar />

      <section className="flex-1 flex overflow-hidden relative pb-16 lg:pb-0">
        
        {/* DIRECTORY */}
        <div className={`
          ${showChatMobile ? 'hidden lg:flex' : 'flex'} 
          w-full lg:w-80 border-r border-white/5 flex-col bg-slate-950/20 z-20
        `}>
          <div className="p-6 lg:p-8 pb-4">
            <div className="flex items-center gap-2 mb-6 text-indigo-500">
                <Zap className="w-4 h-4" fill="currentColor" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Direct Override</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                placeholder="SEARCH PERSONNEL..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3 pl-10 pr-4 text-[10px] font-black outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-2 scrollbar-hide">
            {filteredContacts.map((chat) => (
              <button 
                key={chat.employeeId} 
                onClick={() => {
                  // UPDATE BOTH STATES HERE: This prevents the cascading render error
                  setActiveChat(chat);
                  setShowChatMobile(true);
                }}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all border ${
                  activeChat?.employeeId === chat.employeeId 
                  ? 'bg-indigo-600/10 border-indigo-600/20 shadow-lg shadow-indigo-500/5' 
                  : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden flex-shrink-0 bg-slate-800">
                  {chat.profileImage ? (
                    <img src={chat.profileImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <User className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-xs font-black text-white truncate block">{chat.name}</span>
                  <p className="text-[8px] text-slate-500 font-bold tracking-widest">{chat.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className={`
          ${showChatMobile ? 'flex' : 'hidden lg:flex'} 
          flex-1 flex-col bg-[#020617] h-full
        `}>
          {activeChat && currentUser ? (
            <>
              <div className="px-6 lg:px-10 py-4 lg:py-6 border-b border-white/5 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md sticky top-0 z-30">
                <div className="flex items-center gap-3 lg:gap-5">
                  <button 
                    onClick={() => setShowChatMobile(false)}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-500 transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl flex items-center justify-center bg-indigo-600 overflow-hidden flex-shrink-0">
                    {activeChat.profileImage ? (
                      <img src={activeChat.profileImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="font-black text-white text-xs lg:text-base">{activeChat.name[0]}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-sm font-black text-white tracking-widest truncate max-w-[120px] sm:max-w-none">{activeChat.name}</h3>
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3 text-indigo-500" />
                        <p className="text-[8px] lg:text-[9px] font-black text-slate-500 tracking-[0.2em]">{activeChat.role} </p>
                    </div>
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-slate-500 cursor-pointer" />
              </div>

              <div className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-6 scrollbar-hide">
                {messages
                  .filter(msg => (msg.content && msg.content.trim() !== "") || msg.fileUrl)
                  .map((msg, i) => {
                    const isMe = msg.senderId === currentUser.employeeId;
                    return (
                      <div key={i} className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[85%] lg:max-w-[70%]`}>
                        {msg.fileUrl ? (
                          <img 
                            src={msg.fileUrl} 
                            alt="attachment" 
                            className="max-w-[200px] sm:max-w-xs md:max-w-sm rounded-2xl border border-white/5 block shadow-2xl" 
                          />
                        ) : (
                          <div className={`p-4 lg:p-5 rounded-2xl lg:rounded-3xl overflow-hidden ${
                            isMe 
                            ? 'bg-indigo-600 text-white rounded-br-none shadow-xl shadow-indigo-500/10' 
                            : 'bg-slate-900 border border-white/5 text-slate-100 rounded-bl-none shadow-2xl'
                          }`}>
                            <p className="text-[11px] lg:text-xs font-bold leading-relaxed break-words">{msg.content}</p>
                          </div>
                        )}
                        {isMe && (
                          <span className="text-[7px] lg:text-[8px] font-black text-slate-600 mt-2 tracking-widest uppercase">
                            SENT {formatTime(msg.timestamp)}
                          </span>
                        )}
                      </div>
                    );
                })}
                <div ref={scrollRef} />
              </div>

              <div className="p-6 lg:p-10 pt-0">
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0])}
                  accept="image/*"
                />
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl lg:rounded-[2.5rem] p-1 lg:p-2 flex items-center gap-1 lg:gap-2 focus-within:border-indigo-500/50 transition-all shadow-inner backdrop-blur-xl">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-3 lg:p-4 text-slate-500 hover:text-white transition-colors"
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                  </button>
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isUploading ? "UPLOADING..." : "COMMAND..."} 
                    className="flex-1 bg-transparent outline-none text-[9px] lg:text-[10px] font-black tracking-widest text-white px-2 lg:px-4 min-w-0"
                    disabled={isUploading}
                  />
                  <button 
                    onClick={() => handleSend()} 
                    disabled={(!input.trim() && !isUploading) || isUploading} 
                    className="bg-indigo-600 p-3 lg:p-4 rounded-full text-white hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    <Send className="w-4 h-4 lg:w-5 h-5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 uppercase tracking-[0.5em] p-6 text-center">
              <ShieldAlert className="w-12 h-12 lg:w-16 lg:h-16 mb-4 text-indigo-500" />
              <p className="text-[8px] lg:text-[10px] font-black leading-loose">ADMIN COMMAND STANDBY<br/>SELECT PERSONNEL TO OVERRIDE</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}