import React, { useState, useEffect, useRef } from 'react';
import { Hammer, Wand2, Layers, Cpu, Database, Hexagon, Zap, Sparkles, Terminal, Image as ImageIcon, Sliders, Share2 } from 'lucide-react';

const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2694&auto=format&fit=crop"
];
const LORE_SAMPLES = [
  "Forged in the heart of a dying neon star, this artifact bends the digital fabric of the metaverse.",
  "An ancient cyberpunk relic, whispering secrets of a forgotten algorithm through its crystal matrix."
];

export default function ArtisanForgeStudio() {
  const [prompt, setPrompt] = useState('Cyberpunk samurai forging a glowing crystal sword');
  const [style, setStyle] = useState('Hyper-Realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [agentLogs, setAgentLogs] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [activeLore, setActiveLore] = useState("");
  const logsEndRef = useRef(null);

  useEffect(() => { logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [agentLogs]);
  const addLog = (agent, message, type = 'info') => setAgentLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), agent, message, type }]);

  const handleForge = () => {
    if (!prompt) return;
    setIsGenerating(true); setProgress(0); setAgentLogs([]); setActiveImage(null); setActiveLore("");
    addLog('System', 'Initiating Decentralized Genesis Pipeline...', 'system');
    setTimeout(() => { setProgress(15); addLog('Conceptualizer', `Analyzing prompt vectors. Expanding context with "${style}".`, 'agent'); }, 1000);
    setTimeout(() => { setProgress(35); addLog('Artisan', 'Connecting to C++ CUDA Tensor Engine. VRAM Cache primed.', 'system'); }, 2500);
    setTimeout(() => { setProgress(60); addLog('Artisan', 'Diffusion loop complete. Routing to Rust WASM engine.', 'agent'); }, 4500);
    setTimeout(() => { setProgress(80); addLog('Critic', 'Evaluating constraints: Silhouette matches 94%.', 'success'); addLog('Appraiser', 'Generating Rarity Lore...', 'agent'); }, 6000);
    setTimeout(() => {
      setProgress(100); addLog('Appraiser', 'Rarity metadata finalized.', 'success'); addLog('System', 'Artifact forged successfully.', 'system');
      setActiveImage(MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)]);
      setActiveLore(LORE_SAMPLES[Math.floor(Math.random() * LORE_SAMPLES.length)]);
      setIsGenerating(false);
    }, 8000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col overflow-hidden">
      <nav className="h-16 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between px-6 z-20 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Hammer className="w-5 h-5 text-amber-500 transform -rotate-45" />
          </div>
          <div><h1 className="text-xl font-bold text-white">Artisan<span className="text-amber-500">Forge</span></h1><p className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase">Decentralized Studio</p></div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-4 font-mono text-xs text-slate-400">
            <span className="flex items-center"><Cpu className="w-3 h-3 mr-1 text-emerald-400" /> GPU: Optimal</span>
            <span className="flex items-center"><Database className="w-3 h-3 mr-1 text-cyan-400" /> Nodes: 142</span>
          </div>
          <button className="px-5 py-2 rounded-md text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(245,158,11,0.2)]">Connect Wallet</button>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-80 border-r border-slate-800 bg-slate-950/50 flex flex-col shrink-0 p-5 space-y-6 overflow-y-auto">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center"><Wand2 className="w-4 h-4 mr-2 text-amber-500" /> Core Concept</h2>
            <textarea className="w-full h-32 bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Describe your vision..." />
          </div>
          <button onClick={handleForge} disabled={isGenerating} className={`w-full py-4 rounded-lg font-bold flex items-center justify-center space-x-2 ${isGenerating ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]'}`}>
            {isGenerating ? <span>Forging Matrix... {progress}%</span> : <><Zap className="w-5 h-5" /><span>Initialize Forge</span></>}
          </button>
        </aside>

        <div className="flex-1 bg-[#0a0f1c] relative flex flex-col p-8 items-center justify-center">
          {isGenerating ? (
             <div className="relative w-64 h-64 flex items-center justify-center">
               <div className="absolute inset-0 border-2 border-slate-800 rounded-2xl" />
               <div className="absolute inset-0 border-2 border-amber-500 rounded-2xl animate-pulse" style={{ clipPath: `polygon(0 0, 100% 0, 100% ${progress}%, 0 ${progress}%)` }} />
               <Hexagon className="w-16 h-16 text-slate-800 animate-spin absolute" style={{ animationDuration: '4s' }} />
               <span className="text-amber-500 font-mono text-xl z-10">{progress}%</span>
             </div>
          ) : activeImage ? (
            <div className="relative group max-h-full max-w-full">
              <img src={activeImage} alt="Forged Artifact" className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl border border-slate-800" />
              <div className="absolute -bottom-6 -right-6 bg-slate-900 border border-amber-500/50 p-4 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity max-w-xs">
                <div className="flex items-center text-amber-500 mb-2"><Sparkles className="w-4 h-4 mr-2" /><span className="text-xs font-bold uppercase">Appraiser Lore</span></div>
                <p className="text-xs text-slate-300 italic">"{activeLore}"</p>
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-600 flex flex-col items-center"><Layers className="w-16 h-16 mb-4 opacity-50" /><p className="font-mono text-sm">Canvas Empty.</p></div>
          )}
        </div>

        <aside className="w-80 border-l border-slate-800 bg-slate-950/80 flex flex-col shrink-0 z-10">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center"><Terminal className="w-4 h-4 mr-2 text-cyan-400" /> Agent Telemetry</h2>
          </div>
          <div className="flex-1 p-4 overflow-y-auto font-mono text-xs space-y-3">
            {agentLogs.length === 0 ? <div className="text-slate-600 text-center mt-10">Guild agents standing by...</div> : agentLogs.map((log, index) => (
              <div key={index}><span className="text-slate-500">[{log.time}] </span><span className="font-bold text-amber-400">{log.agent}: </span><span className="text-slate-300">{log.message}</span></div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </aside>
      </main>
    </div>
  );
}
