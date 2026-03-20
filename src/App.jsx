import React, { useState } from 'react';
import { Lock, Linkedin, Instagram, Twitter, MoveUp, MoveDown, Trash2, Edit2, Plus, GripVertical, Menu, X, Image as ImageIcon, ChevronDown, ChevronUp, Upload, Loader2, CheckCircle2, AlertCircle, Rocket, Zap } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

const ADMIN_CREDENTIALS = { username: 'shameem', password: 'shameem123#' };

const initialMembers = [
  { id: 1, name: "Dr. Jane Doe", hierarchy: 1, role: "Faculty Coordinator", img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 },
  { id: 2, name: "Prof. John Smith", hierarchy: 1, role: "Technical Advisor", img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 },
  { id: 3, name: "Sarah Khan", hierarchy: 2, role: "President", img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 },
  { id: 4, name: "Raj Patel", hierarchy: 2, role: "Vice-President", img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 },
  { id: 5, name: "Alice Green", hierarchy: 3, role: "Events Lead", img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 },
  { id: 6, name: "Tom Brown", hierarchy: 3, role: "Technical Lead", img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 },
  { id: 7, name: "David Chen", hierarchy: 3, role: "Member", img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 },
  { id: 8, name: "Emily Davis", hierarchy: 3, role: "Member", img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 },
];

const initialEvents = [
  { id: 1, title: "Ignite: Launching Our EDC Platform", date: "Mar 27, 2024", desc: "Official launch event of the IEDC incubator platform.", cover: null, images: [] },
  { id: 2, title: "Event: Glass Summit 2024", date: "May 16, 2024", desc: "A symposium on the integration of aesthetic design and robust engineering.", cover: null, images: [] },
  { id: 3, title: "EDC Hackathon: dynamic Stroke", date: "Apr 12, 2024", desc: "A intense coding competition centered on dynamic scaling.", cover: null, images: [] },
];

const RoaLogoSvg = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 -145 200 205" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(-45)">
      <rect x="0" y="0" width="20" height="20" fill="#F48B5F"/>
      <rect x="60" y="0" width="20" height="20" fill="#F48B5F"/>
      <rect x="120" y="0" width="80" height="20" fill="#F48B5F"/>
      <rect x="0" y="30" width="20" height="20" fill="#ED3F6E"/>
      <rect x="60" y="30" width="80" height="20" fill="#ED3F6E"/>
      <rect x="180" y="30" width="20" height="20" fill="#ED3F6E"/>
      <rect x="0" y="60" width="80" height="20" fill="#5A4596"/>
      <rect x="120" y="60" width="20" height="20" fill="#5A4596"/>
      <rect x="180" y="60" width="20" height="20" fill="#5A4596"/>
    </g>
  </svg>
);

const Header = ({ setCurrentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = ['Home', 'Events', 'Members', 'About Us'];

  const handleNav = (page) => {
    setCurrentPage(page === 'about us' ? 'about' : page);
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-white/20 py-4 shadow-sm px-6 md:px-12">
      <div className="flex items-center justify-between max-w-[1200px] mx-auto w-full">
        <div className="cursor-pointer flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => handleNav('home')}>
          <RoaLogoSvg className="w-12 h-12 md:w-14 md:h-14" />
        </div>
        
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-gray-500">
          {navItems.map(page => (
            <button key={page} onClick={() => handleNav(page.toLowerCase())} className={`hover:text-black transition-colors ${page === 'About Us' ? 'px-6 py-2.5 bg-black text-white rounded-full hover:bg-gray-800' : ''}`}>
              {page}
            </button>
          ))}
        </nav>

        <button className="md:hidden p-2 text-gray-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="mt-4 md:hidden flex flex-col gap-2 font-bold text-base text-gray-700 bg-white/95 rounded-2xl p-6 shadow-xl border border-gray-100 backdrop-blur-xl absolute left-6 right-6">
          {navItems.map(page => (
            <button key={page} onClick={() => handleNav(page.toLowerCase())} className={`text-left w-full py-4 px-4 rounded-xl hover:bg-gray-50 ${page === 'About Us' ? 'bg-black text-white hover:bg-gray-900 mt-2 text-center' : ''}`}>
              {page}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
};

const Footer = ({ setCurrentPage, setShowLogin }) => (
  <footer className="mt-20 md:mt-32 border-t border-gray-100 bg-white pt-16 pb-8 px-6 md:px-12 relative text-sm">
    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
      <div className="flex flex-col items-center md:items-start gap-6">
        <RoaLogoSvg className="w-16 h-16 md:w-20 md:h-20" />
        <p className="text-gray-400 font-medium">© 2026 IEDC MTM. All Rights Reserved.</p>
      </div>

      <div className="flex flex-col items-center md:items-end gap-10">
        <div className="flex flex-wrap justify-center gap-6 sm:gap-10 font-bold text-gray-500 text-sm">
          {['Home', 'Events', 'Members', 'About'].map(page => (
             <button key={page} onClick={() => setCurrentPage(page.toLowerCase())} className="hover:text-black transition-colors uppercase tracking-widest">{page}</button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {[ 
            {name: 'Instagram', icon: Instagram, url: 'https://www.instagram.com/iedcmtm/'}, 
            {name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/iedc-mtm-aa58a03b5'}, 
            {name: 'X', icon: Twitter, url: 'https://x.com/IedcMtm'} 
          ].map(link => (
            <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="p-3 bg-gray-50 rounded-full hover:bg-gray-100 hover:-translate-y-1 transition-all text-gray-500 hover:text-black shadow-sm">
               <link.icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </div>
    
    <button onClick={() => setShowLogin(true)} className="absolute bottom-8 right-6 md:right-12 opacity-0 hover:opacity-100 transition-opacity p-3 z-10">
      <Lock size={16} className="text-gray-300"/>
    </button>
  </footer>
);

const AdminLogin = ({ onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      onLogin();
    } else {
      setError('Invalid stealth credentials.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="bg-white/95 rounded-[2rem] p-6 sm:p-12 w-full max-w-lg shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-gray-100/80 rounded-2xl"><Lock size={24} className="text-gray-800" /></div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">Admin Gateway</h2>
        </div>
        {error && <p className="text-red-600 mb-6 bg-red-50 font-semibold p-4 rounded-xl text-sm border border-red-100">{error}</p>}
        <div className="space-y-5">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 border-2 border-gray-100 bg-white/80 rounded-2xl focus:outline-none focus:border-black font-medium transition-all" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Passkey</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 border-2 border-gray-100 bg-white/80 rounded-2xl focus:outline-none focus:border-black font-medium transition-all" />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <button onClick={onClose} className="flex-1 p-4 rounded-xl text-gray-700 font-bold bg-gray-50 hover:bg-gray-100 transition-all">Cancel</button>
          <button onClick={handleLogin} className="flex-1 p-4 rounded-xl text-white font-bold bg-black shadow-xl shadow-black/10 hover:bg-gray-800 transition-all hover:scale-[1.02]">Authorize Access</button>
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ setCurrentPage }) => (
  <main className="max-w-[1200px] mx-auto pt-32 md:pt-48 px-6 md:px-12 text-center animate-in fade-in duration-500">
    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-950 max-w-[1000px] mx-auto leading-[1.1] tracking-tight"> 
      Innovation and Enterprise<br className="hidden sm:block" />
      <span className="text-gray-400">Development Center of MTM College</span>
    </h1>
    <p className="mt-8 md:mt-10 text-lg sm:text-xl md:text-2xl text-gray-600 max-w-[750px] mx-auto leading-relaxed font-medium"> 
      Join a vibrant community dedicated to fostering innovation. Experience resources, mentorship, and opportunities designed to accelerate your growth. 
    </p>
    <div className="mt-10 md:mt-14 flex flex-col sm:flex-row justify-center items-center gap-5">
      <button onClick={() => setCurrentPage('events')} className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">Discover Our Events</button>
      <button onClick={() => setCurrentPage('members')} className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-white border-2 border-gray-200 text-gray-800 rounded-full font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all">Meet The Innovators</button>
    </div>
    
    <div className="mt-24 md:mt-40 mb-20 md:mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left">
      {[ {icon: Rocket, title: 'Accelerate growth.', text: 'Join a vibrant network of passionate creators and innovators. Gain real guidance, explore new opportunities, and develop lasting connections.'}, {icon: Zap, title: 'Unlock potential.', text: 'Access exclusive events, mentorship, and resources that empower your entrepreneurial journey. Be part of a community that supports your ambitions.'} ].map((f, i) => (
        <div key={i} className="p-8 md:p-12 bg-white/50 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 backdrop-blur-sm transition-all hover:shadow-2xl hover:-translate-y-2">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-800 shadow-sm border border-gray-200 hover:scale-110 transition-transform">
             <f.icon size={32} strokeWidth={2.5} />
          </div>
          <h3 className="mt-8 text-2xl md:text-3xl font-black text-gray-950 tracking-tight">{f.title}</h3>
          <p className="mt-4 text-gray-600 leading-relaxed text-base md:text-lg font-medium">{f.text}</p>
        </div>
      ))}
    </div>
  </main>
);

const EventsPage = ({ events }) => {
  const [expandedEvent, setExpandedEvent] = useState(null);

  return (
    <main className="max-w-[1200px] mx-auto pt-32 md:pt-48 px-6 md:px-12 text-left animate-in fade-in duration-500">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-950 tracking-tight">Events <span className="text-gray-300">Hub</span></h1>
      <p className="mt-4 md:mt-6 text-xl md:text-2xl text-gray-500 font-medium">Experience EDC's dynamic happenings.</p>
      
      <div className="mt-14 md:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-20 md:mb-32">
        {events.length === 0 ? (
           <div className="col-span-full py-20 text-center text-gray-400 font-medium text-lg">No events scheduled at the moment.</div>
        ) : events.map(event => {
          const isExpanded = expandedEvent === event.id;
          return (
            <div key={event.id} onClick={() => setExpandedEvent(isExpanded ? null : event.id)} className={`overflow-hidden bg-white/70 rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 backdrop-blur-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer group ${isExpanded ? 'col-span-1 sm:col-span-2 lg:col-span-3' : ''}`}>
              <div className={`w-full bg-gray-50 flex items-center justify-center relative overflow-hidden transition-all duration-500 ${isExpanded ? 'h-64 sm:h-80 md:h-96' : 'aspect-[4/3]'}`}>
                {event.cover ? (
                  <img src={event.cover} alt={event.title} className={`w-full h-full object-cover transition-transform duration-700 ${!isExpanded && 'group-hover:scale-105'}`} />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300 gap-4">
                    <ImageIcon className="w-16 h-16 md:w-20 md:h-20 opacity-50" />
                  </div>
                )}
                {!isExpanded && <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />}
              </div>
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start gap-4">
                  <h3 className={`font-bold text-gray-950 leading-tight transition-all ${isExpanded ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>{event.title}</h3>
                  <div className={`p-2 rounded-full transition-colors ${isExpanded ? 'bg-gray-100 text-black' : 'bg-gray-50 text-gray-400 group-hover:bg-black group-hover:text-white'}`}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="mt-8 border-t-2 border-gray-50 pt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="inline-block px-4 py-2 bg-orange-50 text-orange-600 font-bold rounded-xl text-sm mb-6 tracking-wide">{event.date}</div>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-medium">{event.desc}</p>
                    
                    {event.images && event.images.length > 0 && (
                      <div className="mt-12">
                        <h4 className="text-sm font-black text-gray-400 mb-6 uppercase tracking-widest border-b border-gray-100 pb-3">Event Gallery</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
                          {event.images.map((imgSrc, idx) => (
                            <a key={idx} href={imgSrc} target="_blank" rel="noopener noreferrer" className="aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all hover:scale-[1.02] block" onClick={e => e.stopPropagation()}>
                              <img src={imgSrc} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

const MembersPage = ({ members }) => {
  const grouped = members.reduce((acc, m) => {
    const h = parseInt(m.hierarchy) || 4;
    if (!acc[h]) acc[h] = [];
    acc[h].push(m);
    return acc;
  }, {});

  const sortedHierarchies = Object.keys(grouped).sort((a,b) => a - b);

  const getWidthClass = (h) => {
    if (h == 1) return "w-48 sm:w-56 md:w-64";
    if (h == 2) return "w-40 sm:w-48 md:w-52";
    return "w-32 sm:w-40 md:w-44";
  };

  const getGapClass = (h) => {
    if (h == 1) return "gap-8 md:gap-14";
    if (h == 2) return "gap-6 md:gap-10";
    return "gap-5 md:gap-8";
  };

  return (
    <main className="max-w-[1200px] mx-auto pt-32 md:pt-48 px-6 md:px-12 text-center animate-in fade-in duration-500 mb-20 md:mb-32">
      <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-950 mb-6 tracking-tight">Our <span className="text-orange-500">Members</span></h1>
      <p className="text-lg md:text-xl text-gray-500 font-medium mb-16 md:mb-24 max-w-2xl mx-auto">The brilliant minds driving innovation and shaping the future at IEDC Incubator.</p>
      
      {sortedHierarchies.length === 0 ? (
         <div className="py-20 text-gray-400 font-medium">No members found.</div>
      ) : sortedHierarchies.map(h => (
        <div key={h} className="mb-20 md:mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${h * 100}ms`}}>
          <div className={`flex flex-wrap justify-center ${getGapClass(h)} max-w-[1200px] mx-auto`}>
            {grouped[h].map(member => (
              <div key={member.id} className={`flex flex-col items-center group ${getWidthClass(h)}`}>
                <div className={`
                  w-full aspect-square
                  bg-gradient-to-br from-gray-50 to-gray-100 rounded-full
                  flex items-center justify-center overflow-hidden
                  shadow-xl shadow-gray-200/30 
                  border-[6px] border-white/80 backdrop-blur-xl relative
                  group-hover:shadow-2xl group-hover:shadow-orange-500/20 group-hover:border-white
                  transition-all duration-500
                `}>
                  {member.img ? (
                     <div className="w-full h-full transform group-hover:scale-110 transition-transform duration-500 overflow-hidden">
                       <img src={member.img} alt={member.name} className="w-full h-full object-cover" style={{ objectPosition: `${member.imgPosX ?? 50}% ${member.imgPosY ?? 50}%`, transform: `scale(${member.imgScale ?? 1})` }} />
                     </div>
                  ) : (
                     <ImageIcon className="w-1/3 h-1/3 text-gray-300 group-hover:text-gray-400 transition-colors" />
                  )}
                </div>
                <div className="mt-6 md:mt-8 px-2 flex flex-col flex-1">
                  <h4 className="text-lg md:text-xl font-black text-black group-hover:text-orange-600 transition-colors leading-tight">{member.name}</h4>
                  <p className="text-xs md:text-sm text-gray-500 font-bold mt-2 tracking-wide uppercase">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
};

const AboutPage = () => (
  <main className="max-w-[1200px] mx-auto pt-32 md:pt-48 px-6 md:px-12 text-left animate-in fade-in duration-500 mb-20 md:mb-32">
    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-950 tracking-tight mb-12">About <span className="text-orange-500">IEDC</span></h1>
    
    <div className="max-w-4xl space-y-12">
      <section>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
          The Innovation and Entrepreneurship Development Centre (IEDC) of MTM Arts, Science and Commerce College, Veliyancode, is a dynamic initiative dedicated to nurturing a culture of innovation.
        </p>
        <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
          We offer a supportive platform where creative students explore ideas, collaborate effectively, and convert their innovations into practical prototypes of viable products and services. Through workshops, webinars, EnTalks, and competitions, we aim to transform entrepreneurial ideas into commercial solutions, empowering young innovators to make a tangible impact on society.
        </p>
      </section>

      <section className="bg-orange-50 rounded-[2.5rem] p-8 md:p-12 border border-orange-100 mt-16 shadow-lg shadow-orange-500/5">
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Our Vision</h3>
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
          To build an active ecosystem that seamlessly bridges academia with real-world industry demands. We envision a future where students don't just consume knowledge, but actively design the solutions that will drive technological and social progress.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mt-16">
        <section>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 border-b-2 border-gray-100 pb-4">Our Mission</h3>
          <ul className="space-y-4 text-base md:text-lg text-gray-600 font-medium">
            <li className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-orange-500 mt-2.5 shrink-0" /> Facilitate hands-on technological literacy.</li>
            <li className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-orange-500 mt-2.5 shrink-0" /> Provide early-stage startup incubation and mentorship.</li>
            <li className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-orange-500 mt-2.5 shrink-0" /> Partner with strategic industry leaders to validate concepts.</li>
            <li className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-orange-500 mt-2.5 shrink-0" /> Cultivate a collaborative, inter-disciplinary community.</li>
          </ul>
        </section>
        <section>
          <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 border-b-2 border-gray-100 pb-4">Core Values</h3>
          <ul className="space-y-4 text-base md:text-lg text-gray-600 font-medium">
            <li className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" /> <div><strong className="text-gray-900">Innovation First:</strong> Prioritizing creative and untested ideas over safe standards.</div></li>
            <li className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" /> <div><strong className="text-gray-900">Resilience:</strong> Fostering an environment where experimentation is celebrated.</div></li>
            <li className="flex gap-3 items-start"><div className="w-2 h-2 rounded-full bg-black mt-2.5 shrink-0" /> <div><strong className="text-gray-900">Community:</strong> Operating under the belief that great things are built together.</div></li>
          </ul>
        </section>
      </div>
    </div>
  </main>
);

const AdminPage = ({ members, setMembers, events, setEvents, isAdmin, setIsAdmin, setCurrentPage }) => {
  const [activeTab, setActiveTab] = useState('members');
  
  const [editingMember, setEditingMember] = useState(null);
  const [newMember, setNewMember] = useState({ name: '', hierarchy: 3, role: '', img: null, imgScale: 1, imgPosX: 50, imgPosY: 50 });
  
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', desc: '', cover: null, images: [] });

  const handleReorder = (id, direction) => {
    setMembers(prev => {
      const index = prev.findIndex(m => m.id === id);
      if ((direction === 'up' && index > 0) || (direction === 'down' && index < prev.length - 1)) {
        const swap = direction === 'up' ? index - 1 : index + 1;
        const arr = [...prev];
        [arr[index], arr[swap]] = [arr[swap], arr[index]];
        return arr;
      }
      return prev;
    });
  };

  const handleSaveMember = (m) => {
    if (m.id) setMembers(members.map(x => x.id === m.id ? m : x));
    else setMembers([...members, { ...m, id: Date.now() }]);
    setEditingMember(null);
  };

  const handleSaveEvent = (e) => {
    if (e.id) setEvents(events.map(x => x.id === e.id ? e : x));
    else setEvents([{ ...e, id: Date.now() }, ...events]);
    setEditingEvent(null);
  };

  const [uploadStatus, setUploadStatus] = useState({ active: false, progress: 0, type: '', error: null });

  const uploadToFirebase = (file, folderPath) => {
    return new Promise((resolve, reject) => {
      setUploadStatus({ active: true, progress: 0, type: 'uploading', error: null });
      const fileRef = ref(storage, `${folderPath}/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => setUploadStatus(prev => ({ ...prev, progress: Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) })),
        (error) => {
          setUploadStatus({ active: true, progress: 0, type: 'error', error: error.message });
          setTimeout(() => setUploadStatus({ active: false, progress: 0, type: '', error: null }), 4000);
          reject(error);
        },
        async () => {
          setUploadStatus({ active: true, progress: 100, type: 'success', error: null });
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setTimeout(() => setUploadStatus({ active: false, progress: 0, type: '', error: null }), 2000);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleMemberPhotoUpload = async (e) => {
    if (e.target.files.length > 0) {
      try {
        const url = await uploadToFirebase(e.target.files[0], 'members');
        setEditingMember({ ...editingMember, img: url, imgScale: 1, imgPosX: 50, imgPosY: 50 });
      } catch (err) { console.error(err); }
    }
  };

  const handleCoverUpload = async (e) => {
    if (e.target.files.length > 0) {
      try {
        const url = await uploadToFirebase(e.target.files[0], 'events/covers');
        setEditingEvent({ ...editingEvent, cover: url });
      } catch (err) { console.error(err); }
    }
  };

  const handleGalleryUpload = async (e) => {
    if (e.target.files.length > 0) {
      setUploadStatus({ active: true, progress: 0, type: 'uploading', error: null });
      const newUrls = [];
      const files = Array.from(e.target.files);
      try {
        for (let i = 0; i < files.length; i++) {
          const fileRef = ref(storage, `events/gallery/${Date.now()}_${files[i].name}`);
          const uploadTask = uploadBytesResumable(fileRef, files[i]);
          await new Promise((resolve, reject) => {
            uploadTask.on('state_changed', 
              (snapshot) => {
                const totalProg = Math.round(((i + (snapshot.bytesTransferred / snapshot.totalBytes)) / files.length) * 100);
                setUploadStatus(prev => ({ ...prev, progress: totalProg }));
              },
              reject,
              async () => {
                newUrls.push(await getDownloadURL(uploadTask.snapshot.ref));
                resolve();
              }
            );
          });
        }
        setEditingEvent({ ...editingEvent, images: [...(editingEvent.images || []), ...newUrls] });
        setUploadStatus({ active: true, progress: 100, type: 'success', error: null });
        setTimeout(() => setUploadStatus({ active: false, progress: 0, type: '', error: null }), 2000);
      } catch (error) {
        setUploadStatus({ active: true, progress: 0, type: 'error', error: error.message });
        setTimeout(() => setUploadStatus({ active: false, progress: 0, type: '', error: null }), 4000);
      }
    }
  };

  const handleRemoveGalleryImage = (e, indexToRemove) => {
    e.stopPropagation();
    const updatedImages = editingEvent.images.filter((_, i) => i !== indexToRemove);
    setEditingEvent({ ...editingEvent, images: updatedImages });
  };

  if (!isAdmin) return <HomePage setCurrentPage={setCurrentPage} />;

  return (
    <main className="max-w-[1200px] mx-auto pt-32 md:pt-48 px-6 md:px-12 text-left mb-20 md:mb-32 animate-in fade-in duration-500 relative">
      
      {/* Uploading Status Overlay */}
      {uploadStatus.active && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 text-center">
            {uploadStatus.type === 'uploading' && (
              <>
                <Loader2 className="w-16 h-16 text-orange-500 animate-spin mb-6" />
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Authenticating Upload...</h3>
                <div className="w-full h-3 bg-gray-100 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${uploadStatus.progress}%` }}></div>
                </div>
                <p className="text-gray-500 font-bold mt-3 tracking-widest text-xs uppercase">{uploadStatus.progress}% SECURED</p>
              </>
            )}
            {uploadStatus.type === 'success' && (
              <>
                <CheckCircle2 className="w-20 h-20 text-green-500 mb-6 animate-in zoom-in" />
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verified & Saved</h3>
                <p className="text-gray-500 font-bold mt-2">Asset is safely hosted on Cloud Storage.</p>
              </>
            )}
            {uploadStatus.type === 'error' && (
              <>
                <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Transfer Failed</h3>
                <p className="text-red-500 font-bold mt-2 text-sm">{uploadStatus.error}</p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-gray-950 flex items-center gap-4 tracking-tight"> <Lock className="text-orange-500 w-10 h-10 bg-orange-50 p-2 rounded-xl" /> Stealth Gateway</h1>
        <button onClick={() => { setIsAdmin(false); setCurrentPage('home'); }} className="w-full sm:w-auto px-8 py-4 rounded-xl text-gray-700 bg-white border-2 border-gray-100 hover:border-gray-300 font-bold transition-all hover:shadow-lg">Exit Gateway</button>
      </div>

      <div className="flex flex-wrap gap-4 mb-10 pb-2">
        <button onClick={() => setActiveTab('members')} className={`px-8 py-4 rounded-2xl font-bold transition-all ${activeTab === 'members' ? 'bg-black text-white shadow-xl shadow-black/20 scale-105' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>Members Directory</button>
        <button onClick={() => setActiveTab('events')} className={`px-8 py-4 rounded-2xl font-bold transition-all ${activeTab === 'events' ? 'bg-black text-white shadow-xl shadow-black/20 scale-105' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>Events Configurator</button>
      </div>

      {activeTab === 'members' && (
        <section className="bg-white/80 rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/20 backdrop-blur-xl animate-in slide-in-from-right-8 duration-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Hierarchy Management</h2>
              <p className="text-gray-500 font-medium mt-1">Control member organization and priority scaling.</p>
            </div>
            <button onClick={() => setEditingMember({...newMember})} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold bg-orange-500 hover:bg-orange-600 transition-all hover:scale-105 shadow-xl shadow-orange-500/20"> <Plus size={20} /> Add Member </button>
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={member.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-2xl border-2 ${editingMember?.id === member.id ? 'border-orange-400 shadow-orange-100' : 'border-gray-50'} hover:border-gray-200 hover:shadow-xl transition-all group`}>
                <div className="hidden sm:block text-gray-300 group-hover:text-gray-600 cursor-grab px-2"> <GripVertical size={24} /> </div>
                
                <div className="flex w-full sm:w-auto items-center gap-4">
                  <div className="flex flex-row sm:flex-col gap-2 p-2 rounded-xl bg-gray-50 text-xs font-mono">
                    <button onClick={() => handleReorder(member.id, 'up')} disabled={index === 0} className="disabled:opacity-20 p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"> <MoveUp size={16} /> </button>
                    <button onClick={() => handleReorder(member.id, 'down')} disabled={index === members.length - 1} className="disabled:opacity-20 p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-100 transition-colors"> <MoveDown size={16} /> </button>
                  </div>
                  <div className="bg-gray-50 w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden flex items-center justify-center shadow-inner border border-gray-100">
                    {member.img ? <img src={member.img} className="w-full h-full object-cover" style={{ objectPosition: `${member.imgPosX ?? 50}% ${member.imgPosY ?? 50}%`, transform: `scale(${member.imgScale ?? 1})` }} /> : <ImageIcon className="w-1/2 h-1/2 text-gray-300" />}
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <h4 className="text-lg md:text-xl font-black text-gray-950">{member.name}</h4>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="font-bold text-gray-500 text-sm tracking-wide uppercase">{member.role}</span> 
                    <span className="font-black text-orange-700 bg-orange-100 px-3 py-1 rounded-lg text-xs tracking-wider">LEVEL {member.hierarchy}</span>
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                  <button onClick={() => setEditingMember(member)} className="flex-1 sm:flex-none p-3 md:p-4 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 hover:text-black font-bold transition-colors"> <Edit2 size={18} /> </button>
                  <button onClick={() => setMembers(members.filter(m => m.id !== member.id))} className="flex-1 sm:flex-none p-3 md:p-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold transition-colors"> <Trash2 size={18} /> </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'events' && (
        <section className="bg-white/80 rounded-[2.5rem] p-6 md:p-12 shadow-2xl border border-white/20 backdrop-blur-xl animate-in slide-in-from-left-8 duration-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Events Configurator</h2>
              <p className="text-gray-500 font-medium mt-1">Publish and manage incubator activities.</p>
            </div>
            <button onClick={() => setEditingEvent({...newEvent})} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-bold bg-orange-500 hover:bg-orange-600 transition-all hover:scale-105 shadow-xl shadow-orange-500/20"> <Plus size={20}/> Initialize Event </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {events.map(ev => (
               <div key={ev.id} className="p-6 bg-white rounded-[2rem] border-2 border-gray-50 flex flex-col gap-5 hover:border-gray-200 hover:shadow-xl transition-all group">
                 <div className="w-full aspect-[4/3] bg-gray-50 rounded-2xl overflow-hidden flex flex-col items-center justify-center text-gray-300 relative border border-gray-100/50">
                   {ev.cover ? <img src={ev.cover} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"/> : <ImageIcon className="w-12 h-12 mb-2"/>}
                   {!ev.cover && <span className="text-xs font-bold uppercase tracking-widest text-gray-400">No Cover</span>}
                 </div>
                 <div className="flex-1">
                   <h4 className="font-black text-gray-900 text-xl leading-tight line-clamp-2">{ev.title}</h4>
                   <p className="text-orange-500 font-bold text-xs tracking-wider uppercase mt-2">{ev.date}</p>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={() => setEditingEvent(ev)} className="p-3 bg-gray-50 rounded-xl text-gray-700 flex-1 flex justify-center hover:bg-gray-100 transition-colors"><Edit2 size={18}/></button>
                    <button onClick={() => setEvents(events.filter(e => e.id !== ev.id))} className="p-3 bg-red-50 rounded-xl text-red-600 flex-1 flex justify-center hover:bg-red-100 transition-colors"><Trash2 size={18}/></button>
                 </div>
               </div>
            ))}
          </div>
        </section>
      )}

      {/* Editing Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" onClick={() => setEditingMember(null)}>
          <div className="bg-white rounded-[2.5rem] p-6 md:p-12 w-full max-w-2xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl md:text-3xl font-black mb-8 tracking-tight">{editingMember.id ? 'Edit Member Profile' : 'New Member Profile'}</h3>
            <div className="space-y-8">
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 block ml-1">Member Photo Alignment</label>
                <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
                  <div className="relative group cursor-pointer w-32 h-32 shrink-0 bg-white border-2 border-dashed border-gray-200 rounded-full overflow-hidden hover:border-orange-400 transition-colors flex flex-col items-center justify-center shadow-inner">
                     {editingMember.img ? (
                        <>
                          <img src={editingMember.img} className="w-full h-full object-cover" style={{ objectPosition: `${editingMember.imgPosX ?? 50}% ${editingMember.imgPosY ?? 50}%`, transform: `scale(${editingMember.imgScale ?? 1})` }}/>
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-[10px] uppercase tracking-wider text-center px-2">Change</span>
                          </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-400 group-hover:text-orange-500 transition-colors">
                          <Upload size={18}/>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight">Select<br/>Photo</span>
                        </div>
                     )}
                     <input type="file" accept="image/*" onChange={handleMemberPhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                  </div>
                  
                  {editingMember.img ? (
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 flex justify-between uppercase mb-1"><span>Zoom Scale</span> <span>{editingMember.imgScale || 1}x</span></label>
                        <input type="range" min="1" max="3" step="0.1" value={editingMember.imgScale || 1} onChange={e => setEditingMember({...editingMember, imgScale: parseFloat(e.target.value)})} className="w-full accent-orange-500" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 flex justify-between uppercase mb-1"><span>Horizontal Align</span> <span>{editingMember.imgPosX ?? 50}%</span></label>
                        <input type="range" min="0" max="100" value={editingMember.imgPosX ?? 50} onChange={e => setEditingMember({...editingMember, imgPosX: parseInt(e.target.value)})} className="w-full accent-orange-500" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 flex justify-between uppercase mb-1"><span>Vertical Align</span> <span>{editingMember.imgPosY ?? 50}%</span></label>
                        <input type="range" min="0" max="100" value={editingMember.imgPosY ?? 50} onChange={e => setEditingMember({...editingMember, imgPosY: parseInt(e.target.value)})} className="w-full accent-orange-500" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 w-full text-center sm:text-left text-gray-400 text-sm font-medium mt-4 sm:mt-0">
                      Upload an image to access zoom and alignment tools.
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Full Name</label>
                <input type="text" value={editingMember.name} onChange={e => setEditingMember({...editingMember, name: e.target.value})} className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-orange-400 font-medium transition-colors" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Hierarchy Target</label>
                  <select value={editingMember.hierarchy} onChange={e => setEditingMember({...editingMember, hierarchy: e.target.value})} className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-orange-400 font-bold text-gray-700 appearance-none bg-white transition-colors">
                    {[1, 2, 3, 4, 5].map(lvl => <option key={lvl} value={lvl}>Level {lvl} {lvl === 1 ? '(Largest)' : lvl === 2 ? '(Medium)' : lvl === 3 ? '(Smallest)' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Role Title</label>
                  <input type="text" value={editingMember.role} onChange={e => setEditingMember({...editingMember, role: e.target.value})} className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-orange-400 font-medium transition-colors placeholder:text-gray-300" placeholder="e.g. Technical Lead" />
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t-2 border-gray-50">
              <button onClick={() => setEditingMember(null)} className="flex-1 p-4 rounded-xl font-bold bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors">Cancel Session</button>
              <button onClick={() => handleSaveMember(editingMember)} className="flex-[2] p-4 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all hover:scale-[1.02] shadow-xl shadow-orange-500/20">Commit Profile Data</button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" onClick={() => setEditingEvent(null)}>
          <div className="bg-white rounded-[2.5rem] p-6 md:p-12 w-full max-w-3xl shadow-2xl border border-white/20 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl md:text-3xl font-black mb-8 tracking-tight">{editingEvent.id ? 'Modify Event Config' : 'Initialize New Event'}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Event Designation</label>
                  <input type="text" value={editingEvent.title} onChange={e => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-orange-400 font-bold transition-colors" placeholder="Epic Hackathon 2026"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Scheduled Date</label>
                  <input type="text" value={editingEvent.date} onChange={e => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-orange-400 font-medium transition-colors" placeholder="Oct 14, 2026"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Manifesto / Description</label>
                  <textarea value={editingEvent.desc} onChange={e => setEditingEvent({...editingEvent, desc: e.target.value})} className="w-full p-4 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-orange-400 font-medium transition-colors min-h-[120px] resize-y" placeholder="Detail the core objectives..."/>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Cover Artwork</label>
                  <div className="relative group cursor-pointer w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden hover:border-orange-400 transition-colors flex flex-col items-center justify-center">
                     {editingEvent.cover ? (
                        <>
                          <img src={editingEvent.cover} className="w-full h-full object-cover"/>
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-bold text-sm bg-black/50 px-4 py-2 rounded-lg backdrop-blur-md">Change Cover</span>
                          </div>
                        </>
                     ) : (
                        <div className="flex flex-col items-center gap-3 text-gray-400 group-hover:text-orange-500 transition-colors">
                          <Upload size={28}/>
                          <span className="text-sm font-bold">Select Cover File</span>
                        </div>
                     )}
                     <input type="file" accept="image/*" onChange={handleCoverUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Supplementary Gallery ({editingEvent.images?.length || 0})</label>
                  <div className="relative w-full p-4 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl hover:border-orange-400 transition-colors flex items-center justify-center cursor-pointer">
                    <span className="text-sm font-bold text-gray-500 flex items-center gap-2"><Plus size={16}/> Append Gallery Items</span>
                    <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"/>
                  </div>
                  
                  {editingEvent.images && editingEvent.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-3 max-h-[160px] overflow-y-auto p-1 scrollbar-hide">
                      {editingEvent.images.map((img, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group">
                          <img src={img} className="w-full h-full object-cover"/>
                          <button onClick={(e) => handleRemoveGalleryImage(e, i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md">
                            <X size={12}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t-2 border-gray-50">
              <button onClick={() => setEditingEvent(null)} className="flex-1 p-4 rounded-xl font-bold bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors">Abort Config</button>
              <button onClick={() => handleSaveEvent(editingEvent)} className="flex-[2] p-4 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-all hover:scale-[1.02] shadow-xl shadow-black/10">Commit To Production</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  
  const [members, setMembers] = useState(initialMembers);
  const [events, setEvents] = useState(initialEvents);

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage setCurrentPage={setCurrentPage} />;
      case 'events': return <EventsPage events={events} />;
      case 'members': return <MembersPage members={members} />;
      case 'about': return <AboutPage />;
      case 'admin': return <AdminPage members={members} setMembers={setMembers} events={events} setEvents={setEvents} isAdmin={isAdmin} setIsAdmin={setIsAdmin} setCurrentPage={setCurrentPage} />;
      default: return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  const handleAdminAuth = () => {
    setIsAdmin(true);
    setShowLogin(false);
    setCurrentPage('admin');
  };

  return (
    <div className="min-h-screen font-sans bg-[#FDFDFD] text-gray-900 scroll-smooth selection:bg-orange-200 selection:text-orange-900 flex flex-col">
      <Header setCurrentPage={setCurrentPage} />
      <div className="flex-1 w-full">
        {renderPage()}
      </div>
      <Footer setCurrentPage={setCurrentPage} setShowLogin={setShowLogin} />
      {showLogin && <AdminLogin onClose={() => setShowLogin(false)} onLogin={handleAdminAuth} />}
      <SpeedInsights />
    </div>
  );
}
