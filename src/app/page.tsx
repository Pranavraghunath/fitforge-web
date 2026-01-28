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
  Plus,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// --- STYLING CONSTANTS ---
const NEON_LIME = '#BBF246';
const DEEP_BLACK = '#050505';
const GLASS_BG = 'rgba(255, 255, 255, 0.03)';
const GLASS_BORDER = 'rgba(255, 255, 255, 0.08)';

// --- COMPONENTS ---

const GlassCard = ({ children, className, onClick, ...props }: { children: React.ReactNode, className?: string, onClick?: React.MouseEventHandler<HTMLDivElement>, [key: string]: any }) => (
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
  {
    name: 'Plank',
    cat: 'Core',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1548691905-57c36cc8d93f?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c', // Plank Tutorial
    muscles: ['Rectus Abdominis', 'Obliques', 'Transverse Abdominis'],
    benefits: 'Essential for core stability, preventing lower back pain, and overall static strength.'
  },
  {
    name: 'Bodyweight Squats',
    cat: 'Legs',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1574680676118-05f2a1395c83?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/YaXPRqUwItQ', // Squat Tutorial
    muscles: ['Quadriceps', 'Gluteus Maximus'],
    benefits: 'Great for warming up the lower body and improving hip mobility.'
  },
  {
    name: 'Glute Bridges',
    cat: 'Core',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/8bbE64NuDSU', // Glute Bridge
    muscles: ['Gluteus Maximus', 'Hamstrings'],
    benefits: 'Activates the posterior chain and improves hip extension power.'
  },
  {
    name: 'Push Ups',
    cat: 'Chest',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1571019623533-312984950ca0?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4', // Push Up
    muscles: ['Pectorals', 'Triceps', 'Anterior Deltoids'],
    benefits: 'The fundamental upper body pushing exercise. Builds foundational strength.'
  },
  {
    name: 'Cat-Cow Stretch',
    cat: 'Mobility',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1552196564-972d3f939037?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/w_U0S9fV8P8',
    muscles: ['Spine', 'Erector Spinae'],
    benefits: 'Improves spinal flexibility and relieves tension in the back.'
  },
  {
    name: 'Bird-Dog',
    cat: 'Core',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/wiFNA3sqjCA',
    muscles: ['Core', 'Glutes', 'Lower Back'],
    benefits: 'Excellent for stability, coordination, and strengthening the spinal extensors.'
  },
  {
    name: 'Dead Hang',
    cat: 'Mobility',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/iQ5sY_Iez2I',
    muscles: ['Shoulders', 'Forearms', 'Lats'],
    benefits: 'Decompresses the spine and builds massive grip strength and shoulder health.'
  },
  {
    name: 'Bench Press (Barbell)',
    cat: 'Chest',
    lvl: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
    muscles: ['Pectoralis Major', 'Triceps Brachii', 'Anterior Deltoid'],
    benefits: 'The ultimate upper body strength movement, essential for building chest mass and pushing power.'
  },
  {
    name: 'Deadlift (Conventional)',
    cat: 'Back',
    lvl: 'Advanced',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/Opz7aZ-kdTk',
    muscles: ['Erector Spinae', 'Gluteus Maximus', 'Hamstrings', 'Trapezius'],
    benefits: 'The king of posterior chain exercises. Builds total-body raw strength and spinal stability.'
  },
  {
    name: 'Squat (High Bar)',
    cat: 'Legs',
    lvl: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/i7J5h7BJ07g',
    muscles: ['Quadriceps', 'Gluteus Maximus', 'Adductors'],
    benefits: 'Crucial for lower body development, functional power, and increasing metabolic demand.'
  },
  {
    name: 'Pull Ups',
    cat: 'Back',
    lvl: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1598971639058-aba00366601b?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
    muscles: ['Latissimus Dorsi', 'Biceps Brachii', 'Rhomboids'],
    benefits: 'The primary movement for back width (V-taper) and incredible functional upper body strength.'
  },
  {
    name: 'Overhead Press',
    cat: 'Shoulders',
    lvl: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1532384661798-58b53a4fbe37?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/2yjaw54vxLA',
    muscles: ['Deltoids', 'Triceps', 'Upper Traps'],
    benefits: 'Excellent for shoulder health and strength, and building a thick, powerful upper frame.'
  },
  {
    name: 'Bicep Curls (Dumbbell)',
    cat: 'Arms',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/ykJgrLQ9T24',
    muscles: ['Biceps Brachii', 'Brachialis'],
    benefits: 'Targeted isolation for bicep peaks and arm thickness.'
  },
  {
    name: 'Tricep Pushdowns',
    cat: 'Arms',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/2-LAMpZbaNI',
    muscles: ['Triceps Brachii'],
    benefits: 'Isolates the triceps for that "horshoe" look and improves elbow stability for pressing.'
  }
];

const ROUTINES = [
  {
    name: 'Daily Essentials (Warmup)',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    exercises: [
      { name: 'Plank', category: 'Core', image: 'https://images.unsplash.com/photo-1548691905-57c36cc8d93f?auto=format&fit=crop&q=80&w=400' },
      { name: 'Bodyweight Squats', category: 'Legs', image: 'https://images.unsplash.com/photo-1574680676118-05f2a1395c83?auto=format&fit=crop&q=80&w=400' },
      { name: 'Glute Bridges', category: 'Glutes', image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=400' },
      { name: 'Push Ups', category: 'Chest', image: 'https://images.unsplash.com/photo-1571019623533-312984950ca0?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    name: 'Mobility & Prep',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    exercises: [
      { name: 'Cat-Cow Stretch', category: 'Mobility', image: 'https://images.unsplash.com/photo-1552196564-972d3f939037?auto=format&fit=crop&q=80&w=400' },
      { name: 'Bird-Dog', category: 'Core/Balance', image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=400' },
      { name: 'Dead Hang', category: 'Shoulders', image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    name: 'Push (Hypertrophy)',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    exercises: [
      { name: 'Bench Press', category: 'Chest', image: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?auto=format&fit=crop&q=80&w=400' },
      { name: 'Overhead Press', category: 'Shoulders', image: 'https://images.unsplash.com/photo-1532384661798-58b53a4fbe37?auto=format&fit=crop&q=80&w=400' },
      { name: 'Tricep Pushdowns', category: 'Arms', image: 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=400' }
    ]
  },
  {
    name: 'Leg Day (Raw Strength)',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
    exercises: [
      { name: 'Squats', category: 'Legs', image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=400' },
      { name: 'Deadlifts', category: 'Back/Legs', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400' },
      { name: 'Lunges', category: 'Legs', image: 'https://images.unsplash.com/photo-1434682841983-26829b10953d?auto=format&fit=crop&q=80&w=400' }
    ]
  }
];

const DIET_PLAN = [{ day: "Day 1", label: "Mon", meals: { breakfast: "Oats & Berries", lunch: "Grilled Chicken Salad", dinner: "Quinoa Bowl" } }];

const ActivityStats = () => {
  const [view, setView] = useState('Week');

  const weeklyData = [
    { name: 'Mon', kcal: 2400 },
    { name: 'Tue', kcal: 1398 },
    { name: 'Wed', kcal: 9800 },
    { name: 'Thu', kcal: 3908 },
    { name: 'Fri', kcal: 4800 },
    { name: 'Sat', kcal: 3800 },
    { name: 'Sun', kcal: 4300 },
  ];

  return (
    <div className="space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black uppercase italic">Activity <span style={{ color: NEON_LIME }}>Stats</span></h1>
        <div className="flex bg-[#1a1a1a] rounded-xl p-1 border border-white/10">
          {['Day', 'Week', 'Month'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${view === v ? `bg-[${NEON_LIME}] text-black shadow-lg` : 'text-[#8e8e93]'}`}
              style={view === v ? { backgroundColor: NEON_LIME } : {}}
            >
              {v}
            </button>
          ))}
        </div>
      </header>

      {/* Step Counter Hero */}
      <GlassCard className="p-8 relative overflow-hidden">
        <div className="flex justify-between items-center relative z-10">
          <div>
            <p className="text-[#8e8e93] text-xs font-bold uppercase tracking-widest mb-1">Steps Today</p>
            <h2 className="text-6xl font-black text-white tracking-tighter">8,432</h2>
            <p className="text-[#BBF246] text-sm font-bold mt-2 flex items-center gap-1">
              <TrendingUp size={16} /> +12% vs Yesterday
            </p>
          </div>
          <div className="w-24 h-24 relative">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
              <path className="text-[#BBF246]" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-black">75%</span>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[#BBF246]/10 rounded-full blur-3xl pointer-events-none" />
      </GlassCard>

      {/* Calories Chart */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Calories Burned</h3>
        <GlassCard className="h-64 p-4 border-[#BBF246]/20">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="colorKcal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BBF246" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#BBF246" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#BBF246' }}
              />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} dy={10} />
              <Area type="monotone" dataKey="kcal" stroke="#BBF246" strokeWidth={3} fillOpacity={1} fill="url(#colorKcal)" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4">
          <p className="text-[10px] text-[#8e8e93] font-bold uppercase mb-1">Distance</p>
          <h3 className="text-2xl font-black">5.2 <span className="text-xs font-medium text-[#8e8e93]">KM</span></h3>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[10px] text-[#8e8e93] font-bold uppercase mb-1">Floors</p>
          <h3 className="text-2xl font-black">12 <span className="text-xs font-medium text-[#8e8e93]">FLR</span></h3>
        </GlassCard>
      </div>
    </div>
  );
};

// --- SECTIONS ---

const Dashboard = ({ userName, streak, timerSeconds, isTimerActive, heartRate, isWatchConnected, onConnectWatch, onStartWorkout, onOpenProgress, onOpenActivity }: any) => {
  const formatTime = (total: number) => `${Math.floor(total / 60).toString().padStart(2, '0')}:${(total % 60).toString().padStart(2, '0')}`;

  const [greeting, setGreeting] = useState('');
  const [quote, setQuote] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Time to Grind');

    const quotes = [
      "Sweat is just fat crying.",
      "Your only limit is you.",
      "Don't stop when you're tired. Stop when you're done.",
      "Pain is temporary. Pride is forever.",
      "Light weight, baby!"
    ];
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  const handleWatchClick = () => {
    if (!isWatchConnected) {
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        onConnectWatch();
      }, 2000); // Simulated scan time
    } else {
      onConnectWatch(); // Disconnect
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-32">
      {/* Header */}
      <header className="flex justify-between items-start">
        <div>
          <p className="text-[#BBF246] text-[10px] font-black tracking-widest uppercase mb-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#BBF246] animate-pulse" /> ONLINE • KOCHI, INDIA
          </p>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            {greeting}, <br />{userName}
          </h1>
          <p className="text-[#8e8e93] text-xs font-medium mt-2 max-w-[200px] leading-relaxed">
            "{quote}"
          </p>
        </div>
        <button onClick={onOpenProgress} className="relative group">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-[#BBF246] transition-all relative">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#BBF246] text-black text-[8px] font-black px-2 py-0.5 rounded-full border border-black">PREMIUM</div>
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
        <GlassCard onClick={handleWatchClick} className="p-6 flex flex-col justify-between h-48 cursor-pointer group">
          <div className="flex justify-between items-start">
            <div className={`p-3 rounded-2xl ${isWatchConnected ? 'bg-[#BBF246] text-black' : isScanning ? 'bg-orange-500 text-white animate-pulse' : 'bg-white/5 text-[#8e8e93]'}`}>
              {isScanning ? <Bluetooth size={24} className="animate-spin" /> : <Watch size={24} />}
            </div>
            {isWatchConnected && <div className="w-2 h-2 bg-[#BBF246] rounded-full animate-pulse shadow-[0_0_10px_#BBF246]" />}
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-widest mb-1">{isScanning ? 'SCANNING...' : 'Heart Rate'}</p>
            <h3 className="text-3xl font-black text-white">{isScanning ? '...' : isWatchConnected ? heartRate : '--'} <span className="text-sm text-[#8e8e93] font-medium">{!isScanning && 'BPM'}</span></h3>
          </div>
        </GlassCard>

        <GlassCard onClick={onOpenActivity} className="p-6 flex flex-col justify-between h-48 cursor-pointer hover:bg-white/5 transition-all">
          <div className="flex justify-between items-start">
            <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400">
              <Zap size={24} />
            </div>
            <div className="p-2 bg-white/5 rounded-full">
              <ChevronRight size={16} className="text-[#8e8e93]" />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-widest mb-1">Today's Activity</p>
            <h3 className="text-3xl font-black text-white">8,432 <span className="text-sm text-[#8e8e93] font-medium">STEPS</span></h3>
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

const History = () => {
  const historyData = [
    { id: '1', name: 'Full Body Crush', date: 'Today, 9:00 AM', duration: '45m', calories: 320, volume: 12400 },
    { id: '2', name: 'Upper Body Power', date: 'Yesterday', duration: '55m', calories: 410, volume: 15600 },
    { id: '3', name: 'Leg Day Survival', date: 'Jan 26', duration: '60m', calories: 500, volume: 18200 },
    { id: '4', name: 'Active Recovery', date: 'Jan 24', duration: '30m', calories: 150, volume: 0 },
  ];

  return (
    <div className="space-y-6 pb-24">
      <header>
        <h1 className="text-3xl font-black uppercase italic">Workout <span style={{ color: NEON_LIME }}>History</span></h1>
      </header>

      <div className="space-y-4">
        {historyData.map((session) => (
          <GlassCard key={session.id} className="p-5 flex justify-between items-center group cursor-pointer hover:bg-white/5">
            <div className="flex gap-4 items-center">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 text-[#8e8e93] group-hover:text-black group-hover:bg-[${NEON_LIME}] transition-all`}>
                <HistoryIcon size={20} />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{session.name}</h3>
                <p className="text-xs text-[#8e8e93]">{session.date} • {session.duration}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-black text-white">{session.volume > 0 ? `${(session.volume / 1000).toFixed(1)}k` : '--'}</p>
              <p className="text-[10px] text-[#8e8e93] uppercase tracking-wider">VOL (KG)</p>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

const Profile = ({ userProfile, onUpdateProfile }: { userProfile: UserProfile, onUpdateProfile: (p: UserProfile) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(userProfile);

  const handleSave = () => {
    onUpdateProfile(tempProfile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-24 text-center">
      <header className="relative inline-block mt-4">
        <div className="w-32 h-32 rounded-full p-1 border-2 border-[#BBF246] relative mx-auto">
          <img src={userProfile.avatar} alt="Profile" className="w-full h-full object-cover rounded-full grayscale" />
          <button className="absolute bottom-0 right-0 p-2 bg-[#BBF246] rounded-full text-black hover:scale-110 transition-transform">
            <Camera size={16} />
          </button>
        </div>
        {isEditing ? (
          <input
            value={tempProfile.name}
            onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
            className="mt-4 bg-transparent border-b border-[#BBF246] text-2xl font-black text-center text-white outline-none w-full"
          />
        ) : (
          <h2 className="text-2xl font-black mt-4 uppercase italic">{userProfile.name}</h2>
        )}
        <p className="text-xs text-[#8e8e93] tracking-widest uppercase">Pro Member</p>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {['weight', 'height', 'age'].map((field) => (
          <GlassCard key={field} className="p-4 flex flex-col items-center justify-center h-24 relative">
            {isEditing ? (
              <input
                value={tempProfile[field as keyof typeof tempProfile] as string} // simple cast for demo
                onChange={(e) => setTempProfile({ ...tempProfile, [field]: e.target.value })}
                className="w-full bg-transparent text-2xl font-black text-white text-center outline-none border-b border-white/20 focus:border-[#BBF246]"
              />
            ) : (
              // @ts-ignore
              <span className="text-2xl font-black text-white">{userProfile[field as keyof typeof userProfile] || '24'}</span>
            )}
            <span className="text-[10px] text-[#8e8e93] uppercase font-bold tracking-wider mt-1">
              {field === 'weight' ? 'KG' : field === 'height' ? 'CM' : 'YRS'}
            </span>
          </GlassCard>
        ))}
      </div>

      <div className="px-4">
        {isEditing ? (
          <NeonButton onClick={handleSave} className="w-full">
            Save Changes
          </NeonButton>
        ) : (
          <NeonButton onClick={() => { setTempProfile(userProfile); setIsEditing(true); }} variant="secondary" className="w-full">
            Edit Profile
          </NeonButton>
        )}
      </div>

      <div className="space-y-3 text-left">
        <h3 className="text-sm font-bold text-[#8e8e93] uppercase tracking-widest ml-1">Settings</h3>
        <GlassCard className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5">
          <div className="flex items-center gap-3">
            <User size={20} className="text-white" />
            <span className="font-medium">Account Details</span>
          </div>
          <ChevronRight size={16} className="text-[#8e8e93]" />
        </GlassCard>
        <GlassCard className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-white" />
            <span className="font-medium">Preferences</span>
          </div>
          <ChevronRight size={16} className="text-[#8e8e93]" />
        </GlassCard>
        <GlassCard className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5 border-red-500/20">
          <div className="flex items-center gap-3 text-red-500">
            <X size={20} />
            <span className="font-bold">Log Out</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

const Track = ({ onUpdateProfile, userProfile }: { onUpdateProfile: any, userProfile: any }) => {
  const [water, setWater] = useState(0);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [weightInput, setWeightInput] = useState(userProfile.weight);
  const [mealInput, setMealInput] = useState('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const saveWeight = () => {
    onUpdateProfile({ ...userProfile, weight: weightInput });
    setActiveModal(null);
  };

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="space-y-8 pb-24 relative">
      <header>
        <h1 className="text-3xl font-black uppercase italic">Quick <span style={{ color: NEON_LIME }}>Track</span></h1>
        <p className="text-[#8e8e93] text-xs font-bold tracking-widest uppercase mt-1">Log your progress</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        {/* Water Tracker */}
        <GlassCard className="col-span-2 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Utensils size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{water * 250}ml</h3>
              <p className="text-[10px] text-[#8e8e93] uppercase font-bold tracking-wider">Water Intake</p>
            </div>
          </div>
          <div className="flex gap-2">
            <NeonButton onClick={() => setWater(Math.max(0, water - 1))} variant="secondary" className="px-3 py-2 rounded-xl"> - </NeonButton>
            <NeonButton onClick={() => setWater(water + 1)} className="px-3 py-2 rounded-xl"> + </NeonButton>
          </div>
        </GlassCard>

        {/* Quick Actions Grid */}
        <GlassCard onClick={() => setActiveModal('weight')} className="p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 group transition-all">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#BBF246] group-hover:text-black transition-all">
            <Activity size={24} />
          </div>
          <span className="font-bold text-sm">Log Weight</span>
        </GlassCard>

        <GlassCard onClick={() => setActiveModal('meal')} className="p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 group transition-all">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#BBF246] group-hover:text-black transition-all">
            <Utensils size={24} />
          </div>
          <span className="font-bold text-sm">Add Meal</span>
        </GlassCard>

        <GlassCard onClick={() => setActiveModal('photo')} className="p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 group transition-all">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#BBF246] group-hover:text-black transition-all">
            <Camera size={24} />
          </div>
          <span className="font-bold text-sm">Photo</span>
        </GlassCard>

        <GlassCard onClick={() => setActiveModal('timer')} className="p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 group transition-all">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#BBF246] group-hover:text-black transition-all">
            <TimerIcon size={24} />
          </div>
          <span className="font-bold text-sm">Timer</span>
        </GlassCard>
      </div>


      {/* MODALS */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6" onClick={() => setActiveModal(null)}>
            <GlassCard className="w-full max-w-sm p-6 space-y-4" onClick={(e) => { e.stopPropagation(); }}>

              {activeModal === 'weight' && (
                <>
                  <h3 className="text-xl font-bold uppercase italic">Update Weight</h3>
                  <input
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl font-black text-center text-white outline-none focus:border-[#BBF246]"
                  />
                  <NeonButton onClick={saveWeight} className="w-full">Save Weight</NeonButton>
                </>
              )}

              {activeModal === 'meal' && (
                <>
                  <h3 className="text-xl font-bold uppercase italic">Log Meal</h3>
                  <input
                    value={mealInput}
                    onChange={(e) => setMealInput(e.target.value)}
                    placeholder="What did you eat?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-lg text-white outline-none focus:border-[#BBF246]"
                  />
                  <NeonButton onClick={() => setActiveModal(null)} className="w-full">Add Log</NeonButton>
                </>
              )}

              {activeModal === 'photo' && (
                <>
                  <h3 className="text-xl font-bold uppercase italic">Progress Photo</h3>
                  <div className="aspect-square rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-[#8e8e93] hover:border-[#BBF246] hover:text-[#BBF246] transition-all cursor-pointer">
                    <Camera size={48} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest">Tap to Upload</span>
                    <input type="file" className="opacity-0 absolute inset-0 cursor-pointer" />
                  </div>
                  <NeonButton onClick={() => setActiveModal(null)} className="w-full">Save Photo</NeonButton>
                </>
              )}

              {activeModal === 'timer' && (
                <div className="text-center space-y-6">
                  <h3 className="text-xl font-bold uppercase italic">Rest Timer</h3>
                  <div className="text-7xl font-black tabular-nums tracking-tighter">{formatTimer(timer)}</div>
                  <div className="flex gap-2 justify-center">
                    <button onClick={() => setIsTimerRunning(!isTimerRunning)} className={`p-4 rounded-full ${isTimerRunning ? 'bg-red-500/20 text-red-500' : 'bg-[#BBF246] text-black'}`}>
                      {isTimerRunning ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button onClick={() => { setIsTimerRunning(false); setTimer(0); }} className="p-4 rounded-full bg-white/10 text-white">
                      <RotateCcw size={24} />
                    </button>
                  </div>
                </div>
              )}

            </GlassCard>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Diet = () => {
  return (
    <div className="space-y-6 pb-24">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase italic">Nutrition <span style={{ color: NEON_LIME }}>Plan</span></h1>
          <p className="text-[#8e8e93] text-xs font-bold tracking-widest uppercase mt-1">Fuel for growth</p>
        </div>
        <span className="text-[10px] bg-[#BBF246] text-black px-3 py-1 rounded-full font-black tracking-wider">LEANING</span>
      </header>

      <div className="space-y-4">
        {[
          { time: '8:00 - 9:00 AM', meal: 'Breakfast', items: 'Oat Meal Porridge + 4 Egg Whites' },
          { time: '11:00 AM - 12:00 PM', meal: 'Mid Morning', items: 'Papaya (1 Bowl)' },
          { time: '2:00 - 3:00 PM', meal: 'Lunch', items: '2 Roti + Brown Rice + Dal/Chicken/Fish + Salad + Curd' },
          { time: '5:00 - 6:00 PM', meal: 'Evening Snacks', items: 'Green Tea with Almonds' },
          { time: '8:00 - 9:00 PM', meal: 'Dinner', items: 'Seasonal Vegetables + Sprouts + Veg Salad' },
          { time: '10:00 PM', meal: 'Bed Time', items: 'Toned Milk' },
        ].map((item, i) => (
          <GlassCard key={i} className="p-4 flex gap-4 group hover:bg-white/5 transition-all">
            <div className="flex flex-col items-center justify-center w-16 shrink-0 border-r border-white/10 pr-4">
              <span className="text-[10px] text-[#BBF246] font-bold text-center leading-tight">{item.time.split('-')[0]}</span>
              <div className="w-1 h-8 bg-white/10 rounded-full my-1 group-hover:bg-[#BBF246] transition-colors" />
            </div>
            <div>
              <h4 className="text-white font-bold uppercase italic text-sm mb-1">{item.meal}</h4>
              <p className="text-xs text-[#8e8e93] font-medium leading-relaxed">{item.items}</p>
            </div>
          </GlassCard>
        ))}

        <div className="grid grid-cols-2 gap-3 mt-4">
          <GlassCard className="p-3 bg-[#BBF246]/10 border-[#BBF246]/20">
            <p className="text-[10px] font-bold text-[#BBF246] uppercase mb-1">Pre-Workout</p>
            <p className="text-xs text-white">2 Banana or 1 Apple</p>
          </GlassCard>
          <GlassCard className="p-3 bg-blue-500/10 border-blue-500/20">
            <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Post-Workout</p>
            <p className="text-xs text-white">2 Scoops Whey Isolate</p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const tracks = [
    { title: "Gym Phonk 2024", artist: "Beast Mode", url: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3" }, // High energy placeholder
    { title: "Hardstyle Grind", artist: "Zyzz Legacy", url: "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8907f1854.mp3" },
    { title: "Focus Power", artist: "Iron Will", url: "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3" }
  ];

  const togglePlay = (e: any) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = (e: any) => {
    e.stopPropagation();
    setTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
    // Timeout to allow ref to update source
    setTimeout(() => audioRef.current?.play(), 100);
  };

  return (
    <>
      <audio ref={audioRef} src={tracks[trackIndex].url} loop onEnded={() => setTrackIndex(i => (i + 1) % tracks.length)} />

      <motion.div
        layout
        initial={false}
        animate={isExpanded ? { width: 300, height: 'auto', borderRadius: 24 } : { width: 60, height: 60, borderRadius: 30 }}
        className="absolute bottom-28 right-4 z-[60] bg-black/80 backdrop-blur-2xl border border-[#BBF246]/30 overflow-hidden shadow-[0_0_30px_-5px_rgba(187,242,70,0.3)]"
        onClick={() => !isExpanded && setIsExpanded(true)}
      >
        <div className="relative h-full flex flex-col">
          {/* Minimized State */}
          {!isExpanded && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className={`absolute inset-0 bg-[#BBF246]/20 rounded-full ${isPlaying ? 'animate-ping' : ''}`} />
              <Music size={24} className={isPlaying ? 'text-[#BBF246] animate-pulse' : 'text-white'} />
            </motion.div>
          )}

          {/* Expanded State */}
          {isExpanded && (
            <div className="p-5 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#BBF246] animate-pulse" />
                  <span className="text-[10px] font-black text-[#BBF246] tracking-widest uppercase">Now Playing</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} className="p-1 hover:bg-white/10 rounded-full">
                  <X size={16} className="text-white/50" />
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-white font-black text-lg leading-tight">{tracks[trackIndex].title}</h3>
                <p className="text-[#8e8e93] text-xs font-bold uppercase">{tracks[trackIndex].artist}</p>
              </div>

              {/* Visualizer Bars */}
              <div className="flex items-end justify-between h-8 gap-1 opacity-80">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={isPlaying ? { height: [5, 24, 8, 32, 12, 5] } : { height: 4 }}
                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, ease: "linear" }}
                    className="w-1.5 bg-[#BBF246] rounded-full"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between mt-2">
                <button onClick={e => e.stopPropagation()} className="bg-white/5 border border-white/10 p-3 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                  <RotateCcw size={18} className="text-white" />
                </button>
                <button onClick={togglePlay} className="bg-[#BBF246] p-4 rounded-full text-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_#BBF246]">
                  {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                </button>
                <button onClick={nextTrack} className="bg-white/5 border border-white/10 p-3 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                  <ChevronRight size={18} className="text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isWatchConnected, setIsWatchConnected] = useState(false);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);

  // Lifted User State
  const [userProfile, setUserProfile] = useState<any>({
    name: 'Pranav',
    email: 'pranav@example.com',
    phone: '',
    height: '182',
    weight: '80.2',
    age: '24', // Added age field
    avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
    publicProfile: true,
    notifications: true
  });

  useEffect(() => setIsMounted(true), []);

  if (!isMounted) return <div className="min-h-screen bg-black" />;

  return (
    <main className="max-w-md mx-auto min-h-screen bg-black text-white px-6 py-8 selection:bg-[#BBF246] selection:text-black relative">
      {/* Music Player Overlay */}
      <MusicPlayer />

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <Dashboard
            userName={userProfile.name} // Use dynamic name
            streak={12}
            heartRate={72}
            isWatchConnected={isWatchConnected}
            onConnectWatch={() => setIsWatchModalOpen(true)}
            onStartWorkout={() => setActiveTab('library')}
            onOpenProgress={() => setActiveTab('profile')}
            onOpenActivity={() => setActiveTab('activity')}
          />
        )}
        {activeTab === 'library' && <ExerciseLibrary />}
        {activeTab === 'diet' && <Diet />}
        {activeTab === 'activity' && <ActivityStats />}
        {activeTab === 'track' && <Track userProfile={userProfile} onUpdateProfile={setUserProfile} />}
        {activeTab === 'history' && <History />}
        {activeTab === 'profile' && (
          <Profile
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
          />
        )}
      </AnimatePresence>

      {/* Floating Dock Navigation */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <div className="flex items-center gap-2 p-2 rounded-full bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 shadow-2xl">
          {[
            { id: 'dashboard', icon: LayoutDashboard },
            { id: 'library', icon: Library },
            { id: 'track', icon: PlusCircle, isMain: true },
            { id: 'diet', icon: Utensils },
            { id: 'history', icon: HistoryIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center justify-center transition-all ${tab.isMain
                ? 'w-16 h-16 bg-[#BBF246] rounded-full text-black shadow-[0_0_30px_-5px_#BBF246] hover:scale-110 active:scale-95 -mt-8 mx-1'
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
          <GlassCard className="p-8 w-80 text-center" onClick={(e: any) => { e.stopPropagation(); }}>
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
