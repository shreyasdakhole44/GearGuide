import React, { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import {
    PerspectiveCamera,
    Environment
} from '@react-three/drei';
import {
    Send,
    Bot,
    Zap,
    ShieldCheck,
    ArrowRight,
    Gauge,
    Thermometer,
    Waves,
    AlertTriangle,
    Upload,
    ChevronRight,
    MessageSquare,
    Terminal,
    BrainCircuit,
    Layers,
    Target,
    LogOut,
    ExternalLink,
    Settings,
    Activity,
    Cpu
} from 'lucide-react';
import DigitalNetwork from '../components/DigitalNetwork';
import aiCoreImg from '../assets/ai-core.png';

const AssistantPage = () => {
    const navigate = useNavigate();
    // --- STATE ---
    const [csvData, setCsvData] = useState(null);
    const [machineData, setMachineData] = useState({
        name: 'GigaPlant_Core_A1',
        temp: 72.4,
        vibration: 0.58,
        pressure: 29.5
    });
    const [alerts, setAlerts] = useState([]);
    const [messages, setMessages] = useState([
        { role: 'bot', content: "Gateway Secure. Neural link established. I am your Superior AI Assistant. How shall we optimize the plant floor today?" }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [healthScore, setHealthScore] = useState(99);
    const [systemStatus, setSystemStatus] = useState('stable'); 

    // --- LOGOUT HANDLER ---
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    // --- LIVE DATA SIMULATION ---
    useEffect(() => {
        const interval = setInterval(() => {
            setMachineData(prev => {
                const newTemp = prev.temp + (Math.random() - 0.5) * 2;
                const newVib = prev.vibration + (Math.random() - 0.5) * 0.05;
                return {
                    ...prev,
                    temp: Math.max(20, Math.min(120, parseFloat(newTemp.toFixed(1)))),
                    vibration: Math.max(0.1, Math.min(3, parseFloat(newVib.toFixed(2))))
                };
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // --- ALERT LOGIC ---
    useEffect(() => {
        const newAlerts = [];
        let status = 'stable';
        let health = 99;

        if (machineData.temp > 100) {
            newAlerts.push({ id: 'temp', type: 'critical', title: 'Thermal Breach', desc: `Temp exceeds safe operating threshold.` });
            status = 'critical';
            health -= 40;
        } else if (machineData.temp > 85) {
            newAlerts.push({ id: 'temp-w', type: 'warning', title: 'Thermal Drift', desc: `Heat dissipation efficiency dropping.` });
            if (status !== 'critical') status = 'warning';
            health -= 12;
        }

        if (machineData.vibration > 1.2) {
            newAlerts.push({ id: 'vib', type: 'critical', title: 'Mechanical Stress', desc: `Harmonic vibration detected in core axis.` });
            status = 'critical';
            health -= 35;
        }

        setAlerts(newAlerts);
        setSystemStatus(status);
        setHealthScore(Math.max(1, health));
    }, [machineData.temp, machineData.vibration]);

    const handleSend = () => {
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { role: 'user', content: chatInput }]);
        setChatInput('');
        setIsTyping(true);

        setTimeout(() => {
            let res = "Processing request through neural grid... ";
            if (systemStatus === 'critical') res += "CRITICAL ERROR: Please stabilize core temperature before initiating diagnostic scans.";
            else res += "All subsystems are operational. Current uptime projection is 100% for the next 48-hour cycle.";
            setMessages(prev => [...prev, { role: 'bot', content: res }]);
            setIsTyping(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col overflow-hidden text-gray-900 font-inter">
            
            {/* --- IMMERSIVE NAV BAR --- */}
            <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 z-50 shadow-sm">
                <div className="flex items-center gap-6">
                    <div className="bg-[#0A1118] text-white p-2.5 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="font-bold text-lg tracking-wider leading-none">GG</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-black tracking-tighter text-[#0A1118] flex items-center gap-2">
                            Superior <span className="text-blue-600">AI Agent</span>
                            <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase tracking-widest rounded border border-blue-100">Live Portal</div>
                        </h1>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mt-1">Autonomous Infrastructure Controller</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-4 px-6 py-2.5 bg-gray-50 rounded-full border border-gray-200">
                        <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${systemStatus === 'stable' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : systemStatus === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]'}`}></div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 tracking-[0.1em]">GRID_{systemStatus.toUpperCase()}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <button className="p-3 text-gray-400 hover:text-blue-600 transition-colors bg-white rounded-xl border border-gray-100 shadow-sm"><Settings size={18}/></button>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-6 py-3 bg-[#0A1118] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg active:scale-95"
                        >
                            <LogOut size={16} /> Exit System
                        </button>
                    </div>
                </div>
            </header>

            {/* --- REORDERED INTERFACE: LEFT (Chat) | CENTER (Canvas) | RIGHT (Control) --- */}
            <div className="flex-1 flex overflow-hidden p-8 gap-8 relative">
                
                {/* --- LEFT PANEL: ASSISTANT HUB (Reordered to Left) --- */}
                <motion.aside 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-[480px] bg-[#EEF2F6] border border-gray-200 shadow-2xl rounded-[3rem] flex flex-col overflow-hidden z-10"
                >
                    <header className="p-10 bg-white border-b border-gray-100 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-blue-600 rounded-[1.25rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                                <MessageSquare size={28} />
                            </div>
                            <div>
                                <h4 className="text-base font-black text-gray-900 uppercase tracking-widest">Assistant Hub</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Neural Core Synchronized</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar bg-white/40">
                        {messages.map((msg, i) => (
                            <motion.div 
                                key={i}
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[90%] ${msg.role === 'bot' ? 'items-start' : 'items-end'} flex flex-col gap-3`}>
                                    <div className={`p-6 rounded-3xl text-sm font-bold leading-relaxed ${
                                        msg.role === 'bot' 
                                        ? 'bg-white border border-gray-100 text-gray-700 shadow-xl rounded-tl-none' 
                                        : 'bg-[#0A1118] text-white shadow-2xl rounded-tr-none'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] px-4">{msg.role === 'bot' ? 'GEAR_ASSISTANT' : 'OFFICER'}</span>
                                </div>
                            </motion.div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-6 rounded-[2rem] shadow-sm flex gap-2">
                                    {[0,1,2].map(d => <div key={d} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: `${d*0.2}s`}}></div>)}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-10 bg-white border-t border-gray-100">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/10 blur-2xl group-focus-within:opacity-100 opacity-0 transition-opacity"></div>
                            <div className="relative bg-gray-50 border-2 border-gray-100 rounded-[2.5rem] p-3 pl-8 flex items-center transition-all group-focus-within:border-blue-400 group-focus-within:bg-white group-focus-within:shadow-[0_20px_60px_rgba(59,130,246,0.1)]">
                                <input 
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Consult Neural Subsystem..."
                                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-black text-gray-700 placeholder:text-gray-400 py-3"
                                />
                                <button onClick={handleSend} className="w-14 h-14 bg-[#0A1118] text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all active:scale-90 shadow-lg">
                                    <Send size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* --- CENTER SECTION: 3D DIGITAL NETWORK + OVERLAY --- */}
                <main className="flex-1 bg-[#020617] rounded-[4rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    <div className="absolute inset-0 z-0">
                        <Canvas>
                            <Suspense fallback={null}>
                                <PerspectiveCamera makeDefault position={[0, 0, 12]} />
                                <DigitalNetwork />
                                <Environment preset="night" />
                                <ambientLight intensity={0.1} />
                            </Suspense>
                        </Canvas>
                    </div>

                    {/* TEXT OVERLAY (Bold, Modern Tech Style) */}
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-10 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="bg-black/20 backdrop-blur-sm p-12 rounded-[4rem] border border-white/5 pointer-events-auto"
                        >
                            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                                QUANTUM <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">CORE</span>
                            </h2>
                            <p className="text-lg md:text-xl text-blue-200/60 font-black uppercase tracking-[0.5em] mb-12">Neural Network Active</p>
                            
                            <button className="px-12 py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.3em] hover:bg-blue-500 hover:text-white transition-all shadow-2xl flex items-center gap-4 mx-auto group">
                                Initialize Deep Scan <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                    {/* HUD OVERLAY */}
                    <div className="absolute top-12 left-12 z-20 flex flex-col gap-6">
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 px-8 py-5 rounded-[2rem] shadow-2xl">
                             <div className="flex items-center gap-4 mb-3">
                                <div className="p-2 bg-blue-500 rounded-lg text-white"><Target size={16}/></div>
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Grid Status</p>
                             </div>
                             <p className="text-xl font-black text-white tracking-tight">V8-Plexus Enabled</p>
                        </div>
                    </div>

                    {/* HUD BOTTOM */}
                    <div className="absolute bottom-12 left-12 right-12 z-20 flex items-center justify-between">
                         <div className="bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 text-[10px] font-black text-white/50 flex items-center gap-3">
                             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_#3b82f6]"></div>
                             GEAR_PILOT_V4.8
                        </div>
                    </div>
                </main>

                {/* --- RIGHT PANEL: NEURAL PIPELINE (Reordered to Right) --- */}
                <motion.aside 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="w-[450px] bg-white border border-gray-100 shadow-[0_15px_50px_rgba(0,0,0,0.04)] rounded-[3rem] flex flex-col overflow-hidden z-10"
                >
                    <div className="p-10 border-b border-gray-50 bg-gray-50/30">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-3 mb-6">
                            <Layers size={14} className="text-blue-500" /> Neural Pipeline
                        </h3>
                        
                        <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 shadow-inner group">
                            <img src={aiCoreImg} alt="AI Core" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                            <div className="absolute bottom-4 left-6">
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Hardware ID</p>
                                <p className="text-xs font-black text-white">X-CORE_772</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-10 custom-scrollbar space-y-12">
                        <label className="block group cursor-pointer">
                            <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] p-10 bg-gray-50/20 group-hover:bg-blue-50/20 group-hover:border-blue-100 transition-all flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 bg-white rounded-3xl shadow-md border border-gray-50 flex items-center justify-center text-gray-300 group-hover:text-blue-500 mb-5 transition-all group-hover:rotate-12">
                                    <Upload size={30} />
                                </div>
                                <p className="text-sm font-black text-gray-800 uppercase tracking-widest">Load Machine Data</p>
                                <input type="file" className="hidden" onChange={(e) => setCsvData(e.target.files[0]?.name)} />
                            </div>
                        </label>

                        <div className="space-y-6">
                            <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest pl-2 border-l-4 border-blue-500">Live Telemetry</h4>
                            <div className="grid gap-4">
                                {[
                                    { label: 'Thermal', value: machineData.temp, unit: '°C', icon: <Thermometer size={18}/>, color: machineData.temp > 100 ? 'text-rose-500' : 'text-blue-500' },
                                    { label: 'Oscillation', value: machineData.vibration, unit: 'MM/S', icon: <Waves size={18}/>, color: machineData.vibration > 1.2 ? 'text-rose-500' : 'text-emerald-500' },
                                    { label: 'Pressure', value: machineData.pressure, unit: 'BAR', icon: <Gauge size={18}/>, color: 'text-amber-500' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white border border-gray-100 p-6 rounded-[2rem] flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>{stat.icon}</div>
                                            <span className="text-[12px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                        </div>
                                        <div className="text-xl font-black tracking-tighter text-gray-900">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.aside>

            </div>

            {/* --- AI INTELLIGENCE SUMMARY FOOTER --- */}
            <footer className="h-72 bg-white border-t border-gray-100 p-12 relative overflow-hidden flex-shrink-0">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-700"></div>
                <div className="max-w-[1800px] mx-auto flex gap-20 items-stretch h-full">
                    <div className="w-1/4 flex flex-col justify-between">
                        <div>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2 flex items-center gap-3"><Zap size={10} className="text-blue-500"/> System Identification</p>
                             <h5 className="text-4xl font-black text-[#0A1118] tracking-tighter uppercase">{machineData.name.split('_')[0]}<span className="text-blue-600">_{machineData.name.split('_')[1]}</span></h5>
                        </div>
                        <div className="flex gap-4">
                             <div className="flex-1 bg-blue-50 border border-blue-100 p-4 rounded-2xl">
                                 <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-1">Health Index</p>
                                 <p className="text-xl font-black text-blue-700">{healthScore}%</p>
                             </div>
                             <div className="flex-1 bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Load Status</p>
                                 <p className="text-xl font-black text-gray-700">OPTIMAL</p>
                             </div>
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-2 gap-16">
                         <div className="flex flex-col justify-center gap-6">
                             <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-3">
                                    <BrainCircuit size={12} className="text-blue-500"/> Predictive Vector
                                </p>
                                <p className="text-lg font-black text-gray-800 leading-tight">
                                    "Neural cluster A-19 confirms stable oscillation patterns within the 99.9th percentile. No catastrophic drifts projected."
                                </p>
                             </div>
                         </div>

                         <div className="flex flex-col justify-center">
                             <div className="bg-gray-50 border border-gray-100 p-8 rounded-[3rem] flex items-center gap-10 group hover:border-blue-200 transition-all h-full">
                                <div className="w-20 h-20 bg-[#0A1118] text-white rounded-[2rem] flex items-center justify-center group-hover:bg-blue-600 transition-colors shadow-xl text-white">
                                    <ShieldCheck size={32} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Recommended Protocol</p>
                                    <h6 className="text-lg font-black text-gray-900 uppercase tracking-tight">Maintain Baseline Cycle</h6>
                                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Awaiting Command...</p>
                                </div>
                                <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" size={24} />
                             </div>
                         </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AssistantPage;
