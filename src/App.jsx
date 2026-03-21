import React, { useState, useEffect } from 'react';
import { Lock, Linkedin, Instagram, Twitter, Trash2, Edit2, Plus, Upload, Loader2, Image as ImageIcon, Rocket, Zap, ChevronDown, Menu, X } from 'lucide-react';
import { storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, doc } from 'firebase/firestore';
import logoImg from './assets/logo.png';

// --- MAIN CONFIG & MOCK DATA ---
const ADMIN_CREDENTIALS = { username: 'shameem', password: 'shameem123#' };
const baseRoles = ["Nodal Officers", "Executive Committee", "Core Team", "Volunteers", "Unassigned"];

const initialMembers = [];

const mockEvents = [];
const deletedMockIds = new Set();

// --- SVG COMPONENTS ---
const RoaLogoSvg = () => (
    <img src={logoImg} alt="IEDC Logo" className="h-[30px] w-auto object-contain" />
);

const SignatureSvg = () => (
    <svg width="100" height="60" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-6">
        <path d="M5 45C10 40 20 20 30 10C40 0 60 10 70 30C80 50 90 55 95 58" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const Header = ({ setCurrentPage, isAdmin }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleNav = (page) => {
        setCurrentPage(page);
        setIsMenuOpen(false);
        if (window.innerWidth < 768 && page !== 'admin') {
            setTimeout(() => {
                const el = document.getElementById(page);
                if (el) {
                    window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                }
            }, 50);
        } else {
            window.scrollTo(0,0);
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-4 md:px-8 py-4">
            <div className="flex items-center justify-between">
                <div className="cursor-pointer" onClick={() => handleNav('home')}> <RoaLogoSvg /> </div>
                
                <nav className="hidden md:flex items-center gap-5 md:gap-8 font-semibold text-[15px] text-gray-600 overflow-hidden">
                    {['Home', 'Members', 'Events'].map(page => (
                        <button key={page} onClick={() => handleNav(page.toLowerCase())} className="hover:text-black transition-colors capitalize shrink-0">{page}</button>
                    ))}
                    <div className={`transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center shrink-0 ${isAdmin ? 'opacity-100 max-w-[100px] ml-2' : 'opacity-0 max-w-0 ml-0 overflow-hidden'}`}>
                        <button onClick={() => handleNav('admin')} className="text-orange-500 hover:text-orange-600 font-bold capitalize flex items-center gap-1.5"><Lock size={14}/> Admin</button>
                    </div>
                </nav>

                <button className="md:hidden p-2 text-gray-600 hover:text-black transition-colors" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {isMenuOpen && (
                <nav className="md:hidden pt-4 pb-2 flex flex-col gap-4 font-semibold text-base text-gray-600 border-t border-gray-100 mt-4">
                    {['Home', 'Members', 'Events'].map(page => (
                        <button key={page} onClick={() => handleNav(page.toLowerCase())} className="hover:text-black transition-colors capitalize text-left flex items-center w-full">{page}</button>
                    ))}
                    {isAdmin && (
                        <button onClick={() => handleNav('admin')} className="text-orange-500 hover:text-orange-600 font-bold capitalize flex items-center gap-2 text-left pt-3 border-t border-gray-50"><Lock size={14}/> Admin Interface</button>
                    )}
                </nav>
            )}
        </header>
    );
};

const Footer = ({ setCurrentPage, setShowLogin, isAdmin }) => (
    <footer className="mt-16 md:mt-24 px-4 md:px-8 py-12 md:py-16 border-t border-gray-100 text-sm md:text-base text-gray-600 bg-white/80 rounded-t-3xl backdrop-blur-sm relative overflow-hidden">
        <button onClick={() => { if (isAdmin) { setCurrentPage('admin'); window.scrollTo(0,0); } else { setShowLogin(true); } }} className="absolute bottom-2 right-2 md:bottom-4 md:right-4 opacity-10 hover:opacity-100 transition-opacity p-2 rounded-lg bg-gray-100">
            <Lock size={16} />
        </button>
        <div className="w-full flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
            <div className="flex flex-col items-center md:items-start gap-5 w-full md:w-1/3 text-center md:text-left">
                <RoaLogoSvg />
                <p className="mt-1 text-xs md:text-sm text-gray-400 max-w-[250px]">Empowering innovation and building tomorrow's entrepreneurs.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 w-full md:w-auto justify-center md:justify-end text-center sm:text-left">
                <div className="flex flex-col items-center sm:items-start gap-4">
                    <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-widest text-[11px] md:text-xs">Navigate</h4>
                    {['Home', 'About', 'Events', 'Members'].map(page => (
                        <button key={page} onClick={() => { 
                            const target = page.toLowerCase();
                            setCurrentPage(target); 
                            if (window.innerWidth < 768) {
                                setTimeout(() => {
                                    const el = document.getElementById(target);
                                    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                                }, 50);
                            } else {
                                window.scrollTo(0,0); 
                            }
                        }} className="hover:text-black transition-colors capitalize font-medium">{page}</button>
                    ))}
                </div>

                <div className="flex flex-col items-center sm:items-start gap-4">
                    <h4 className="font-bold text-gray-900 mb-1 uppercase tracking-widest text-[11px] md:text-xs">Connect</h4>
                    {[{ name: 'Instagram', url: 'https://www.instagram.com/iedcmtm/', icon: Instagram }, { name: 'LinkedIn', url: 'https://www.linkedin.com/in/iedc-mtm-aa58a03b5', icon: Linkedin }, { name: 'X', url: 'https://x.com/IedcMtm', icon: Twitter }].map(link => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-black transition-colors font-medium"> <link.icon size={16} /> {link.name}</a>
                    ))}
                </div>
            </div>
        </div>
        
        <div className="hidden md:block mt-12 pt-6 sm:pt-8 border-t border-gray-100 text-center text-xs text-gray-400 w-full relative z-10">
            <p>© 2025–2028 All Rights Reserved by MTM college, Veliyancode</p>
        </div>
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
            setError('Invalid credentials.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6" onClick={onClose}>
            <div className="bg-white/80 rounded-2xl p-10 w-full max-w-lg shadow-xl border border-white/20" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 mb-6">
                    <Lock size={20} className="text-gray-500" />
                    <h2 className="text-3xl font-bold text-gray-950">Admin Panel</h2>
                </div>
                {error && <p className="text-red-600 mb-4 bg-red-100 p-3 rounded-lg text-sm">{error}</p>}
                <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 mb-4 border border-gray-100 bg-white/60 rounded-xl focus:ring-2 focus:ring-black" />
                <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-4 mb-6 border border-gray-100 bg-white/60 rounded-xl focus:ring-2 focus:ring-black" />
                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 p-4 rounded-xl text-gray-700 font-semibold bg-gray-100 hover:bg-gray-200 transition-colors">Cancel</button>
                    <button onClick={handleLogin} className="flex-1 p-4 rounded-xl text-white font-semibold bg-black hover:bg-gray-800 transition-colors">Login</button>
                </div>
            </div>
        </div>
    );
};

// --- PAGES ---
const HomePage = ({ setCurrentPage }) => (
    <main className="max-w-[1200px] mx-auto pt-32 md:pt-48 px-4 md:px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-950 max-w-[800px] mx-auto leading-tight md:leading-tight"> Empowering Innovation. <span className="text-gray-400">Building Entrepreneurs.</span> </h1>
        <p className="mt-6 md:mt-8 text-base md:text-xl text-gray-700 max-w-[650px] mx-auto leading-relaxed"> Join our vibrant community dedicated to fostering innovation and entrepreneurship. Experience resources, mentorship, and opportunities designed to accelerate your growth. </p>
        <div className="mt-10 md:mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => { setCurrentPage('about'); window.scrollTo(0,0); }} className="px-10 py-4 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">Explore IEDC</button>
            <button onClick={() => { setCurrentPage('events'); window.scrollTo(0,0); }} className="px-10 py-4 bg-gray-100 text-gray-800 rounded-full text-sm font-semibold hover:bg-gray-200 transition-colors">View Events</button>
        </div>
        <div className="mt-20 md:mt-28 mb-20 md:mb-32 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left">
            {[{ icon: Rocket, title: 'Accelerate growth.', text: 'Join a vibrant network of passionate creators and innovators. Gain real guidance, explore new opportunities, and develop lasting professional connections.' }, { icon: Zap, title: 'Unlock potential.', text: 'Access exclusive events, mentorship, and resources that empower your entrepreneurial journey. Be part of a community that supports your ambitions.' }].map((f, i) => (
                <div key={i} className="p-8 md:p-10 bg-white/80 rounded-3xl border border-gray-100 shadow-xl backdrop-blur-sm group hover:border-orange-200 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                        <f.icon size={32} />
                    </div>
                    <h3 className="mt-6 md:mt-8 text-2xl md:text-3xl font-semibold text-gray-950">{f.title}</h3>
                    <p className="mt-3 md:mt-4 text-gray-700 leading-relaxed text-sm md:text-base">{f.text}</p>
                </div>
            ))}
        </div>
    </main>
);

const AboutPage = () => (
    <main className="max-w-[1000px] mx-auto pt-32 md:pt-48 px-4 md:px-6 text-left mb-20 md:mb-32">
        <RoaLogoSvg />
        <h1 className="mt-8 md:mt-10 text-5xl md:text-6xl font-extrabold text-gray-950 leading-tight">IEDC <span className="text-gray-400">about</span></h1>
        <div className="mt-8 md:mt-12 space-y-5 md:space-y-6 text-lg md:text-xl text-gray-800 leading-relaxed max-w-[800px]">
            <p>The Innovation and Entrepreneurship Development Centre (IEDC) of MTM Arts, Science and Commerce College, Veliyancode, is a dynamic initiative dedicated to nurturing a culture of innovation within the institution.</p>
            <p>The IEDC encourages technology-driven startup initiatives among students by providing essential guidance, resources, and mentorship. Through workshops, webinars, EnTalks, and various competitions, the centre helps students refine their ideas and develop them into successful entrepreneurial ventures.</p>
        </div>
        <div className="hidden md:block">
            <SignatureSvg />
            <p className="mt-8 md:mt-10 text-xs md:text-sm text-gray-500">© 2024–2026<br />All Rights Reserved</p>
        </div>
    </main>
);

const EventsPage = ({ events }) => {
    const [expandedId, setExpandedId] = useState(null);
    return (
        <main className="max-w-[1200px] mx-auto pt-32 md:pt-48 px-4 md:px-6 text-center md:text-left mb-20 md:mb-32">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-950">Events</h1>
            <p className="mt-4 text-lg md:text-2xl text-gray-600">Experience EDC's dynamic happenings.</p>
            <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left items-start">
                {events.map(event => (
                    <div key={event.id} onClick={() => setExpandedId(expandedId === event.id ? null : event.id)} className="overflow-hidden bg-white/80 rounded-3xl border border-white/20 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl cursor-pointer group">
                        <div className="h-56 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                            {event.imageUrl ? (
                                <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                                <RoaLogoSvg />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                <span className="text-white font-bold flex items-center justify-between w-full">View Details <ChevronDown className={`transition-transform duration-300 ${expandedId === event.id ? 'rotate-180' : ''}`} /></span>
                            </div>
                        </div>
                        <div className="p-8">
                            <h3 className="text-2xl font-semibold text-gray-950">{event.title}</h3>
                            <p className="mt-2 text-sm text-orange-500 font-bold tracking-wide">{event.date}</p>
                            <div className={`grid transition-all duration-300 ease-in-out ${expandedId === event.id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                <div className="overflow-hidden">
                                    <p className="text-gray-700 leading-relaxed text-base pt-4 border-t border-gray-100">{event.desc}</p>
                                    {event.galleryUrls && event.galleryUrls.length > 0 && (
                                        <div className="mt-6 pt-6 border-t border-gray-50 flex overflow-x-auto gap-3 pb-2 snap-x">
                                            {event.galleryUrls.map((gUrl, idx) => (
                                                <img key={idx} src={gUrl} alt="Event gallery" className="w-32 h-32 object-cover rounded-2xl flex-shrink-0 snap-center shadow-md border border-gray-100" />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

const MembersPage = ({ members }) => {
    return (
        <main className="max-w-[1200px] mx-auto pt-32 md:pt-48 px-4 md:px-6 text-center mb-20 md:mb-32">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-950 mb-16 md:mb-20 text-center">Our Members</h1>
            
            <div className="flex flex-col gap-16 md:gap-24 items-center">
                {baseRoles.map((role) => {
                    const roleMembers = members.filter(m => m.role === role);
                    if (roleMembers.length === 0) return null;
                    
                    let sizeClass = "w-24 h-24 text-4xl";
                    let nameClass = "text-lg";
                    let borderClass = "border border-gray-200";
                    
                    if (role === "Nodal Officers") {
                        sizeClass = "w-56 h-56 text-7xl";
                        borderClass = "border-[6px] border-orange-400";
                        nameClass = "text-2xl";
                    } else if (role === "Executive Committee") {
                        sizeClass = "w-40 h-40 text-6xl";
                        borderClass = "border-4 border-orange-300";
                        nameClass = "text-xl";
                    } else if (role === "Core Team") {
                        sizeClass = "w-32 h-32 text-5xl";
                        borderClass = "border-2 border-orange-200";
                        nameClass = "text-lg";
                    }

                    return (
                        <div key={role} className="w-full flex flex-wrap justify-center gap-12 sm:gap-16">
                            {roleMembers.map(member => (
                                <div key={member.id} className="flex flex-col items-center text-center group max-w-[200px]">
                                    <div className={`${sizeClass} ${borderClass} rounded-full flex items-center justify-center overflow-hidden shadow-xl mb-6 transition-transform group-hover:scale-105 group-hover:shadow-orange-200 bg-white`}>
                                        {member.photoUrl ? (
                                            <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-gray-300 transition-colors bg-gray-50 flex h-full w-full justify-center items-center">
                                                {member.img || '👤'}
                                            </div>
                                        )}
                                    </div>
                                    <h4 className={`${nameClass} font-bold text-gray-950 leading-tight`}>{member.name}</h4>
                                    <p className="text-sm text-orange-600 font-semibold mt-1">{member.role}</p>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">{member.position}</p>
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

const AdminPage = ({ members, setMembers, events, setEvents, isAdmin, setIsAdmin, setCurrentPage }) => {
    const [activeTab, setActiveTab] = useState('members');
    const [editingMember, setEditingMember] = useState(null);
    const [editingEvent, setEditingEvent] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadingGallery, setUploadingGallery] = useState(false);

    const handleGalleryUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length || !storage) return;
        setUploadingGallery(true);
        const uploadPromises = files.map(async (file) => {
            try {
                const fileRef = ref(storage, `events/gallery/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`);
                await uploadBytes(fileRef, file);
                return await getDownloadURL(fileRef);
            } catch (error) {
                console.error("Gallery upload failed:", error);
                return null;
            }
        });
        const urls = (await Promise.all(uploadPromises)).filter(url => url !== null);
        if (urls.length > 0) {
            setEditingEvent(prev => ({ ...prev, galleryUrls: [...(prev.galleryUrls || []), ...urls] }));
        }
        setUploadingGallery(false);
        e.target.value = null;
    };

    const handleFileUpload = async (file, folder, fieldName) => {
        if (!file || !storage) {
            alert("Storage service is unavailable.");
            return null;
        }
        setUploading(true);
        try {
            const fileRef = ref(storage, `${folder}/${Date.now()}_${file.name}`);
            await uploadBytes(fileRef, file);
            const url = await getDownloadURL(fileRef);
            return url;
        } catch (error) {
            console.error("Upload failed:", error);
            alert("File upload failed. Check your Firebase Storage rules.");
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleSaveMember = async (member) => {
        if (!db) {
            alert("Firestore is currently unavailable. Changes will not be saved.");
            return;
        }
        try {
            const docData = { ...member };
            delete docData.id;

            if (member.id && typeof member.id === 'string') {
                await updateDoc(doc(db, "members", member.id), docData);
            } else {
                await addDoc(collection(db, "members"), docData);
            }
            setEditingMember(null);
        } catch (error) {
            console.error("Database save failed:", error);
            alert("Failed to save to Database! Your Firestore rules might still be locked.");
        }
    };

    const handleSaveEvent = async (event) => {
        if (!db) {
            alert("Firestore is currently unavailable. Changes will not be saved.");
            return;
        }
        try {
            const docData = { ...event };
            delete docData.id;

            if (event.id && typeof event.id === 'string') {
                await updateDoc(doc(db, "events", event.id), docData);
            } else {
                await addDoc(collection(db, "events"), docData);
            }
            setEditingEvent(null);
        } catch (error) {
            console.error("Database save failed:", error);
            alert("Failed to save to Database! Your Firestore rules might still be locked.");
        }
    };

    const handleBulkUpload = async (e, collectionName) => {
        const files = Array.from(e.target.files);
        if (!files.length || !storage || !db) return;
        
        setUploading(true);
        const uploadPromises = files.map(async (file) => {
            try {
                const fileRef = ref(storage, `${collectionName}/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`);
                await uploadBytes(fileRef, file);
                const url = await getDownloadURL(fileRef);
                
                if (url) {
                    if (collectionName === "members") {
                        await addDoc(collection(db, "members"), { name: 'Bulk Add Member', role: baseRoles[3], position: '', photoUrl: url, img: null });
                    } else if (collectionName === "events") {
                        await addDoc(collection(db, "events"), { title: 'Bulk Event', date: '', desc: '', imageUrl: url, galleryUrls: [] });
                    }
                }
            } catch (error) {
                console.error("Bulk item upload failed:", error);
            }
        });
        
        await Promise.all(uploadPromises);
        setUploading(false);
        e.target.value = null;
    };

    const handleDelete = async (id, collectionName) => {
        deletedMockIds.add(id);
        
        let itemToDelete = null;
        if (collectionName === "members") {
            itemToDelete = members.find(m => m.id === id);
            setMembers(prev => prev.filter(m => m.id !== id));
        } else if (collectionName === "events") {
            itemToDelete = events.find(e => e.id === id);
            setEvents(prev => prev.filter(e => e.id !== id));
        }

        if (!db) return;
        try {
            await deleteDoc(doc(db, collectionName, id));
            
            const fileUrl = itemToDelete?.photoUrl || itemToDelete?.imageUrl;
            if (fileUrl && storage && fileUrl.includes('firebasestorage.googleapis.com')) {
                const fileRef = ref(storage, fileUrl);
                await deleteObject(fileRef).catch(e => console.log('Storage deletion silent fail:', e));
            }
            if (itemToDelete?.galleryUrls && itemToDelete.galleryUrls.length > 0 && storage) {
                for (const url of itemToDelete.galleryUrls) {
                    if (url.includes('firebasestorage.googleapis.com')) {
                        await deleteObject(ref(storage, url)).catch(e => console.log('Gallery cleanup fail:', e));
                    }
                }
            }
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleExit = () => {
        setIsAdmin(false);
        setCurrentPage('home');
    };

    if (!isAdmin) return <HomePage setCurrentPage={setCurrentPage} />;

    return (
        <main className="max-w-[1400px] mx-auto pt-48 px-6 text-left mb-32">
            {/* Header/Nav inside Admin */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6 bg-white/80 p-6 md:p-8 rounded-3xl border border-white/20 shadow-xl backdrop-blur-sm">
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 flex items-center gap-4"><Lock className="text-orange-500" /> <span className="hidden sm:inline">Admin</span> Dashboard</h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-500 font-medium">Manage members and events securely.</p>
                </div>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <button onClick={() => setActiveTab('members')} className={`px-4 sm:px-6 py-3 rounded-xl sm:rounded-full font-bold transition text-sm sm:text-base ${activeTab === 'members' ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Members</button>
                    <button onClick={() => setActiveTab('events')} className={`px-4 sm:px-6 py-3 rounded-xl sm:rounded-full font-bold transition text-sm sm:text-base ${activeTab === 'events' ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Events</button>
                    <button onClick={handleExit} className="col-span-2 sm:col-span-1 px-4 sm:px-6 py-3 rounded-xl sm:rounded-full font-bold bg-red-50 text-red-600 hover:bg-red-100 transition text-sm sm:text-base sm:ml-4 text-center">Exit Panel</button>
                </div>
            </div>

            {activeTab === 'members' ? (
                <section className="bg-white/80 rounded-3xl p-6 sm:p-10 shadow-xl border border-white/20 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 w-full">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Member Directory</h2>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            <label className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl sm:rounded-full text-black bg-gray-100 hover:bg-gray-200 font-bold transition cursor-pointer text-sm sm:text-base w-full sm:w-auto">
                                <Upload size={16} /> {uploading ? "Uploading..." : "Bulk Add"}
                                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleBulkUpload(e, "members")} disabled={uploading} />
                            </label>
                            <button onClick={() => setEditingMember({ name: '', role: baseRoles[3], position: '', photoUrl: '' })} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl sm:rounded-full text-white bg-black hover:bg-gray-800 font-bold transition text-sm sm:text-base w-full sm:w-auto"> <Plus size={16} /> Single Form </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {members.map((member) => (
                            <div key={member.id} className="flex items-center gap-6 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition group">
                                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                                    {member.photoUrl ? <img src={member.photoUrl} className="w-full h-full object-cover" /> : <div className="text-3xl">{member.img || '👤'}</div>}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-gray-950">{member.name}</h4>
                                    <p className="text-sm font-medium text-gray-500">{member.position} <span className="mx-2 opacity-30">|</span> <span className="text-orange-600 font-bold">{member.role}</span></p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingMember(member)} className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-200 transition"> <Edit2 size={18} /> </button>
                                    <button onClick={() => handleDelete(member.id, "members")} className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"> <Trash2 size={18} /> </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ) : (
                <section className="bg-white/80 rounded-3xl p-6 sm:p-10 shadow-xl border border-white/20 backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 w-full">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Events Management</h2>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                            <label className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl sm:rounded-full text-black bg-gray-100 hover:bg-gray-200 font-bold transition cursor-pointer text-sm sm:text-base w-full sm:w-auto">
                                <Upload size={16} /> {uploading ? "Uploading..." : "Bulk Add"}
                                <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleBulkUpload(e, "events")} disabled={uploading} />
                            </label>
                            <button onClick={() => setEditingEvent({ title: '', date: '', desc: '', imageUrl: '', galleryUrls: [] })} className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 rounded-xl sm:rounded-full text-white bg-black hover:bg-gray-800 font-bold transition text-sm sm:text-base w-full sm:w-auto"> <Plus size={16} /> New Event </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {events.map((event) => (
                            <div key={event.id} className="flex items-center gap-6 p-5 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition group">
                                <div className="w-24 h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100">
                                    {event.imageUrl ? <img src={event.imageUrl} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-xl font-bold text-gray-950">{event.title}</h4>
                                    <p className="text-sm font-medium text-gray-500">{event.date}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setEditingEvent(event)} className="p-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-200 transition"> <Edit2 size={18} /> </button>
                                    <button onClick={() => handleDelete(event.id, "events")} className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"> <Trash2 size={18} /> </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Member Modal */}
            {editingMember && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" onClick={() => setEditingMember(null)}>
                    <div className="bg-white rounded-3xl p-6 sm:p-10 w-full max-w-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8">{editingMember.id ? 'Edit Member Profile' : 'Upload New Member'}</h3>
                        <div className="space-y-4 sm:space-y-6">
                            <label className="block">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Member Name</span>
                                <input type="text" value={editingMember.name} onChange={e => setEditingMember({ ...editingMember, name: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-medium" />
                            </label>
                            <div className="grid grid-cols-2 gap-6">
                                <label className="block">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Hierarchy Role</span>
                                    <select value={editingMember.role} onChange={e => setEditingMember({ ...editingMember, role: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-medium"> {baseRoles.map(r => <option key={r} value={r}>{r}</option>)} </select>
                                </label>
                                <label className="block">
                                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Designation</span>
                                    <input type="text" value={editingMember.position} onChange={e => setEditingMember({ ...editingMember, position: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-medium" />
                                </label>
                            </div>
                            <label className="block">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Profile Photo</span>
                                <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-2xl">
                                    <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center overflow-hidden relative group">
                                        {uploading ? <Loader2 className="animate-spin text-orange-500" /> : editingMember.photoUrl ? <img src={editingMember.photoUrl} className="w-full h-full object-cover" /> : <div className="text-4xl">{editingMember.img || '👤'}</div>}
                                    </div>
                                    <label className="flex-1 cursor-pointer">
                                        <div className="flex items-center gap-2 justify-center py-4 bg-white border border-dashed border-gray-200 rounded-xl hover:border-black transition text-sm font-bold text-gray-500">
                                            <Upload size={16} /> {uploading ? "Uploading..." : "Click to select photo"}
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" disabled={uploading || !storage} onChange={async (e) => {
                                            const url = await handleFileUpload(e.target.files[0], 'members');
                                            if (url) setEditingMember({ ...editingMember, photoUrl: url, img: null });
                                        }} />
                                    </label>
                                </div>
                            </label>
                        </div>
                        <div className="flex gap-4 mt-10">
                            <button onClick={() => setEditingMember(null)} className="flex-1 p-5 rounded-2xl font-bold bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                            <button onClick={() => handleSaveMember(editingMember)} disabled={uploading} className="flex-1 p-5 rounded-2xl font-bold text-white bg-black hover:bg-gray-800 transition disabled:opacity-50">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Modal */}
            {editingEvent && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6" onClick={() => setEditingEvent(null)}>
                    <div className="bg-white rounded-3xl p-6 sm:p-10 w-full max-w-xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <h3 className="text-2xl sm:text-3xl font-black mb-6 sm:mb-8">{editingEvent.id ? 'Edit Event Details' : 'Design New Event'}</h3>
                        <div className="space-y-4 sm:space-y-6">
                            <label className="block">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Event Title</span>
                                <input type="text" value={editingEvent.title} onChange={e => setEditingEvent({ ...editingEvent, title: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-medium" />
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Date / Time</span>
                                <input type="text" value={editingEvent.date} onChange={e => setEditingEvent({ ...editingEvent, date: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-medium" placeholder="May 16, 2024" />
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Description</span>
                                <textarea value={editingEvent.desc} onChange={e => setEditingEvent({ ...editingEvent, desc: e.target.value })} className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-black font-medium min-h-[120px]" />
                            </label>
                            <label className="block">
                                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest block mb-2">Cover Image</span>
                                <div className="flex flex-col gap-4">
                                    <div className="w-full h-48 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-dashed border-gray-200 group relative">
                                        {uploading ? <Loader2 className="animate-spin text-orange-500" /> : editingEvent.imageUrl ? <img src={editingEvent.imageUrl} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center gap-2 text-gray-300"> <ImageIcon size={48} /> <span className="text-xs font-bold uppercase tracking-wider">No Image Selected</span></div>}
                                    </div>
                                    <label className="cursor-pointer">
                                        <div className="flex items-center gap-2 justify-center py-4 bg-black text-white rounded-2xl hover:bg-gray-800 transition text-sm font-bold">
                                            <Upload size={16} /> {uploading ? "Uploading..." : "Click to select event banner"}
                                        </div>
                                        <input type="file" className="hidden" accept="image/*" disabled={uploading || !storage} onChange={async (e) => {
                                            const url = await handleFileUpload(e.target.files[0], 'events');
                                            if (url) setEditingEvent({ ...editingEvent, imageUrl: url });
                                        }} />
                                    </label>
                                </div>
                            </label>
                        </div>
                        <div className="flex gap-4 mt-10">
                            <button onClick={() => setEditingEvent(null)} className="flex-1 p-5 rounded-2xl font-bold bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                            <button onClick={() => handleSaveEvent(editingEvent)} disabled={uploading} className="flex-1 p-5 rounded-2xl font-bold text-white bg-black hover:bg-gray-800 transition disabled:opacity-50">Publish Event</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

// --- APP COMPONENT ---
export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [members, setMembers] = useState(initialMembers);
    const [events, setEvents] = useState(mockEvents);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Defensive check: If Firestore is null, bypass sync and keep initial state
        if (!db) {
            console.warn("Firestore service is offline. Rendering with mock data only.");
            setLoading(false);
            return;
        }

        try {
            // Members listener with Mock Merge Fix
            const qMembers = query(collection(db, "members"));
            const unsubMembers = onSnapshot(qMembers, (snap) => {
                const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                const firestoreNames = data.map(m => m.name);
                const remainingMocks = initialMembers.filter(m => !firestoreNames.includes(m.name) && !deletedMockIds.has(m.id));
                setMembers([...data, ...remainingMocks]);
            }, (error) => {
                console.error("Firestore snapshot error (Members):", error);
            });

            // Events listener with Mock Merge Fix
            const qEvents = query(collection(db, "events"));
            const unsubEvents = onSnapshot(qEvents, (snap) => {
                const data = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                const firestoreTitles = data.map(e => e.title);
                const remainingMocks = mockEvents.filter(e => !firestoreTitles.includes(e.title) && !deletedMockIds.has(e.id));
                setEvents([...data, ...remainingMocks]);
                setLoading(false);
            }, (error) => {
                console.error("Firestore snapshot error (Events):", error);
                setLoading(false);
            });

            return () => { unsubMembers(); unsubEvents(); };
        } catch (error) {
            console.error("Critical error setting up Firestore listeners:", error);
            setLoading(false);
        }
    }, []);

    const renderPage = () => {
        if (currentPage === 'admin') {
            return <AdminPage members={members} setMembers={setMembers} events={events} setEvents={setEvents} isAdmin={isAdmin} setIsAdmin={setIsAdmin} setCurrentPage={setCurrentPage} />;
        }

        return (
            <div className="w-full">
                <div id="home" className={`block ${currentPage === 'home' ? 'md:block' : 'md:hidden'}`}>
                    <HomePage setCurrentPage={setCurrentPage} />
                </div>
                <div id="members" className={`block ${currentPage === 'members' ? 'md:block' : 'md:hidden'} -mt-16 md:mt-0`}>
                    <MembersPage members={members} />
                </div>
                <div id="events" className={`block ${currentPage === 'events' ? 'md:block' : 'md:hidden'} -mt-16 md:mt-0`}>
                    <EventsPage events={events} />
                </div>
                <div id="about" className={`block ${currentPage === 'about' ? 'md:block' : 'md:hidden'} -mt-16 md:mt-0`}>
                    <AboutPage />
                </div>
            </div>
        );
    };

    const handleAdminAuth = () => {
        setIsAdmin(true);
        setShowLogin(false);
        setCurrentPage('admin');
    };

    return (
        <div className="min-h-screen font-sans bg-white text-gray-900 scroll-smooth selection:bg-orange-100">
            <Header setCurrentPage={setCurrentPage} isAdmin={isAdmin} />
            {renderPage()}
            <Footer setCurrentPage={setCurrentPage} setShowLogin={setShowLogin} isAdmin={isAdmin} />
            {showLogin && <AdminLogin onClose={() => setShowLogin(false)} onLogin={handleAdminAuth} />}
        </div>
    );
}
