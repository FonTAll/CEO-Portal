import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import * as Icons from 'lucide-react';

const THEME = {
  bgMain: '#f3f3f1',
  bgGradient: 'transparent',
  sidebarBg: 'linear-gradient(180deg, #1d2636 0%, #0F172A 100%)',
  glassWhite: 'rgba(255, 255, 255, 0.88)',
  primary: '#212c46',
  primaryLight: '#4d87a8',
  accent: '#a94228',
  gold: '#b58c4f',
  brightGold: '#b7a159',
  success: '#657f4d',
  danger: '#932c2e',
  skyBlue: '#3f809e',
  dustyBlue: '#7a8b95',
  indigo: '#414757',
  softPurple: '#ab7d82',
  deepPurple: '#2d2c4a',
  pinkAccent: '#a54f6b',
  mutedSlate: '#606a5f',
  darkSlate: '#2f2926',
  silver: '#d7d7d7',
  deepNavy: '#212c46',
  brownGold: '#b58c4f',
  vibrantPurple: '#2d2c4a',
  burntOrange: '#d96245',
  slateBlue: '#748ea1',
  coolGray: '#eaeaec',
  darkRed: '#851c24',
  oliveGreen: '#818d47',
  sageGreen: '#bab98b',
  burgundy: '#8b2c3d',
  khaki: '#84896d',
  redMain: '#b22026',
  forestGreen: '#508660',
  grayGreen: '#939885'
};

function UserGuidePanel({ isOpen, onClose }: any) {
  if (typeof document === 'undefined') return null;
  return createPortal(
    <>
      <div className={`fixed inset-0 z-[190] bg-[#212c46]/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClose}/>
      <div className={`fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-white shadow-2xl transform transition-transform duration-500 ease-in-out flex flex-col border-l-2 border-[${THEME.gold}] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex justify-between items-center p-5 px-6 border-b-2 border-[#b7a159] bg-[#212c46] text-white shrink-0">
          <div>
            <h3 className="font-black flex items-center gap-3 uppercase tracking-widest text-lg"><Icons.BrainCircuit size={22} className="text-[#b7a159]"/> SMART HR GUIDE</h3>
            <p className="text-[12px] font-bold text-[#d7d7d7] uppercase tracking-widest mt-1.5">HR Assistant Guide</p>
          </div>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-[#932c2e] hover:bg-white/10 rounded-xl transition-colors"><Icons.X size={24}/></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-[#414757] text-[12px] leading-relaxed custom-scrollbar bg-white">
          <section className="animate-fadeIn">
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.Users size={18} className="text-[#b7a159]"/> 1. HR Analytics & Data
            </h4>
            <p className="text-[12px] mb-3">AI สามารถช่วยคุณวิเคราะห์ข้อมูลพนักงาน, ตรวจสอบรายงาน และรวบรวมสถิติ:</p>
            <ul className="list-none pl-0 space-y-3">
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Icons.PieChart size={16} className="shrink-0 text-[#4d87a8] mt-0.5"/> 
                  <div><strong className="text-[#4d87a8]">Data Review:</strong> สรุปสถิติอัตรากำลังคน การขาดลามาสาย</div>
                </li>
                <li className="flex items-start gap-2 bg-[#f8f9fa] p-3 rounded-xl border border-[#eaeaec]">
                  <Icons.ShieldCheck size={16} className="shrink-0 text-[#657f4d] mt-0.5"/> 
                  <div><strong className="text-[#657f4d]">Policy Compliance:</strong> ตรวจสอบความสอดคล้องกับระเบียบข้อบังคับบริษัท</div>
                </li>
            </ul>
          </section>
          
          <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.MessageSquare size={18} className="text-[#d96245]"/> 2. HR Support
            </h4>
            <p className="text-[12px] mb-3">ให้ AI เป็นผู้ช่วยในการเตรียมข้อมูลเบื้องต้นสำหรับงาน HR:</p>
            <ul className="list-disc pl-5 mt-2 space-y-2 text-[12px]">
                <li><strong className="text-[#d96245]">Draft Communications:</strong> สร้างจดหมายและประกาศภายในองค์กร</li>
                <li><strong className="text-[#212c46]">Recruitment:</strong> ช่วยร่าง Job Description หรือ คำถามสัมภาษณ์</li>
                <li><strong className="text-[#657f4d]">Employee Relations:</strong> ให้คำแนะนำกิจกรรมสร้างความผูกพันพนักงาน</li>
            </ul>
          </section>

          <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            <h4 className="text-[14px] font-black text-[#212c46] mb-3 uppercase flex items-center gap-2 border-b-2 border-[#d7d7d7] pb-2 font-mono">
              <Icons.HelpCircle size={18} className="text-[#3f809e]"/> 3. How to Ask
            </h4>
            <p className="text-[12px] bg-[#3f809e]/10 p-3 rounded-xl border border-[#3f809e]/30 text-[#212c46]">เลือก <b>Prompt Recommendations</b> ที่เราเตรียมไว้ให้ หรือพิมพ์คำสั่ง เช่น "สรุปขั้นตอนการประเมินผลการทำงาน" เพื่อรับข้อมูลที่แม่นยำและรวดเร็ว</p>
          </section>
        </div>
        
        <div className="p-4 bg-[#f8f9fa] border-t border-[#eaeaec] flex justify-end shrink-0">
          <button onClick={onClose} className="px-8 py-2.5 bg-[#212c46] text-white font-black rounded-xl uppercase text-[12px] hover:bg-[#414757] hover:text-white transition-all shadow-md tracking-[0.1em]">เข้าใจแล้ว (Understood)</button>
        </div>
      </div>
    </>, document.body
  );
}

const suggestedPrompts = [
  { id: 'p1', title: 'HR Analytics', text: 'สรุปข้อมูลพนักงานเข้าใหม่และการลาออกของไตรมาสที่ผ่านมา', icon: 'PieChart' },
  { id: 'p2', title: 'Leave Management', text: 'ตรวจสอบกฎระเบียบและนโยบายการลาพักร้อนประจำปี', icon: 'CalendarDays' },
  { id: 'p3', title: 'Performance Review', text: 'ช่วยร่าง email แจ้งพนักงานเพื่อเตรียมตัวประเมินผลการทำงานปลายปี', icon: 'Target' },
  { id: 'p4', title: 'Employee Relations', text: 'แนะนำกิจกรรมสร้างความสัมพันธ์และพนักงานสัมพันธ์ที่น่าสนใจสำหรับบริษัท', icon: 'Heart' }
];

export default function AiCopilot() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeMode, setActiveMode] = useState('chat');
  
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'สวัสดีค่ะ! ฉันคือ T All BOT ผู้ช่วยส่วนตัวของคุณในระบบ SMART HR. วันนี้มีข้อมูลพนักงานหรือรายงานส่วนไหนที่คุณต้องการให้ฉันช่วยจัดการไหมคะ?', timestamp: '08:00 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const newUserMsg = { id: Date.now(), role: 'user', text: text.trim(), timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.map(m => ({ role: m.role, text: m.text })) })
      });

      if (!response.ok) {
        throw new Error('คลาวด์เอนพอยต์ AI ปฏิเสธการเข้าถึงหรือขัดข้อง');
      }

      const result = await response.json();
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groundingChunks: result.groundingChunks
      }]);
    } catch (err: any) {
      console.error(err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: `❌ **เกิดข้อขัดข้องในการส่งคำถาม:** ${err.message || 'ไม่สามารถตอบรับข้อมูลกลับมาจากระบบได้'}\n\nกรุณาลงชื่อสมัครใช้บริการใหม่ หรือตรวจสอบคีย์การเข้าถึงข้อมูลระบบของคุณในแถบสารสนเทศตั้งค่า (Settings > Secrets)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-1 w-full flex-col pb-5 animate-fadeIn bg-transparent space-y-4">
      
      {/* USER GUIDE FLOATING TAB */}
      <button onClick={() => setIsGuideOpen(true)} className="fixed right-0 top-[80px] bg-[#f8f9fa] border border-[#eaeaec] border-r-0 text-[#212c46] py-8 px-1.5 rounded-l-xl shadow-md hover:bg-[#b7a159] hover:text-white hover:border-[#b7a159] transition-all duration-500 z-[100] flex flex-col items-center gap-4 group">
          <Icons.HelpCircle size={18} className="shrink-0 group-hover:rotate-12 transition-transform text-[#b58c4f] group-hover:text-white" />
          <span className="font-black tracking-[0.3em] [writing-mode:vertical-rl] rotate-180 whitespace-nowrap uppercase text-[11px]">USER GUIDE</span>
      </button>

      <UserGuidePanel isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      {/* HEADER SECTION (Matching User Permission) */}
      <div className="h-14 px-4 sm:px-8 flex flex-row items-center justify-between gap-4 z-20 shrink-0">
          <div className="flex items-center gap-5">
              <div className="relative flex items-center justify-center group cursor-default shrink-0">
                  <div className="absolute inset-0 bg-[#b7a159] blur-[15px] opacity-30 rounded-full group-hover:opacity-70 transition-all duration-700 animate-pulse-subtle"></div>
                  <div className="relative z-10 p-1.5 border border-[#b7a159]/50 rounded-xl bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden">
                      <Icons.BrainCircuit size={28} strokeWidth={2.5} className="text-[#b58c4f]" />
                  </div>
              </div>
              <div>
                  <h3 className="font-black text-[#212c46] uppercase tracking-tighter leading-none flex items-center gap-2" style={{ fontSize: '24px' }}>
                      SMART <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b58c4f] to-[#8e9141]">AI COPILOT</span>
                      <span className="bg-[#b58c4f] text-white text-[9px] px-2 py-0.5 rounded-full tracking-widest ml-1 shadow-sm font-mono">BETA</span>
                  </h3>
                  <p className="text-[11px] font-bold text-[#b58c4f] uppercase tracking-[0.2em] mt-0.5 opacity-90 leading-none">
                      INTELLIGENT AI ASSISTANT
                  </p>
              </div>
          </div>

          <div className="flex items-center gap-4">
              <div className="bg-white/50 p-1.5 rounded-xl border border-white/60 shadow-inner flex flex-wrap items-center gap-1">
                  <button onClick={() => setActiveMode('chat')} className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMode === 'chat' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#b58c4f]'}`}>
                    <Icons.MessageSquare size={16} /> Copilot Chat
                  </button>
                  <button onClick={() => setActiveMode('documents')} className={`px-4 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMode === 'documents' ? 'bg-[#212c46] text-white shadow-md' : 'text-[#7a8b95] hover:text-[#b58c4f]'}`}>
                    <Icons.FileSearch size={16} /> Multi-Doc Mode
                  </button>
              </div>
          </div>
      </div>

      <div className="w-full px-4 sm:px-8 mt-2 flex-1 pb-6 min-h-0 flex flex-col">
        <div className="w-full flex-1 flex flex-col gap-6 lg:flex-row h-full min-h-0">
            
            {/* Left Panel: Sidebar / Prompts */}
            <div className="w-full lg:w-80 flex flex-col gap-5 shrink-0 animate-fadeIn h-full">
                
                <div className="bg-white/90 p-4 rounded-3xl shadow-lg border border-[#eaeaec] flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#212c46] to-[#414757] flex items-center justify-center shadow-xl border-4 border-white mb-3 relative">
                        <Icons.Bot size={30} className="text-white" />
                        <span className="absolute bottom-1 right-1 w-3 h-3 bg-[#657f4d] rounded-full border-2 border-white shadow-sm"></span>
                    </div>
                    <h4 className="text-[13px] font-black text-[#212c46] uppercase tracking-widest font-mono">T All BOT ผู้ช่วยอัจฉริยะ</h4>
                    <p className="text-[10px] text-[#7a8b95] font-bold mt-1 uppercase tracking-wider">Ready to help</p>
                </div>

                <div className="bg-white/90 rounded-3xl shadow-lg border border-[#eaeaec] flex-1 overflow-hidden flex flex-col min-h-0">
                    <div className="p-5 border-b border-[#eaeaec] bg-[#f8f9fa]">
                        <h4 className="text-[12px] font-black uppercase text-[#212c46] tracking-widest flex items-center gap-2">
                            <Icons.Lightbulb size={16} className="text-[#b58c4f]"/> Suggested Prompts
                        </h4>
                    </div>
                    <div className="p-3 space-y-2 overflow-y-auto custom-scrollbar flex-1">
                        {suggestedPrompts.map(prompt => {
                            const IconComponent = Icons[prompt.icon as keyof typeof Icons] as any || Icons.MessageSquare;
                            return (
                                <button key={prompt.id} onClick={() => handleSendMessage(prompt.text)} className="w-full text-left bg-white border border-[#eaeaec] p-2.5 px-3 rounded-2xl hover:border-[#b58c4f] hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-3 mb-1">
                                        <div className="bg-[#f8f9fa] p-1.5 rounded-lg text-[#b58c4f] group-hover:bg-[#b58c4f] group-hover:text-white transition-colors">
                                            <IconComponent size={14} />
                                        </div>
                                        <span className="font-black text-[#212c46] text-[11px] uppercase tracking-widest">{prompt.title}</span>
                                    </div>
                                    <p className="text-[11px] text-[#414757] leading-relaxed line-clamp-2">{prompt.text}</p>
                                </button>
                            )
                        })}
                    </div>
                </div>

            </div>

            {/* Right Panel: Chat Interface */}
            {activeMode === 'chat' ? (
                <div className="flex-1 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col animate-fadeIn relative">
                    {/* Chat Header */}
                    <div className="h-14 border-b border-[#eaeaec] bg-[#f8f9fa] flex items-center justify-between px-5 shrink-0 z-10">
                        <div className="flex items-center gap-3">
                            <Icons.MessageSquareText size={18} className="text-[#b58c4f]" />
                            <span className="font-black text-[#212c46] uppercase text-[12px] tracking-widest">Copilot Conversation</span>
                        </div>
                        <button className="text-[#7a8b95] hover:text-[#932c2e] transition-colors p-1.5 bg-white rounded-lg border border-[#eaeaec] hover:border-[#932c2e]/50 shadow-sm" onClick={() => setMessages([messages[0]])}>
                            <Icons.Trash2 size={16} />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 bg-[#f3f3f1]/30">
                        <div className="flex flex-col space-y-4 w-full">
                            {messages.map((msg, index) => (
                                <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                                    <div className="shrink-0 mt-1">
                                        {msg.role === 'ai' ? (
                                            <div className="w-10 h-10 rounded-full bg-[#212c46] flex items-center justify-center shadow-md">
                                                <Icons.Bot size={20} className="text-[#b7a159]" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-[#b7a159] flex items-center justify-center shadow-md overflow-hidden">
                                                <Icons.User size={20} className="text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className={`flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest mb-1.5 ${msg.role === 'user' ? 'justify-end text-[#b7a159]' : 'text-[#7a8b95]'}`}>
                                            <span>{msg.role === 'ai' ? 'Copilot' : 'You'}</span>
                                            <span>•</span>
                                            <span>{msg.timestamp}</span>
                                        </div>
                                        <div className={`px-6 py-4 text-[13px] leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-[#212c46] text-white chat-bubble-user' : 'bg-white border border-[#eaeaec] text-[#212c46] chat-bubble-ai'}`}>
                                            {msg.text.split('\n').map((line, i) => (
                                                <p key={i} className={i !== 0 ? 'mt-2' : ''}>{line}</p>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {isTyping && (
                                <div className="flex gap-4 max-w-[85%] self-start animate-fadeIn">
                                    <div className="shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-[#212c46] flex items-center justify-center shadow-md">
                                            <Icons.Bot size={20} className="text-[#b7a159]" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest mb-1.5 text-[#7a8b95]">
                                            <span>Copilot</span>
                                        </div>
                                        <div className="px-6 py-5 bg-white border border-[#eaeaec] text-[#212c46] chat-bubble-ai shadow-sm flex items-center gap-2">
                                            <div className="w-2 h-2 bg-[#b7a159] rounded-full typing-dot"></div>
                                            <div className="w-2 h-2 bg-[#b7a159] rounded-full typing-dot"></div>
                                            <div className="w-2 h-2 bg-[#b7a159] rounded-full typing-dot"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 sm:p-6 bg-white border-t border-[#eaeaec] z-10 shrink-0">
                        <div className="w-full relative flex items-end gap-3 bg-[#f8f9fa] p-2 rounded-3xl border border-[#eaeaec] shadow-inner focus-within:border-[#b7a159] focus-within:ring-2 focus-within:ring-[#b7a159]/20 transition-all">
                            <button onClick={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.multiple = true;
                                input.onchange = () => {
                                    handleSendMessage("User attached document(s) for analysis.");
                                };
                                input.click();
                            }} className="p-3 text-[#7a8b95] hover:text-[#212c46] transition-colors rounded-full hover:bg-white shrink-0" title="Attach Document">
                                <Icons.Paperclip size={20} />
                            </button>
                            <textarea 
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(inputText);
                                    }
                                }}
                                placeholder="Message Copilot... (Shift + Enter for new line)"
                                className="flex-1 max-h-32 min-h-[44px] bg-transparent resize-none outline-none py-3 text-[14px] text-[#212c46] placeholder:text-[#7a8b95]"
                                rows={1}
                            />
                            <button 
                                onClick={() => handleSendMessage(inputText)}
                                disabled={!inputText.trim() || isTyping}
                                className={`p-3 rounded-2xl shrink-0 transition-all shadow-sm ${(!inputText.trim() || isTyping) ? 'bg-[#eaeaec] text-[#a0aec0] cursor-not-allowed' : 'bg-[#212c46] text-[#b7a159] hover:bg-[#b7a159] hover:text-[#212c46] active:scale-95 hover:shadow-md'}`}
                            >
                                <Icons.Send size={20} />
                            </button>
                        </div>
                        <p className="mt-3 text-center text-[10px] font-bold text-[#7a8b95] uppercase tracking-widest">AI can make mistakes. Verify critical information.</p>
                    </div>
                </div>
            ) : (
                <div className="flex-1 bg-white rounded-3xl shadow-lg border border-[#eaeaec] overflow-hidden flex flex-col justify-center items-center text-center p-8 animate-fadeIn">
                    <div className="w-24 h-24 bg-[#f8f9fa] rounded-full flex items-center justify-center border border-[#eaeaec] shadow-inner mb-6 relative">
                        <Icons.SearchCode size={40} className="text-[#b58c4f]" />
                        <div className="absolute -bottom-2 -right-2 bg-[#212c46] text-[#b7a159] text-[9px] font-black px-2 py-1 rounded-md border border-[#b7a159]/30 uppercase tracking-widest">SOON</div>
                    </div>
                    <h3 className="text-xl font-black text-[#212c46] uppercase tracking-widest mb-3 font-mono">Multi-Document Analysis</h3>
                    <p className="text-[#7a8b95] text-[13px] max-w-md leading-relaxed font-medium">
                        Upload multiple standard documents or procedures to let AI cross-reference and find conflicting patterns.
                    </p>
                    <button onClick={() => setActiveMode('chat')} className="mt-8 bg-white border-2 border-[#b58c4f] text-[#b58c4f] px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-[#b58c4f] hover:text-white transition-all shadow-sm">
                        Return to Chat
                    </button>
                </div>
            )}
            
        </div>
      </div>
    </div>
  );
}
