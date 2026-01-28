"use client";

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  History as HistoryIcon,
  Library,
  Flame,
  PlusCircle,
  Search,
  ChevronRight,
  TrendingUp,
  X,
  Zap,
  Watch,
  Bluetooth,
  Activity,
  User,
  Camera,
  Utensils,
  Music,
  Settings,
  Timer as TimerIcon,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- STYLING CONSTANTS ---
const NEON_LIME = '#BBF246';
const DEEP_BLACK = '#050505';
const GLASS_BG = 'rgba(255, 255, 255, 0.03)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.08)';

// --- COMPONENTS ---

const GlassCard = ({ children, className, onClick, ...props }: { children: React.ReactNode, className?: string, onClick?: () => void, [key: string]: any }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.98 }}
    className={`rounded-3xl backdrop-blur-xl border border-[${GLASS_BORDER}] bg-[${GLASS_BG}] shadow-2xl relative overflow-hidden ${className}`}
    style={{
      background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
      borderColor: 'rgba(255,255,255,0.05)'
    }}
    onClick={onClick}
    {...props}
  >
    {children}
  </motion.div>
);

const NeonButton = ({ children, className, onClick, variant = 'primary', ...props }: any) => (
  <motion.button
    whileHover={{ scale: 1.02, boxShadow: variant === 'primary' ? `0 0 20px ${NEON_LIME}40` : 'none' }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative px-6 py-4 rounded-2xl font-black uppercase tracking-wider flex items-center justify-center gap-2 overflow-hidden transition-all ${variant === 'primary'
        ? `text-black bg-[${NEON_LIME}]`
        : 'text-white bg-white/5 border border-white/10 hover:bg-white/10'
      } ${className}`}
    style={variant === 'primary' ? { backgroundColor: NEON_LIME } : {}}
    {...props}
  >
    {children}
  </motion.button>
);

// --- SHARED DATA & TYPES ---

interface ExerciseSet { id: string; weight: number; reps: number; completed: boolean; }
interface ExerciseSession { id: string; name: string; sets: ExerciseSet[]; }
interface Workout { id: string; name: string; date: string; duration: string; totalVolume: number; exerciseCount: number; exercises: ExerciseSession[]; }
interface ProgressEntry { date: string; weight: number; }
interface ProgressPhoto { id: string; date: string; url: string; }
interface UserProfile { name: string; email: string; phone: string; height: string; weight: string; avatar: string; publicProfile: boolean; notifications: boolean; }

const EXERCISES = [
  { name: 'Plank', cat: 'Core', lvl: 'Beginner', image: 'https://images.unsplash.com/photo-1548691905-57c36cc8d93f?auto=format&fit=crop&q=80&w=600', videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw', muscles: ['Abs', 'Obliques'], benefits: 'Core stability.' },
  { name: 'Squats', cat: 'Legs', lvl: 'Beginner', image: 'https://images.unsplash.com/photo-1574680676118-05f2a1395c83?auto=format&fit=crop&q=80&w=600', videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U', muscles: ['Quads', 'Glutes'], benefits: 'Leg strength.' },
  { name: 'Push Ups', cat: 'Chest', lvl: 'Beginner', image: 'https://images.unsplash.com/photo-1571019623533-312984950ca0?auto=format&fit=crop&q=80&w=600', videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4', muscles: ['Chest', 'Triceps'], benefits: 'Upper body power.' },
];

const DIET_PLAN = [{ day: "Day 1", label: "Mon", meals: { breakfast: "Oats & Berries", lunch: "Grilled Chicken Salad", dinner: "Quinoa Bowl" } }];

// --- SECTIONS ---

const Dashboard = ({ userName, streak, timerSeconds, isTimerActive, heartRate, isWatchConnected, onConnectWatch, onStartWorkout, onOpenProgress }: any) => {
  const formatTime = (total: number) => `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-32">
      {/* Header */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            FIT<span style={{ color: NEON_LIME }}>FORGE</span>
          </h1>
          <p className="text-[#8e8e93] text-xs font-bold tracking-widest uppercase mt-1">
            Welcome back, {userName}
          </p>
        </div>
        <button onClick={onOpenProgress} className="relative group">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#BBF246] transition-all">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
          </div>
        </button>
      </header>

      {/* Hero Streak Card */}
      <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-[2.5rem] bg-[#BBF246] p-8 shadow-[0_0_40px_-10px_#BBF246]">
        <div className="relative z-10 flex justify-between items-end text-black">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-2">Current Streak</p>
            <h2 className="text-7xl font-black tracking-tighter leading-none">{streak}</h2>
            <span className="text-xl font-bold opacity-60">DAYS ACTIVE</span>
          </div>
          <Flame size={80} strokeWidth={1} className="text-black rotate-12 opacity-80" />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard onClick={onConnectWatch} className="p-6 flex flex-col justify-between h-48 cursor-pointer group">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${isWatchConnected ? 'bg-[#BBF246] text-black' : 'bg-white/5 text-[#8e8e93]'}`}>
              <Watch size={24} />
            </div>
            {isWatchConnected && <div className="w-2 h-2 bg-[#BBF246] rounded-full animate-pulse shadow-[0_0_10px_#BBF246]" />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-widest mb-1">Heart Rate</p>
            <h3 className="text-3xl font-black text-white">{isWatchConnected ? heartRate : '--'} <span className="text-sm text-[#8e8e93] font-medium">BPM</span></h3>
          </div>
        </GlassCard>

        <GlassCard className="p-6 flex flex-col justify-between h-48">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
              <Zap size={24} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-widest mb-1">Activity</p>
            <h3 className="text-3xl font-black text-white">842 <span className="text-sm text-[#8e8e93] font-medium">KCAL</span></h3>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Quick Actions</h2>
        <NeonButton onClick={onStartWorkout} className="w-full h-20 text-xl">
          Start Workout Now <ChevronRight size={24} />
        </NeonButton>
      </div>
    </motion.div>
  );
};

const ExerciseLibrary = () => {
  const [search, setSearch] = useState('');
  const [activeExercise, setActiveExercise] = useState<any>(null);

  return (
    <div className="space-y-6 pb-24">
      <header className="space-y-4">
        <h1 className="text-3xl font-black uppercase italic">Mastery <span style={{ color: NEON_LIME }}>Library</span></h1>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e8e93]" size={20} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#BBF246]/50 placeholder:text-[#444] text-white"
            placeholder="Search exercises..."
          />
        </div>
      </header>

      <div className="space-y-4">
        {EXERCISES.filter(e => e.name.toLowerCase().includes(search.toLowerCase())).map(e => (
          <GlassCard key={e.name} onClick={() => setActiveExercise(e)} className="p-4 flex items-center gap-4 cursor-pointer group hover:bg-white/5">
            <div className="w-20 h-20 bg-black rounded-2xl overflow-hidden shrink-0 border border-white/10">
              <img src={e.image} alt={e.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">{e.name}</h3>
              <p className="text-xs text-[#8e8e93] uppercase tracking-wider">{e.cat} • {e.lvl}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#BBF246] group-hover:text-black transition-all">
              <ChevronRight size={20} />
            </div>
          </GlassCard>
        ))}
      </div>

      <AnimatePresence>
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            onClick={() => setActiveExercise(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111] w-full max-w-lg rounded-[2.5rem] overflow-hidden border border-white/10 relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative aspect-video w-full bg-black">
                <iframe width="100%" height="100%" src={activeExercise.videoUrl} title={activeExercise.name} className="absolute inset-0" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope;" allowFullScreen />
                <button onClick={() => setActiveExercise(null)} className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full backdrop-blur-md hover:bg-black/80">
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <h2 className="text-3xl font-black uppercase italic mb-2">{activeExercise.name}</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 rounded-lg bg-[#BBF246]/20 text-[#BBF246] text-[10px] font-black uppercase tracking-widest">{activeExercise.cat}</span>
                    <span className="px-3 py-1 rounded-lg bg-white/10 text-white/60 text-[10px] font-black uppercase tracking-widest">{activeExercise.lvl}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#8e8e93] uppercase tracking-widest">Targets</h3>
                  <div className="flex flex-wrap gap-2">
                    {activeExercise.muscles.map((m: string) => <span key={m} className="px-3 py-1 bg-white/5 rounded-md text-xs border border-white/5">{m}</span>)}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-[#BBF246]/5 border border-[#BBF246]/10">
                  <p className="text-sm text-[#8e8e93]">{activeExercise.benefits}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWatchConnected, setIsWatchConnected] = useState(false);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-black text-white px-6 py-8 selection:bg-[#BBF246] selection:text-black">
      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <Dashboard
            userName="Pranav"
            streak={12}
            heartRate={72}
            isWatchConnected={isWatchConnected}
            onConnectWatch={() => setIsWatchModalOpen(true)}
            onStartWorkout={() => setActiveTab('library')}
            onOpenProgress={() => { }}
          />
        )}
        {activeTab === 'library' && <ExerciseLibrary />}
        {/* Placeholder for other tabs */}
      </AnimatePresence>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-2 rounded-full bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
          {[
            { id: 'dashboard', icon: LayoutDashboard },
            { id: 'library', icon: Library },
            { id: 'track', icon: PlusCircle, isMain: true },
            { id: 'history', icon: HistoryIcon },
            { id: 'profile', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center transition-all ${tab.isMain
                  ? 'w-16 h-16 bg-[#BBF246] rounded-full text-black shadow-[0_0_30px_-5px_#BBF246] hover:scale-110 active:scale-95 -mt-8'
                  : `w-12 h-12 rounded-full hover:bg-white/10 ${activeTab === tab.id ? 'text-[#BBF246] bg-white/5' : 'text-[#8e8e93]'}`
                }`}
            >
              <tab.icon size={tab.isMain ? 28 : 22} strokeWidth={tab.isMain ? 2.5 : 2} />
              {activeTab === tab.id && !tab.isMain && (
                <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#BBF246]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Watch Modal Placeholder */}
      {isWatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setIsWatchModalOpen(false)}>
          <GlassCard className="p-8 w-80 text-center" onClick={(e: any) => e.stopPropagation()}>
            <Watch size={48} className="mx-auto mb-4 text-[#BBF246]" />
            <h2 className="text-xl font-bold mb-4">Sync Device</h2>
            <NeonButton onClick={() => { setIsWatchConnected(!isWatchConnected); setIsWatchModalOpen(false); }}>
              {isWatchConnected ? 'Disconnect' : 'Connect Now'}
            </NeonButton>
          </GlassCard>
        </div>
      )}
    </main>
  );
}
