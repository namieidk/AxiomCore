'use client';

import React, { useRef, useState } from 'react';
import { ManagerSidebar } from '../../../components/(Manager)/Dashboard/ManagerSidebar';
import { Send, Search, ShieldCheck, MoreVertical, Paperclip, User, Lock, Loader2, ShieldAlert, ChevronLeft } from 'lucide-react';
import { useManagerChat } from '../../../hooks/useManagerChat';

export default function ManagerMessagesPage() {
  const {
    isReady, currentUser, filteredContacts, activeChat, setActiveChat,
    messages, input, setInput, handleSend, searchTerm, setSearchTerm, 
    scrollRef, setMessages, uploadToCloudinary, isUploading
  } = useManagerChat();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDirectory, setShowDirectory] = useState(true);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectChat = (chat: any) => {
    setMessages([]);
    setActiveChat(chat);
    setShowDirectory(false); // Hide directory on mobile after selection
  };

  if (!isReady) return (
    <div className="h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
    </div>
  );

  return (
    <main className="h-screen w-full flex bg-[#020617] text-slate-200 overflow-hidden font-sans uppercase italic">
      <ManagerSidebar />

      <section className="flex-1 flex overflow-hidden relative">
        
        {/* DIRECTORY - Responsive Width & Visibility */}
        <div className={`
          ${showDirectory ? 'flex' : 'hidden md:flex'} 
          w-full md:w-80 lg:w-96 border-r border-white/5 flex-col bg-slate-950/20 absolute md:relative z-20 h-full transition-all duration-300
        `}>
          <div className="p-6 md:p-8 pb-4 mt-16 md:mt-0">
            <div className="flex items-center gap-2 mb-6 text-blue-500">
                <Lock className="w-4 h-4" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Secure Channels</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
              <input 
                placeholder="SEARCH ENCRYPTED..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-white/5 rounded-xl py-3.5 pl-10 pr-4 text-[10px] font-black outline-none focus:border-blue-500/30 transition-all placeholder:text-slate-700"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 custom-scrollbar">
            {filteredContacts.map((chat) => (
              <button 
                key={chat.employeeId} 
                onClick={() => handleSelectChat(chat)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                  activeChat?.employeeId === chat.employeeId 
                  ? 'bg-blue-600/10 border-blue-600/20 shadow-lg shadow-blue-500/5' 
                  : 'hover:bg-white/5 border-transparent'
                }`}
              >
                <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden flex-shrink-0 bg-slate-800">
                  {chat.profileImage ? (
                    <img src={chat.profileImage} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <User className="w-5 h-5 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-xs font-black text-white truncate block italic">{chat.name}</span>
                  <p className="text-[8px] text-slate-500 font-bold tracking-widest uppercase">{chat.role}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div className={`
          ${!showDirectory ? 'flex' : 'hidden md:flex'}
          flex-1 flex flex-col bg-[#020617] relative z-10 w-full h-full
        `}>
          {activeChat && currentUser ? (
            <>
              {/* CHAT HEADER */}
              <div className="px-6 md:px-10 py-4 md:py-6 border-b border-white/5 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4 md:gap-5">
                  <button 
                    onClick={() => setShowDirectory(true)}
                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-white"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center bg-blue-600 overflow-hidden flex-shrink-0 shadow-lg shadow-blue-600/20">
                    {activeChat.profileImage ? (
                      <img src={activeChat.profileImage} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <span className="font-black text-slate-950 text-sm md:text-base">{activeChat.name[0]}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xs md:text-sm font-black text-white tracking-widest truncate">{activeChat.name}</h3>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-blue-500" />
                        <p className="text-[8px] md:text-[9px] font-black text-slate-500 tracking-[0.2em]">{activeChat.role} </p>
                    </div>
                  </div>
                </div>
                <MoreVertical className="w-5 h-5 text-slate-500 cursor-pointer hover:text-white transition-colors" />
              </div>

              {/* MESSAGES AREA */}
              <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-blue-950/10 via-transparent to-transparent">
                {messages
                  .filter(msg => (msg.content && msg.content.trim() !== "") || msg.fileUrl)
                  .map((msg, i) => {
                    const isMe = msg.senderId === currentUser.employeeId;
                    return (
                      <div key={i} className={`flex flex-col ${isMe ? 'items-end ml-auto' : 'items-start'} max-w-[85%] md:max-w-[70%]`}>
                        {msg.fileUrl ? (
                          <div className="relative group">
                            <img 
                              src={msg.fileUrl} 
                              alt="attachment" 
                              className="max-w-full rounded-2xl border border-white/10 shadow-2xl transition-transform group-hover:scale-[1.02]" 
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                          </div>
                        ) : (
                          <div className={`px-5 py-4 rounded-2xl md:rounded-3xl overflow-hidden ${
                            isMe 
                            ? 'bg-blue-600 text-white rounded-br-none shadow-xl shadow-blue-500/10' 
                            : 'bg-slate-900 border border-white/5 text-slate-100 rounded-bl-none shadow-2xl'
                          }`}>
                            <p className="text-[11px] md:text-xs font-bold leading-relaxed break-words italic">{msg.content}</p>
                          </div>
                        )}

                        {isMe && (
                          <span className="text-[7px] md:text-[8px] font-black text-slate-600 mt-2 tracking-widest uppercase italic">
                            SENT {formatTime(msg.timestamp)}
                          </span>
                        )}
                      </div>
                    );
                })}
                <div ref={scrollRef} />
              </div>

              {/* INPUT AREA */}
              <div className="p-4 md:p-10 pt-0">
                <input 
                  type="file" 
                  hidden 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files?.[0] && uploadToCloudinary(e.target.files[0])}
                  accept="image/*"
                />
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl md:rounded-[2.5rem] p-1.5 md:p-2 flex items-center gap-2 focus-within:border-blue-500/50 transition-all shadow-inner backdrop-blur-xl">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-3 md:p-4 text-slate-500 hover:text-white transition-colors"
                  >
                    {isUploading ? <Loader2 className="w-5 h-5 animate-spin text-blue-500" /> : <Paperclip className="w-5 h-5" />}
                  </button>
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder={isUploading ? "UPLOADING..." : "TYPE COMMAND..."} 
                    className="flex-1 bg-transparent outline-none text-[10px] font-black tracking-widest text-white px-2 md:px-4 placeholder:text-slate-700"
                    disabled={isUploading}
                  />
                  <button 
                    onClick={() => handleSend()} 
                    disabled={(!input.trim() && !isUploading) || isUploading} 
                    className="bg-blue-600 p-3.5 md:p-4 rounded-xl md:rounded-full text-white hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-blue-500/20"
                  >
                    <Send className="w-4 h-4 md:w-5 md:h-5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 uppercase tracking-[0.8em] text-center px-6">
              <ShieldAlert className="w-12 h-12 md:w-16 md:h-16 mb-6 text-blue-500" />
              <p className="text-[10px] font-black">COMMAND STANDBY</p>
              <button 
                onClick={() => setShowDirectory(true)}
                className="md:hidden mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] tracking-widest font-black italic shadow-lg shadow-blue-600/20"
              >
                OPEN DIRECTORY
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}