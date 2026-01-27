"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Dumbbell,
  History as HistoryIcon,
  Timer as TimerIcon,
  Library,
  Flame,
  PlusCircle,
  Search,
  ChevronRight,
  Clock,
  RotateCcw,
  Play,
  Pause,
  Plus,
  MoreHorizontal,
  CheckCircle2,
  TrendingUp,
  Camera,
  X,
  Target,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Apple,
  TriangleAlert,
  Zap,
  Watch,
  Bluetooth,
  Activity,
  User,
  Mail,
  Phone,
  Ruler
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Cell } from 'recharts';

// --- Components ---

const Button = ({ children, className, variant = 'primary', ...props }: { children: React.ReactNode, className?: string, variant?: 'primary' | 'secondary' | 'ghost', [key: string]: unknown }) => {
  const variants = {
    primary: 'bg-[#BBF246] text-black hover:bg-[#a8db3f]',
    secondary: 'bg-[#1a1a1a] text-white hover:bg-[#252525] border border-white/10',
    ghost: 'bg-transparent text-[#BBF246] hover:bg-[#BBF246]/10',
  };
  return (
    <button
      className={`px-4 py-2 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 ${variants[variant as keyof typeof variants]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className, ...props }: { children: React.ReactNode, className?: string, [key: string]: unknown }) => (
  <div className={`bg-[#1a1a1a] rounded-2xl p-6 border border-white/5 ${className}`} {...props}>
    {children}
  </div>
);

// --- Types ---

interface Set {
  id: string;
  weight: string;
  reps: string;
  isCompleted: boolean;
}

interface ExerciseSession {
  id: string;
  name: string;
  category: string;
  image?: string;
  sets: Set[];
}

interface Workout {
  id: string;
  name: string;
  date: string;
  duration: string;
  totalVolume: number;
  exerciseCount: number;
  exercises: ExerciseSession[];
}

interface ProgressEntry {
  date: string;
  weight: number;
  waist?: number;
  chest?: number;
}

interface ProgressPhoto {
  id: string;
  date: string;
  url: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  height: string;
  weight: string;
  avatar: string;
  publicProfile: boolean;
  notifications: boolean;
}

// --- Shared Data ---

const EXERCISES = [
  {
    name: 'Plank',
    cat: 'Core',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1548691905-57c36cc8d93f?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
    muscles: ['Rectus Abdominis', 'Obliques', 'Transverse Abdominis'],
    benefits: 'Essential for core stability, preventing lower back pain, and overall static strength.'
  },
  {
    name: 'Bodyweight Squats',
    cat: 'Legs',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1574680676118-05f2a1395c83?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/aclHkVaku9U',
    muscles: ['Quadriceps', 'Gluteus Maximus'],
    benefits: 'Great for warming up the lower body and improving hip mobility.'
  },
  {
    name: 'Glute Bridges',
    cat: 'Core',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/fOnP7NInPQA',
    muscles: ['Gluteus Maximus', 'Hamstrings'],
    benefits: 'Activates the posterior chain and improves hip extension power.'
  },
  {
    name: 'Push Ups',
    cat: 'Chest',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1571019623533-312984950ca0?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
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
    videoUrl: 'https://www.youtube.com/embed/mK9K9d73L_o',
    muscles: ['Core', 'Glutes', 'Lower Back'],
    benefits: 'Excellent for stability, coordination, and strengthening the spinal extensors.'
  },
  {
    name: 'Dead Hang',
    cat: 'Mobility',
    lvl: 'Beginner',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/D3D60-YxY6k',
    muscles: ['Shoulders', 'Forearms', 'Lats'],
    benefits: 'Decompresses the spine and builds massive grip strength and shoulder health.'
  },
  {
    name: 'Bench Press (Barbell)',
    cat: 'Chest',
    lvl: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/gRVjAtPip0Y',
    muscles: ['Pectoralis Major', 'Triceps Brachii', 'Anterior Deltoid'],
    benefits: 'The ultimate upper body strength movement, essential for building chest mass and pushing power.'
  },
  {
    name: 'Deadlift (Conventional)',
    cat: 'Back',
    lvl: 'Advanced',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
    muscles: ['Erector Spinae', 'Gluteus Maximus', 'Hamstrings', 'Trapezius'],
    benefits: 'The king of posterior chain exercises. Builds total-body raw strength and spinal stability.'
  },
  {
    name: 'Squat (High Bar)',
    cat: 'Legs',
    lvl: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600',
    videoUrl: 'https://www.youtube.com/embed/U5zrloYWliw',
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
    videoUrl: 'https://www.youtube.com/embed/QAQ64hK4SkI',
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

const DIET_PLAN = [
  {
    day: "Day 1", label: "Mon",
    meals: {
      breakfast: "Spinach Moong Dal Cheela + Protein Shake + Papaya",
      lunch: "Multigrain Roti + Fish Curry + Greek Salad",
      snacks: "Fresh Pineapple",
      dinner: "Multigrain Roti + Mushroom Matar Paneer + Tofu Salad"
    }
  },
  {
    day: "Day 2", label: "Tue",
    meals: {
      breakfast: "Overnight Oats Berries Bowl + Seasonal Fruit",
      lunch: "Brown Rice + Lauki Chana Dal + Egg Curry",
      snacks: "Dry Fruits & Mixed Seeds",
      dinner: "Quinoa Khichdi + Shahi Paneer + Veg Salad"
    }
  },
  {
    day: "Day 3", label: "Wed",
    meals: {
      breakfast: "Scrambled Eggs on Toast + Protein Shake",
      lunch: "Grilled Chicken + White Bean Tomato Salad",
      snacks: "Crunchy Vegetable Sticks",
      dinner: "Broiled Fish + Brown Rice + Mixed Greens"
    }
  },
  {
    day: "Day 4", label: "Thu",
    meals: {
      breakfast: "Almond/Soy Milk + Avocado Toast",
      lunch: "Lean Chicken Burger + Lettuce & Tomato",
      snacks: "Bananas (Potassium Rich)",
      dinner: "Palak Paneer + Multigrain Roti + Lauki Raita"
    }
  },
  {
    day: "Day 5", label: "Fri",
    meals: {
      breakfast: "Boiled Eggs + Steamed Seasonal Veggies",
      lunch: "Lemon Gravy Chicken + Brown Rice + Yogurt",
      snacks: "Hard Boiled Egg + Carrot Sticks",
      dinner: "Tofu Curry + Whole Wheat Roti + Sprouts Salad"
    }
  },
  {
    day: "Day 6", label: "Sat",
    meals: {
      breakfast: "Paneer Patty Sandwich (Whole Grain)",
      lunch: "Whole Wheat Chicken Pasta + Green Salad",
      snacks: "Mixed Vegetable Sticks",
      dinner: "Stuffed Baked Mushroom + Multi-Grain Toast"
    }
  },
  {
    day: "Day 7", label: "Sun",
    meals: {
      breakfast: "Apple Peanut Butter Smoothie + Whey Protein",
      lunch: "Multigrain Chapati + Egg Bhurji + Cucumber Raita",
      snacks: "Apple Slices + Nut Butter",
      dinner: "Millet Vegetable Khichdi + Fresh Curd"
    }
  }
];

// --- Sections ---

interface DashboardProps {
  lastWorkout?: Workout;
  timerSeconds: number;
  isTimerActive: boolean;
  libraryCount: number;
  onStartWorkout: () => void;
  onOpenProgress: () => void;
  onConnectWatch: () => void;
  latestWeight?: number;
  isWatchConnected: boolean;
  heartRate?: number;
  userName?: string;
}

const Dashboard = ({
  lastWorkout,
  timerSeconds,
  isTimerActive,
  libraryCount,
  onStartWorkout,
  onOpenProgress,
  onConnectWatch,
  latestWeight,
  isWatchConnected,
  heartRate,
  userName
}: DashboardProps) => {
  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <header className="space-y-1">
        <h1 className="text-3xl font-extrabold">Welcome back, {userName?.split(' ')[0]}! 👋</h1>
        <p className="text-[#8e8e93]">Monday, 27 January</p>
      </header>

      <div className="bg-[#BBF246] p-8 rounded-3xl flex justify-between items-center text-black">
        <div>
          <p className="text-sm font-bold opacity-70 uppercase tracking-wider">Daily Streak</p>
          <h2 className="text-4xl font-black">12 Days</h2>
        </div>
        <Flame size={48} strokeWidth={3} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="relative flex flex-col justify-between h-48 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" alt="" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#BBF246]/10 p-2 rounded-lg">
                <HistoryIcon className="text-[#BBF246]" size={20} />
              </div>
              <span className="font-bold text-[#8e8e93]">Last Session</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold truncate">
              {lastWorkout ? lastWorkout.name : "No Workouts"}
            </h3>
            <p className="text-sm text-[#8e8e93]">
              {lastWorkout ? `${lastWorkout.totalVolume.toLocaleString()} kg lifted` : "Start logging today!"}
            </p>
          </div>
        </Card>

        <Card className={`flex flex-col justify-between h-48 border transition-colors ${isTimerActive ? 'border-[#BBF246]' : 'border-white/5'}`}>
          <div className="flex items-center gap-3">
            <div className="bg-[#BBF246]/10 p-2 rounded-lg">
              <TimerIcon className="text-[#BBF246]" size={20} />
            </div>
            <span className="font-bold text-[#8e8e93]">Active Timer</span>
          </div>
          <div>
            <h3 className={`text-3xl font-black italic font-mono ${isTimerActive ? 'text-[#BBF246]' : 'text-white'}`}>
              {formatTime(timerSeconds)}
            </h3>
            <p className="text-sm text-[#8e8e93]">
              {isTimerActive ? "Running..." : "Ready to Rest"}
            </p>
          </div>
        </Card>

        <Card className="relative flex flex-col justify-between h-48 group cursor-pointer hover:border-[#BBF246]/50 transition-all shadow-xl hover:shadow-[#BBF246]/5 overflow-hidden" onClick={onOpenProgress}>
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" alt="" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#BBF246]/10 p-2 rounded-lg">
                <TrendingUp className="text-[#BBF246]" size={20} />
              </div>
              <span className="font-bold text-[#8e8e93]">Personal Progress</span>
            </div>
          </div>
          <div className="relative z-10 flex items-end justify-between">
            <div>
              <h3 className="text-2xl font-bold">{latestWeight || '--'} kg</h3>
              <p className="text-xs text-[#8e8e93]">Latest weight log</p>
            </div>
            <div className="bg-[#BBF246]/10 px-2 py-1 rounded text-[10px] font-bold text-[#BBF246] mb-1 flex items-center gap-1">
              <TrendingUp size={10} /> -1.2 kg
            </div>
          </div>
        </Card>

        <Card className="relative flex flex-col justify-between h-48 overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=400" className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity" alt="" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="bg-[#BBF246]/10 p-2 rounded-lg">
                <Library className="text-[#BBF246]" size={20} />
              </div>
              <span className="font-bold text-[#8e8e93]">Exercise Library</span>
            </div>
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold">{libraryCount}</h3>
            <p className="text-sm text-[#8e8e93]">Movements available</p>
          </div>
        </Card>

        <Card
          className={`relative flex flex-col justify-between h-48 overflow-hidden transition-all cursor-pointer border ${isWatchConnected ? 'border-[#BBF246]/50 shadow-[0_10px_30px_rgba(187,242,70,0.1)]' : 'hover:border-white/20'}`}
          onClick={onConnectWatch}
        >
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`${isWatchConnected ? 'bg-[#BBF246]' : 'bg-white/5'} p-2 rounded-lg transition-colors`}>
                  <Watch className={isWatchConnected ? 'text-black' : 'text-[#8e8e93]'} size={20} />
                </div>
                <span className="font-bold text-[#8e8e93]">Smart Device</span>
              </div>
              {isWatchConnected && (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#BBF246] animate-pulse" />
                  <span className="text-[8px] font-black text-[#BBF246] uppercase">Active</span>
                </div>
              )}
            </div>
          </div>
          <div className="relative z-10">
            {isWatchConnected ? (
              <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-white leading-none">{heartRate || '--'}</h3>
                <span className="text-[10px] font-bold text-[#8e8e93] uppercase tracking-widest">BPM</span>
                <Activity className="text-red-500 animate-[bounce_1s_infinite] ml-auto" size={24} />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-white">Connect Watch</h3>
                <div className="flex items-center gap-2 text-[#8e8e93] mt-1">
                  <Bluetooth size={12} />
                  <p className="text-xs">Bluetooth Discovery</p>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Everyday Essentials</h2>
          <span className="text-[10px] font-black text-[#BBF246] bg-[#BBF246]/10 px-2 py-1 rounded">DAILY MINIMUM</span>
        </div>
        <Card className="p-4 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] border-white/10">
          <div className="flex flex-col gap-3">
            {[
              { id: 'e1', name: 'Plank (60s)', muscle: 'Core' },
              { id: 'e2', name: 'Cat-Cow (10x)', muscle: 'Mobility' },
              { id: 'e3', name: 'Bodyweight Squats (15x)', muscle: 'Legs' }
            ].map((ess) => (
              <div key={ess.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded border border-[#BBF246]/30 flex items-center justify-center group-hover:border-[#BBF246] transition-colors">
                    <CheckCircle2 size={12} className="text-[#BBF246]/0 group-hover:text-[#BBF246]/50" />
                  </div>
                  <span className="text-sm font-medium">{ess.name}</span>
                </div>
                <span className="text-[10px] text-[#444] font-black uppercase tracking-tighter">{ess.muscle}</span>
              </div>
            ))}
            <Button variant="ghost" className="mt-2 text-[10px] w-full" onClick={onStartWorkout}>
              <Target size={14} />
              START FULL WARMUP SESSION
            </Button>
          </div>
        </Card>
      </section>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Quick Start</h2>
        <Button
          className="w-full h-16 text-lg"
          variant="secondary"
          onClick={onStartWorkout}
        >
          <PlusCircle size={24} />
          Start Empty Workout
        </Button>
      </div>
    </motion.div>
  );
};

const ProgressModal = ({
  isOpen,
  onClose,
  data,
  photos,
  onAddEntry,
  onAddPhoto
}: {
  isOpen: boolean;
  onClose: () => void;
  data: ProgressEntry[];
  photos: ProgressPhoto[];
  onAddEntry: (weight: number) => void;
  onAddPhoto: (url: string) => void;
}) => {
  const latest = data[data.length - 1];
  const weight = latest?.weight || 0;
  const height = 1.8; // Constant height for mockup
  const bmi = weight ? (weight / (height * height)).toFixed(1) : '0.0';
  const bodyFat = 14.2; // Placeholder
  const lbm = weight ? (weight * (1 - bodyFat / 100)).toFixed(1) : '0.0';

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#1a1a1a] w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col border border-white/10"
      >
        <header className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black">Personal Progress</h2>
            <p className="text-xs text-[#8e8e93]">Track your evolution</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-[#8e8e93] uppercase mb-1">Current Weight</p>
              <h3 className="text-xl font-black text-[#BBF246]">{latest?.weight || '--'} <span className="text-xs font-normal text-[#8e8e93]">kg</span></h3>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-[#8e8e93] uppercase mb-1">BMI Est.</p>
              <h3 className="text-xl font-black text-[#BBF246]">{bmi} <span className="text-[10px] bg-[#BBF246]/20 px-2 py-0.5 rounded ml-1">Normal</span></h3>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-[#8e8e93] uppercase mb-1">Lean Body Mass</p>
              <h3 className="text-xl font-black text-[#BBF246]">{lbm} <span className="text-xs font-normal text-[#8e8e93]">kg</span></h3>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-bold text-[#8e8e93] uppercase mb-1">Days Tracked</p>
              <h3 className="text-xl font-black text-[#BBF246]">{data.length} <span className="text-xs font-normal text-[#8e8e93]">days</span></h3>
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg">Weight Progression</h4>
              <Button variant="ghost" className="text-[10px]" onClick={() => {
                const w = prompt("Enter weight (kg):");
                if (w) onAddEntry(parseFloat(w));
              }}>+ Log Weight</Button>
            </div>
            <div className="h-64 w-full bg-black/20 rounded-2xl p-4 border border-white/5">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#BBF246" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#BBF246" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                  <XAxis dataKey="date" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '12px' }}
                    itemStyle={{ color: '#BBF246' }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#BBF246" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-lg">Progress Photos</h4>
              <Button variant="ghost" className="text-[10px]" onClick={() => {
                const url = prompt("Enter photo URL:", "https://images.unsplash.com/photo-1517836357463-d25dfeac3438");
                if (url) onAddPhoto(url);
              }}>+ Upload Photo</Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.length === 0 ? (
                <div className="col-span-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-[#444]">
                  <Camera size={24} className="mb-2" />
                  <p className="text-xs">No photos yet</p>
                </div>
              ) : (
                photos.map(p => (
                  <div key={p.id} className="aspect-square bg-white/5 rounded-2xl overflow-hidden border border-white/10 group relative">
                    <img src={p.url} alt="Progress" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all shrink-0" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <span className="text-[8px] font-bold uppercase">{p.date}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <footer className="p-6 bg-white/5 border-t border-white/5">
          <Button className="w-full h-12" variant="primary" onClick={onClose}>Done</Button>
        </footer>
        {/* Exercise Detail Modal */}
        <AnimatePresence>
          {activeExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
              onClick={() => setActiveExercise(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-[#1a1a1a] w-full max-w-lg max-h-[90vh] rounded-3xl overflow-y-auto border border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative h-64 w-full">
                  {activeExercise.videoUrl ? (
                    <iframe
                      width="100%"
                      height="100%"
                      src={activeExercise.videoUrl}
                      title={activeExercise.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <img src={activeExercise.image} alt={activeExercise.name} className="absolute inset-0 w-full h-full object-cover" />
                  )}

                  <button
                    onClick={() => setActiveExercise(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors backdrop-blur-sm"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black bg-[#BBF246] text-black px-2 py-0.5 rounded uppercase tracking-widest">{activeExercise.cat}</span>
                      <span className="text-[10px] font-bold text-white/60 border border-white/10 px-2 py-0.5 rounded uppercase tracking-widest">{activeExercise.lvl}</span>
                    </div>
                    <h2 className="text-3xl font-black italic uppercase">{activeExercise.name}</h2>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bold text-sm text-[#8e8e93] uppercase tracking-widest flex items-center gap-2">
                      <Activity size={14} /> Muscles Targeted
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeExercise.muscles.map(m => (
                        <span key={m} className="text-xs font-bold bg-white/5 border border-white/5 px-3 py-1.5 rounded-lg text-white/90">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 bg-[#BBF246]/5 p-4 rounded-2xl border border-[#BBF246]/10">
                    <h3 className="font-bold text-sm text-[#BBF246] uppercase tracking-widest flex items-center gap-2">
                      <Zap size={14} /> Benefits
                    </h3>
                    <p className="text-sm text-[#8e8e93] leading-relaxed">
                      {activeExercise.benefits}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      );
};

      const Track = ({onSave}: {onSave: (exercises: ExerciseSession[]) => void }) => {
  const [exercises, setExercises] = useState<ExerciseSession[]>([]);

  const addExercise = (name: string, category: string, image?: string) => {
    const newExercise: ExerciseSession = {
        id: Math.random().toString(36).substr(2, 9),
      name,
      category,
      image,
      sets: [{id: '1', weight: '', reps: '', isCompleted: false }]
    };
      setExercises([...exercises, newExercise]);
  };

      const startPreset = (presetExercises: {name: string, category: string, image?: string }[]) => {
    const newExercises = presetExercises.map(ex => ({
        id: Math.random().toString(36).substr(2, 9),
      name: ex.name,
      category: ex.category,
      image: ex.image,
      sets: [{id: '1', weight: '', reps: '', isCompleted: false }]
    }));
      setExercises(newExercises);
  };

  const addSet = (exerciseId: string) => {
        setExercises(exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: [...ex.sets, {
                id: (ex.sets.length + 1).toString(),
                weight: ex.sets[ex.sets.length - 1]?.weight || '',
                reps: ex.sets[ex.sets.length - 1]?.reps || '',
                isCompleted: false
              }]
            };
          }
          return ex;
        }));
  };

  const updateSet = (exerciseId: string, setId: string, field: 'weight' | 'reps', value: string) => {
        setExercises(exercises.map((ex: ExerciseSession) => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map((s: Set) => s.id === setId ? { ...s, [field]: value } : s)
            };
          }
          return ex;
        }));
  };

  const toggleSetCompletion = (exerciseId: string, setId: string) => {
        setExercises(exercises.map((ex: ExerciseSession) => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map((s: Set) => s.id === setId ? { ...s, isCompleted: !s.isCompleted } : s)
            };
          }
          return ex;
        }));
  };

  const removeExercise = (exerciseId: string) => {
        setExercises(exercises.filter(ex => ex.id !== exerciseId));
  };

      return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Track Workout</h1>
          <Button variant="ghost" onClick={() => setExercises([])}>Cancel</Button>
        </header>

        {exercises.length === 0 ? (
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-[#8e8e93] uppercase tracking-widest px-1">Choose a Routine</h2>
              <div className="grid grid-cols-1 gap-3">
                {ROUTINES.map(p => (
                  <button
                    key={p.name}
                    onClick={() => startPreset(p.exercises)}
                    className="relative h-28 w-full rounded-2xl overflow-hidden group border border-white/10 hover:border-[#BBF246]/50 transition-all text-left"
                  >
                    <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent p-5 flex flex-col justify-center">
                      <h3 className="font-black text-lg italic text-white uppercase tracking-tight">{p.name}</h3>
                      <p className="text-[10px] font-bold text-[#BBF246]">{p.exercises.length} EXERCISES</p>
                    </div>
                    <ChevronRight size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#444] group-hover:text-[#BBF246] transition-colors" />
                  </button>
                ))}
              </div>
            </section>

            <Card className="flex flex-col items-center justify-center py-12 text-center space-y-4 border-dashed border-white/10">
              <div className="bg-[#BBF246]/10 p-4 rounded-full">
                <PlusCircle size={32} className="text-[#BBF246]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Custom Session</h2>
                <p className="text-sm text-[#8e8e93]">Build your own workout from scratch</p>
              </div>
              <div className="grid grid-cols-2 gap-2 w-full pt-4">
                <Button variant="secondary" className="text-[10px]" onClick={() => addExercise('Bench Press', 'Chest')}>+ Bench Press</Button>
                <Button variant="secondary" className="text-[10px]" onClick={() => addExercise('Squats', 'Legs')}>+ Squats</Button>
                <Button variant="secondary" className="text-[10px]" onClick={() => addExercise('Deadlift', 'Back')}>+ Deadlift</Button>
                <Button variant="secondary" className="text-[10px]" onClick={() => addExercise('Pull Ups', 'Back')}>+ Pull Ups</Button>
              </div>
            </Card>
          </div>
        ) : (
          exercises.map((ex) => (
            <Card key={ex.id} className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-black/50 border border-white/10 shrink-0">
                  {ex.image ? (
                    <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#444]">
                      <Dumbbell size={24} />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{ex.name}</h2>
                  <p className="text-[#8e8e93]">{ex.category}</p>
                </div>
                <button onClick={() => removeExercise(ex.id)}>
                  <MoreHorizontal className="text-[#8e8e93] hover:text-red-500 transition-colors" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-[30px_1fr_60px_60px_30px] gap-2 text-[10px] font-bold text-[#8e8e93] uppercase text-center">
                  <span>Set</span>
                  <span>Previous</span>
                  <span>KG</span>
                  <span>Reps</span>
                  <span></span>
                </div>

                {ex.sets.map((set, idx) => (
                  <div key={set.id} className="grid grid-cols-[30px_1fr_60px_60px_30px] gap-2 items-center text-center">
                    <span className="font-bold">{idx + 1}</span>
                    <span className="text-xs text-[#8e8e93]">--</span>
                    <input
                      className={`bg-black/50 rounded-md h-8 text-center text-sm font-bold border outline-none transition-colors ${set.isCompleted ? 'border-[#BBF246] text-[#BBF246]' : 'border-white/5 focus:border-[#BBF246]'
                        }`}
                      value={set.weight}
                      onChange={(e) => updateSet(ex.id, set.id, 'weight', e.target.value)}
                      placeholder="0"
                    />
                    <input
                      className={`bg-black/50 rounded-md h-8 text-center text-sm font-bold border outline-none transition-colors ${set.isCompleted ? 'border-[#BBF246] text-[#BBF246]' : 'border-white/5 focus:border-[#BBF246]'
                        }`}
                      value={set.reps}
                      onChange={(e) => updateSet(ex.id, set.id, 'reps', e.target.value)}
                      placeholder="0"
                    />
                    <button onClick={() => toggleSetCompletion(ex.id, set.id)}>
                      <CheckCircle2
                        size={20}
                        className={set.isCompleted ? 'text-[#BBF246]' : 'text-[#8e8e93]'}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full text-xs" onClick={() => addSet(ex.id)}>+ ADD SET</Button>
            </Card>
          ))
        )}

        {exercises.length > 0 && (
          <div className="space-y-4">
            <Button variant="secondary" className="w-full h-12" onClick={() => addExercise('New Exercise', 'Custom')}>
              + ADD EXERCISE
            </Button>
            <Button className="w-full h-14" onClick={() => {
              onSave(exercises);
              setExercises([]);
            }}>
              FINISH WORKOUT
            </Button>
          </div>
        )}
      </motion.div>
      );
};

      const WorkoutHistory = ({workouts}: {workouts: Workout[] }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
      const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  const processDailyData = () => {
    const last14Days = Array.from({length: 14 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

      const counts: Record<string, number> = { };
    workouts.forEach(w => {
      const dateKey = w.date.split('T')[0];
      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return last14Days.map(date => ({
        label: new Date(date).toLocaleDateString('en-US', {weekday: 'short', day: 'numeric' }),
      count: counts[date] || 0,
      fullDate: date
    }));
  };

  const processMonthlyData = () => {
    const months = Array.from({length: 6 }).map((_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        month: d.getMonth(),
      year: d.getFullYear(),
      label: d.toLocaleDateString('en-US', {month: 'short' })
      };
    }).reverse();

      const counts: Record<string, number> = { };
    workouts.forEach(w => {
      const d = new Date(w.date);
      const key = `${d.getMonth()}-${d.getFullYear()}`;
      counts[key] = (counts[key] || 0) + 1;
    });

    return months.map(m => ({
        label: m.label,
      count: counts[`${m.month}-${m.year}`] || 0
    }));
  };

      const chartData = viewMode === 'daily' ? processDailyData() : processMonthlyData();
  const totalVolumeAll = workouts.reduce((acc, w) => acc + w.totalVolume, 0);
  const avgDuration = workouts.length ? Math.round(workouts.reduce((acc, w) => acc + parseInt(w.duration), 0) / workouts.length) : 0;

  const formatDate = (iso: string) => {
    const d = new Date(iso);
      const now = new Date();
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);

      if (diff === 0) return 'Today';
      if (diff === 1) return 'Yesterday';
      if (diff < 7) return `${diff} days ago`;
      return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric' });
  };

      return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8"
      >
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">Training History</h1>
            <p className="text-xs text-[#8e8e93]">Cumulative tracking and metrics</p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'daily' ? 'bg-[#BBF246] text-black shadow-lg' : 'text-[#8e8e93]'}`}
            >Daily</button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewMode === 'monthly' ? 'bg-[#BBF246] text-black shadow-lg' : 'text-[#8e8e93]'}`}
            >Monthly</button>
          </div>
        </header>

        {workouts.length > 0 && (
          <section className="space-y-4">
            <Card className="p-0 border-white/10 overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-black">
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em]">Frequency Analysis</h3>
                <Activity className="text-[#BBF246]" size={16} />
              </div>
              <div className="h-48 w-full p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                    <XAxis
                      dataKey="label"
                      stroke="#444"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      interval={viewMode === 'daily' ? 2 : 0}
                    />
                    <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: 'rgba(187, 242, 70, 0.05)' }}
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                      itemStyle={{ color: '#BBF246' }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#BBF246' : '#222'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-[#BBF246]/5 border-[#BBF246]/10 p-4">
                <p className="text-[8px] font-black text-[#BBF246] uppercase tracking-widest mb-1">Lifetime Volume</p>
                <h3 className="text-xl font-black">{(totalVolumeAll / 1000).toFixed(1)} <span className="text-[10px] font-normal text-[#8e8e93]">TONS</span></h3>
              </Card>
              <Card className="bg-white/5 border-white/5 p-4">
                <p className="text-[8px] font-black text-[#8e8e93] uppercase tracking-widest mb-1">Avg. Duration</p>
                <h3 className="text-xl font-black">{avgDuration} <span className="text-[10px] font-normal text-[#8e8e93]">MINS</span></h3>
              </Card>
            </div>
          </section>
        )}

        <div className="space-y-4">
          <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white/10"></div>
            Logs
          </h2>
          {workouts.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="bg-[#BBF246]/10 p-4 rounded-full">
                <HistoryIcon size={32} className="text-[#8e8e93]" />
              </div>
              <p className="text-sm text-[#8e8e93]">No sessions available yet.<br />Train hard to see your results.</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {workouts.map((w) => (
                <Card
                  key={w.id}
                  onClick={() => setSelectedWorkout(w)}
                  className="flex justify-between items-center group cursor-pointer hover:border-[#BBF246]/30 transition-all border-white/5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black bg-[#BBF246] text-black px-1.5 py-0.5 rounded italic uppercase">{formatDate(w.date)}</span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#BBF246] transition-colors">{w.name}</h3>
                    </div>
                    <div className="flex gap-4 opacity-50">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#8e8e93] uppercase tracking-tighter"><Clock size={10} /> {w.duration}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#8e8e93] uppercase tracking-tighter"><Dumbbell size={10} /> {w.totalVolume.toLocaleString()} kg</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-[#8e8e93] uppercase tracking-tighter"><Zap size={10} /> {w.exerciseCount} exs</span>
                    </div>
                  </div>
                  <ChevronRight className="text-[#444] group-hover:text-[#BBF246] transition-transform group-hover:translate-x-1" size={20} />
                </Card>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedWorkout && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-md"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-[#0f0f0f] w-full max-w-xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col border border-white/10 shadow-2xl"
              >
                <header className="p-8 border-b border-white/5 flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 rounded bg-[#BBF246]/20 text-[#BBF246] text-[9px] font-black uppercase tracking-widest border border-[#BBF246]/30">Completed</span>
                      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{new Date(selectedWorkout.date).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight uppercase italic tracking-tighter">{selectedWorkout.name}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedWorkout(null)}
                    className="p-2 bg-white/5 text-white rounded-full hover:bg-white/10 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1">Time</p>
                      <p className="font-bold text-sm">{selectedWorkout.duration}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1">Volume</p>
                      <p className="font-bold text-sm">{selectedWorkout.totalVolume.toLocaleString()}kg</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-[#444] uppercase tracking-widest mb-1">Movements</p>
                      <p className="font-bold text-sm">{selectedWorkout.exerciseCount}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {selectedWorkout.exercises.map((ex, idx) => (
                      <div key={ex.id} className="space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-[#BBF246] text-black text-[10px] font-black flex items-center justify-center italic">{idx + 1}</span>
                          <h4 className="font-black text-lg uppercase italic text-white/90">{ex.name}</h4>
                        </div>
                        <div className="pl-9 space-y-2">
                          {ex.sets.map((set, setIdx) => (
                            <div key={set.id} className="flex items-center justify-between py-2 border-b border-white/5">
                              <span className="text-[10px] font-bold text-[#444]">SET {setIdx + 1}</span>
                              <div className="flex gap-4">
                                <span className="text-sm font-bold text-white/80">{set.weight} <span className="text-[9px] font-normal text-[#444]">KG</span></span>
                                <span className="text-sm font-bold text-white/80">{set.reps} <span className="text-[9px] font-normal text-[#444]">REPS</span></span>
                              </div>
                              <CheckCircle2 size={14} className="text-[#BBF246]/50" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    {selectedWorkout.exercises.length === 0 && (
                      <div className="py-12 text-center space-y-4">
                        <Library className="mx-auto text-[#444]" size={40} />
                        <p className="text-sm text-[#444] italic">Detailed exercise data not available for this session legacy log.</p>
                      </div>
                    )}
                  </div>
                </div>

                <footer className="p-8 bg-[#151515] border-t border-white/5">
                  <Button className="w-full h-14 rounded-2xl" variant="secondary" onClick={() => setSelectedWorkout(null)}>
                    CLOSE SUMMARY
                  </Button>
                </footer>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      );
};

      const Timer = ({
        seconds,
        totalSeconds,
        isActive,
        onToggle,
        onReset,
        onSelectPreset,
        onAdjustTime
      }: {
        seconds: number,
      totalSeconds: number,
      isActive: boolean,
  onToggle: () => void,
  onReset: () => void,
  onSelectPreset: (time: number) => void,
  onAdjustTime: (amount: number) => void
}) => {

  const presets = [
      {label: 'Strength', time: 180 },
      {label: 'Power', time: 150 },
      {label: 'Growth', time: 90 },
      {label: 'Pump', time: 60 },
      {label: 'Endure', time: 30 },
      ];

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
      const secs = total % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

      const progress = (seconds / totalSeconds) * 753; // 753 is the path length for r=120


      return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-12 py-8"
      >
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Rest Timer</h1>
          <p className="text-sm text-[#8e8e93]">Recover for your next set</p>
        </header>

        <div className="flex flex-col items-center justify-center space-y-12">
          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                className="text-white/5"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
                r="120"
                cx="128"
                cy="128"
              />
              <motion.circle
                className="text-[#BBF246]"
                strokeWidth="8"
                strokeDasharray={753}
                animate={{ strokeDashoffset: 753 - progress }}
                transition={{ duration: 1, ease: "linear" }}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="120"
                cx="128"
                cy="128"
              />
            </svg>
            <div className="text-center z-10">
              <span className="text-6xl font-black font-mono tracking-tighter antialiased">
                {formatTime(seconds)}
              </span>
              <AnimatePresence>
                {isActive && (
                  <motion.p
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#BBF246] font-bold text-xs mt-2 tracking-widest uppercase"
                  >
                    Running
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
            {presets.map((p) => (
              <button
                key={p.label}
                onClick={() => onSelectPreset(p.time)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${totalSeconds === p.time
                  ? 'bg-[#BBF246]/10 border-[#BBF246] text-[#BBF246]'
                  : 'bg-[#1a1a1a] border-white/5 text-[#8e8e93] hover:border-white/20'
                  }`}
              >
                <span className="text-[10px] font-black uppercase tracking-tighter">{p.label}</span>
                <span className="text-xs font-bold">{p.time}s</span>
              </button>
            ))}
            <button
              onClick={() => {
                const custom = prompt("Enter seconds:", totalSeconds.toString());
                if (custom) onSelectPreset(parseInt(custom));
              }}
              className="p-3 rounded-xl border border-white/5 bg-[#1a1a1a] text-[#8e8e93] flex flex-col items-center justify-center hover:border-[#BBF246]/50"
            >
              <Plus size={14} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Custom</span>
            </button>
          </div>

          <div className="flex items-center gap-8">
            <button onClick={onReset} className="p-4 rounded-full bg-[#1a1a1a] border border-white/10 hover:bg-white/5 transition-all">
              <RotateCcw size={24} />
            </button>

            <button
              onClick={onToggle}
              className={`p-8 rounded-full shadow-2xl transition-all ${isActive ? 'bg-white text-black' : 'bg-[#BBF246] text-black'}`}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>

            <button onClick={() => onAdjustTime(15)} className="p-4 rounded-full bg-[#1a1a1a] border border-white/10 hover:bg-white/5 transition-all">
              <div className="flex flex-col items-center">
                <Plus size={16} />
                <span className="text-[10px] font-bold">15s</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>
      );
};

const ExerciseLibrary = () => {
  const [search, setSearch] = useState('');
      const [category, setCategory] = useState('All');
      const [libTab, setLibTab] = useState<'movements' | 'routines'>('movements');
      const [activeExercise, setActiveExercise] = useState<typeof EXERCISES[0] | null>(null);

      const categories = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Mobility'];

  const filteredExercises = EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = category === 'All' || ex.cat === category;
      return matchesSearch && matchesCat;
  });

      return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6 pb-4"
      >
        <header className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Library</h1>
          <div className="flex bg-[#1a1a1a] rounded-lg p-1 border border-white/5">
            <button
              onClick={() => setLibTab('movements')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${libTab === 'movements' ? 'bg-[#BBF246] text-black shadow-lg' : 'text-[#8e8e93]'}`}
            >Movements</button>
            <button
              onClick={() => setLibTab('routines')}
              className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all ${libTab === 'routines' ? 'bg-[#BBF246] text-black shadow-lg' : 'text-[#8e8e93]'}`}
            >Routines</button>
          </div>
        </header>

        {libTab === 'movements' ? (
          <>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8e8e93]" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#BBF246]/50 placeholder:text-[#444]"
                placeholder="Search movements..."
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${category === c ? 'bg-[#BBF246] text-black' : 'bg-[#1a1a1a] text-white border border-white/10 hover:border-white/30'}`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {filteredExercises.map((e) => (
                  <motion.div
                    layout
                    key={e.name}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                  >
                    <Card
                      className="flex flex-col gap-4 group cursor-pointer border border-white/5 hover:border-[#BBF246]/30 transition-all shadow-sm"
                      onClick={() => setActiveExercise(e)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-black/50 rounded-xl overflow-hidden flex items-center justify-center border border-white/5">
                          <img src={e.image} alt={e.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold">{e.name}</h3>
                          <p className="text-xs text-[#8e8e93]">{e.cat} • {e.lvl}</p>
                        </div>
                        <ChevronRight className="text-[#444] group-hover:text-[#BBF246] transition-colors" size={20} />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            {ROUTINES.map(p => (
              <div
                key={p.name}
                className="relative h-48 w-full rounded-2xl overflow-hidden border border-white/5 shadow-2xl group"
              >
                <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-6 flex flex-col justify-end">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-[#BBF246] uppercase tracking-widest">{p.exercises.length} Exercises Included</p>
                    <h3 className="font-black text-2xl text-white uppercase italic tracking-tight">{p.name}</h3>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {p.exercises.slice(0, 3).map(ex => (
                        <span key={ex.name} className="text-[8px] font-bold bg-white/10 backdrop-blur-md px-2 py-1 rounded border border-white/5 uppercase tracking-tighter">{ex.name}</span>
                      ))}
                      {p.exercises.length > 3 && <span className="text-[8px] font-bold text-[#8e8e93] mt-1">+{p.exercises.length - 3} more</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Visibility Modal */}
        <AnimatePresence>
          {activeExercise && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/95 backdrop-blur-md"
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="bg-[#0f0f0f] w-full max-w-xl h-[90vh] sm:h-auto sm:max-h-[90vh] rounded-t-[40px] sm:rounded-[40px] overflow-hidden flex flex-col border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]"
              >
                <div className="relative h-80 w-full shrink-0">
                  <img src={activeExercise.image} alt={activeExercise.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
                  <button
                    onClick={() => setActiveExercise(null)}
                    className="absolute top-6 right-6 p-2 bg-black/60 text-white rounded-full backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <X size={24} />
                  </button>
                  <div className="absolute bottom-6 left-8 right-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-[#BBF246]/20 text-[#BBF246] text-[9px] font-black uppercase tracking-widest border border-[#BBF246]/30">{activeExercise.lvl}</span>
                      <span className="px-2 py-0.5 rounded bg-white/5 text-white/50 text-[9px] font-black uppercase tracking-widest border border-white/5">{activeExercise.cat}</span>
                    </div>
                    <h2 className="text-4xl font-black text-white leading-tight uppercase italic tracking-tighter">{activeExercise.name}</h2>
                  </div>
                </div>

                <div className="p-8 space-y-8 flex-1 overflow-y-auto no-scrollbar">
                  <section className="space-y-4">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-8 h-[1px] bg-white/10"></div>
                      Targeted Muscles
                    </h4>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {activeExercise.muscles.map((m: string) => (
                        <span key={m} className="px-4 py-2 bg-white/5 rounded-2xl text-xs font-bold text-white border border-white/5 transition-all hover:bg-[#BBF246]/10 hover:border-[#BBF246]/30 hover:text-[#BBF246]">{m}</span>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-4 pb-8">
                    <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                      <div className="w-8 h-[1px] bg-white/10"></div>
                      Health & Benefits
                    </h4>
                    <p className="text-base leading-relaxed text-[#8e8e93] font-medium italic">
                      &quot;{activeExercise.benefits}&quot;
                    </p>
                  </section>
                </div>

                <footer className="p-8 bg-[#151515] border-t border-white/5">
                  <Button className="w-full h-16 text-lg rounded-[20px] shadow-[0_10px_30px_rgba(187,242,70,0.2)]" variant="primary" onClick={() => setActiveExercise(null)}>
                    CLOSE & START TRAINING
                  </Button>
                </footer>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      );
};

      const ProfileView = ({profile, onUpdate}: {profile: UserProfile, onUpdate: (p: UserProfile) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
      const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
        onUpdate(tempProfile);
      setIsEditing(false);
  };

  const toggleSetting = (key: 'publicProfile' | 'notifications') => {
    const newVal = !tempProfile[key];
      const updated = {...tempProfile, [key]: newVal };
      setTempProfile(updated);
      if (!isEditing) {
        onUpdate(updated);
    }
  };

      return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8 pb-12"
      >
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">My Account</h1>
            <p className="text-xs text-[#8e8e93]">Manage your biometric & contact data</p>
          </div>
          <Button variant="ghost" className="text-xs" onClick={() => isEditing ? handleSave() : setIsEditing(true)}>
            {isEditing ? 'SAVE CHANGES' : 'EDIT PROFILE'}
          </Button>
        </header>

        <section className="flex flex-col items-center gap-6">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-2 border-[#BBF246] p-1 bg-black shadow-2xl">
              <img src={tempProfile.avatar} alt="Profile" className="w-full h-full object-cover rounded-[32px]" />
            </div>
            {isEditing && (
              <button
                className="absolute -bottom-2 -right-2 p-3 bg-[#BBF246] text-black rounded-2xl shadow-xl hover:scale-110 transition-transform"
                onClick={() => {
                  const url = prompt("Enter Image URL:");
                  if (url) setTempProfile({ ...tempProfile, avatar: url });
                }}
              >
                <Camera size={18} />
              </button>
            )}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">{profile.name}</h2>
            <p className="text-sm text-[#BBF246] font-bold">Elite Member • Level 24</p>
          </div>
        </section>

        <Card className="space-y-6 bg-gradient-to-br from-[#1a1a1a] to-black border-white/10">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#444] uppercase tracking-widest flex items-center gap-2">
                <User size={12} className="text-[#BBF246]" /> Full Name
              </label>
              {isEditing ? (
                <input
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BBF246] outline-none transition-colors"
                  value={tempProfile.name}
                  onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })}
                />
              ) : (
                <p className="text-sm font-bold pl-1">{profile.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#444] uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} className="text-[#BBF246]" /> Email Address
                </label>
                {isEditing ? (
                  <input
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BBF246] outline-none transition-colors"
                    value={tempProfile.email}
                    onChange={e => setTempProfile({ ...tempProfile, email: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-bold pl-1 truncate">{profile.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#444] uppercase tracking-widest flex items-center gap-2">
                  <Phone size={12} className="text-[#BBF246]" /> Phone Number
                </label>
                {isEditing ? (
                  <input
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BBF246] outline-none transition-colors"
                    value={tempProfile.phone}
                    onChange={e => setTempProfile({ ...tempProfile, phone: e.target.value })}
                  />
                ) : (
                  <p className="text-sm font-bold pl-1">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#444] uppercase tracking-widest flex items-center gap-2">
                  <Ruler size={12} className="text-[#BBF246]" /> Height
                </label>
                <div className="relative">
                  {isEditing ? (
                    <input
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BBF246] outline-none transition-colors"
                      value={tempProfile.height}
                      onChange={e => setTempProfile({ ...tempProfile, height: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-bold pl-1">{profile.height} <span className="text-[10px] text-[#444] font-normal italic">cm</span></p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#444] uppercase tracking-widest flex items-center gap-2">
                  <Dumbbell size={12} className="text-[#BBF246]" /> Current Weight
                </label>
                <div className="relative">
                  {isEditing ? (
                    <input
                      className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-[#BBF246] outline-none transition-colors"
                      value={tempProfile.weight}
                      onChange={e => setTempProfile({ ...tempProfile, weight: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm font-bold pl-1">{profile.weight} <span className="text-[10px] text-[#444] font-normal italic">kg</span></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <section className="space-y-4">
          <h3 className="text-xs font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className="w-8 h-[1px] bg-white/10"></div>
            Membership Settings
          </h3>
          <Card className="p-4 border-white/5 bg-white/5 space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm font-bold">Public Profile</span>
              <button
                onClick={() => toggleSetting('publicProfile')}
                className={`w-10 h-5 rounded-full transition-colors flex items-center ${tempProfile.publicProfile ? 'bg-[#BBF246]' : 'bg-white/10'} p-1`}
              >
                <motion.div
                  animate={{ x: tempProfile.publicProfile ? 20 : 0 }}
                  className="w-3 h-3 bg-black rounded-full"
                />
              </button>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-white/5">
              <span className="text-sm font-bold">App Notifications</span>
              <button
                onClick={() => toggleSetting('notifications')}
                className={`w-10 h-5 rounded-full transition-colors flex items-center ${tempProfile.notifications ? 'bg-[#BBF246]' : 'bg-white/10'} p-1`}
              >
                <motion.div
                  animate={{ x: tempProfile.notifications ? 20 : 0 }}
                  className="w-3 h-3 bg-black rounded-full"
                />
              </button>
            </div>
          </Card>
        </section>

        {isEditing && (
          <Button className="w-full h-14 rounded-2xl" onClick={handleSave}>
            APPLY BIOMETRIC UPDATES
          </Button>
        )}
      </motion.div>
      );
};

const DietChart = () => {
  const [selectedDay, setSelectedDay] = useState(0);
      const plan = DIET_PLAN[selectedDay];

      return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-8 pb-4"
      >
        <header className="space-y-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Utensils className="text-[#BBF246]" size={24} />
            Gym Diet Plan
          </h1>
          <p className="text-sm text-[#8e8e93]">Fuel your workouts with a 7-day structured meal chart.</p>
        </header>

        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {DIET_PLAN.map((d, idx) => (
            <button
              key={d.label}
              onClick={() => setSelectedDay(idx)}
              className={`flex flex-col items-center min-w-[60px] py-4 rounded-2xl border transition-all ${selectedDay === idx ? 'bg-[#BBF246] border-[#BBF246] text-black shadow-[0_0_20px_rgba(187,242,70,0.2)]' : 'bg-[#1a1a1a] border-white/5 text-[#8e8e93] hover:border-white/10'}`}
            >
              <span className="text-[10px] font-black uppercase tracking-tighter mb-1">{d.label}</span>
              <span className="text-lg font-black italic">{idx + 1}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Card className="p-0 overflow-hidden border-white/10 flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 bg-gradient-to-br from-[#BBF246]/10 to-transparent p-6 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/5">
              <Coffee className="text-[#BBF246] mb-2" size={24} />
              <h3 className="font-black text-xs uppercase tracking-widest text-[#BBF246]">Breakfast</h3>
            </div>
            <div className="p-6 flex-1">
              <p className="text-sm font-bold leading-relaxed">{plan.meals.breakfast}</p>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-white/10 flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 bg-gradient-to-br from-[#BBF246]/10 to-transparent p-6 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/5">
              <Sun className="text-[#BBF246] mb-2" size={24} />
              <h3 className="font-black text-xs uppercase tracking-widest text-[#BBF246]">Lunch</h3>
            </div>
            <div className="p-6 flex-1">
              <p className="text-sm font-bold leading-relaxed">{plan.meals.lunch}</p>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-white/10 flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 bg-gradient-to-br from-[#BBF246]/10 to-transparent p-6 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/5">
              <Apple className="text-[#BBF246] mb-2" size={24} />
              <h3 className="font-black text-xs uppercase tracking-widest text-[#BBF246]">Snack</h3>
            </div>
            <div className="p-6 flex-1">
              <p className="text-sm font-bold leading-relaxed">{plan.meals.snacks}</p>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden border-white/10 flex flex-col sm:flex-row">
            <div className="w-full sm:w-48 bg-gradient-to-br from-[#BBF246]/10 to-transparent p-6 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-white/5">
              <Moon className="text-[#BBF246] mb-2" size={24} />
              <h3 className="font-black text-xs uppercase tracking-widest text-[#BBF246]">Dinner</h3>
            </div>
            <div className="p-6 flex-1">
              <p className="text-sm font-bold leading-relaxed">{plan.meals.dinner}</p>
            </div>
          </Card>
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Zap className="text-[#BBF246]" size={20} />
            Gym Performance Tips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="bg-[#BBF246]/5 border-[#BBF246]/10 p-5">
              <h4 className="font-black text-[10px] uppercase tracking-widest text-[#BBF246] mb-3">Pre-Workout</h4>
              <p className="text-xs text-[#8e8e93] leading-relaxed">Consume <b>Bananas, Oats, or Whole Grain Bread</b> 30-60 mins before training for sustained energy release.</p>
            </Card>
            <Card className="bg-[#BBF246]/5 border-[#BBF246]/10 p-5">
              <h4 className="font-black text-[10px] uppercase tracking-widest text-[#BBF246] mb-3">Post-Workout</h4>
              <p className="text-xs text-[#8e8e93] leading-relaxed">Eat <b>Protein Powder, Chicken, or Eggs</b> within 45 mins after gym to repair muscle tissues instantly.</p>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-red-500">
            <TriangleAlert size={20} />
            <h2 className="text-xl font-bold">Foods to Avoid</h2>
          </div>
          <Card className="border-red-500/20 bg-red-500/5 p-6">
            <div className="space-y-4">
              {[
                { title: 'Alcohol', desc: 'Hardens muscle building and fat loss. Increases BP and affects heart health.' },
                { title: 'Sugary Drinks', desc: 'Causes insulin spikes leading to rapid fat storage and energy crashes.' },
                { title: 'Fried Foods', desc: 'High in unhealthy oils and refined flour. Leads to inflammation.' }
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-red-400">{item.title}</h4>
                    <p className="text-xs text-[#8e8e93]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>
      </motion.div>
      );
};

      const WatchModal = ({
        isOpen,
        onClose,
        onConnect,
        isConnected,
}: {
        isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
      isConnected: boolean;
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = () => {
        setIsConnecting(true);
    setTimeout(() => {
        setIsConnecting(false);
      onConnect();
    }, 2000);
  };

      if (!isOpen) return null;

      return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#111] w-full max-w-sm rounded-[40px] overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="p-8 text-center space-y-6">
            <div className="relative flex justify-center">
              <div className="absolute inset-0 bg-[#BBF246]/10 blur-3xl rounded-full" />
              <div className={`p-6 rounded-full bg-white/5 border border-white/10 relative transition-transform duration-500 ${isConnecting ? 'animate-pulse' : ''}`}>
                <Watch className={isConnected ? 'text-[#BBF246]' : 'text-white'} size={48} />
              </div>
              {isConnecting && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <Bluetooth size={80} className="text-[#BBF246]/20" />
                </motion.div>
              )}
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                {isConnected ? 'CONNECTED' : isConnecting ? 'DISCOVERING...' : 'SYNC SMARTWATCH'}
              </h2>
              <p className="text-xs text-[#8e8e93] leading-relaxed">
                {isConnected
                  ? 'System paired with Ultra Pro 2. Heart rate and biometric data now syncing in real-time.'
                  : 'Ensure Bluetooth is active on your device. We support Apple Watch, Garmin, and WearOS platforms.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] mb-1">Signal Status</p>
                <p className={`font-bold text-xs ${isConnected ? 'text-green-500' : 'text-[#8e8e93]'}`}>
                  {isConnected ? 'Strong' : 'Idle'}
                </p>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
                <p className="text-[8px] font-black text-[#444] uppercase tracking-[0.2em] mb-1">Auto-Sync</p>
                <p className="font-bold text-xs text-[#BBF246]">Enabled</p>
              </div>
            </div>

            <footer className="pt-6 flex flex-col gap-3">
              {!isConnected ? (
                <Button
                  className="w-full h-14 rounded-2xl"
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'PAIRING...' : 'SEARCH DEVICES'}
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full h-14 rounded-2xl"
                  onClick={onConnect}
                >
                  DISCONNECT DEVICE
                </Button>
              )}
              <Button variant="ghost" className="text-[10px]" onClick={onClose}>BACK TO DASHBOARD</Button>
            </footer>
          </div>
        </motion.div>
      </motion.div>
      );
};


      // --- Main Page ---

      export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
      const [userProfile, setUserProfile] = useState<UserProfile>({
        name: 'Pranav',
        email: 'pranav.fit@example.com',
        phone: '+91 98765-43210',
        height: '182',
        weight: '80.2',
        avatar: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=400',
        publicProfile: true,
        notifications: true
  });
        const [completedWorkouts, setCompletedWorkouts] = useState<Workout[]>([
        {id: 'h1', name: 'Back & Biceps', date: new Date(Date.now() - 86400000 * 0).toISOString(), duration: '55m', totalVolume: 12400, exerciseCount: 6, exercises: [] },
        {id: 'h2', name: 'Chest & Triceps', date: new Date(Date.now() - 86400000 * 1).toISOString(), duration: '45m', totalVolume: 10200, exerciseCount: 5, exercises: [] },
        {id: 'h3', name: 'Leg Day', date: new Date(Date.now() - 86400000 * 3).toISOString(), duration: '65m', totalVolume: 18500, exerciseCount: 7, exercises: [] },
        {id: 'h4', name: 'Shoulders', date: new Date(Date.now() - 86400000 * 5).toISOString(), duration: '40m', totalVolume: 8200, exerciseCount: 5, exercises: [] },
        {id: 'h5', name: 'Leg Day', date: new Date(Date.now() - 86400000 * 8).toISOString(), duration: '60m', totalVolume: 17200, exerciseCount: 6, exercises: [] },
        {id: 'h6', name: 'Full Body', date: new Date(Date.now() - 86400000 * 12).toISOString(), duration: '75m', totalVolume: 14500, exerciseCount: 8, exercises: [] },
        {id: 'h7', name: 'Pull Session', date: new Date(Date.now() - 86400000 * 15).toISOString(), duration: '50m', totalVolume: 11800, exerciseCount: 6, exercises: [] },
        {id: 'h8', name: 'Push Session', date: new Date(Date.now() - 86400000 * 18).toISOString(), duration: '50m', totalVolume: 11200, exerciseCount: 6, exercises: [] },
        {id: 'h9', name: 'Lower Body', date: new Date(Date.now() - 86400000 * 22).toISOString(), duration: '70m', totalVolume: 19100, exerciseCount: 7, exercises: [] },
        {id: 'h10', name: 'Upper Body', date: new Date(Date.now() - 86400000 * 25).toISOString(), duration: '55m', totalVolume: 13200, exerciseCount: 6, exercises: [] },
        {id: 'h11', name: 'Core Blitz', date: new Date(Date.now() - 86400000 * 28).toISOString(), duration: '30m', totalVolume: 4200, exerciseCount: 4, exercises: [] },
        {id: 'h12', name: 'Heavy Squats', date: new Date(Date.now() - 86400000 * 35).toISOString(), duration: '60m', totalVolume: 18000, exerciseCount: 5, exercises: [] },
        {id: 'h13', name: 'Bench Focus', date: new Date(Date.now() - 86400000 * 40).toISOString(), duration: '55m', totalVolume: 12100, exerciseCount: 6, exercises: [] },
        ]);
        const [isProgressOpen, setIsProgressOpen] = useState(false);
        const [isWatchOpen, setIsWatchOpen] = useState(false);
        const [isWatchConnected, setIsWatchConnected] = useState(false);
        const [heartRate, setHeartRate] = useState(72);

        // --- Progress State ---
        const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([
        {date: 'Jan 1', weight: 82.5 },
        {date: 'Jan 8', weight: 81.8 },
        {date: 'Jan 15', weight: 81.5 },
        {date: 'Jan 22', weight: 80.7 },
        {date: 'Jan 27', weight: 80.2 },
        ]);
        const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([
        {id: '1', date: 'Jan 1', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48' },
        {id: '2', date: 'Jan 15', url: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2' },
        ]);

  const addProgressEntry = (weight: number) => {
    const today = new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric' });
        setProgressEntries([...progressEntries, {date: today, weight }]);
  };

  const addProgressPhoto = (url: string) => {
    const today = new Date().toLocaleDateString('en-US', {month: 'short', day: 'numeric' });
        setProgressPhotos([{id: Math.random().toString(), date: today, url }, ...progressPhotos]);
  };

        // --- Lifted Timer State ---
        const [timerSeconds, setTimerSeconds] = useState(90);
        const [totalTimerSeconds, setTotalTimerSeconds] = useState(90);
        const [isTimerActive, setIsTimerActive] = useState(false);
        const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isTimerActive && timerSeconds > 0) {
          timerRef.current = setInterval(() => {
            setTimerSeconds((prev) => prev - 1);
          }, 1000);
    } else if (timerSeconds === 0) {
          setIsTimerActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, timerSeconds]);

  // --- Heart Rate Simulation ---
  useEffect(() => {
    if (isWatchConnected) {
      const interval = setInterval(() => {
          setHeartRate(prev => {
            const move = Math.random() > 0.5 ? 1 : -1;
            const newVal = Math.max(60, Math.min(180, prev + move));
            return newVal;
          });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isWatchConnected]);

  const handleSaveWorkout = (exercises: ExerciseSession[]) => {
    const completedExercises = exercises.filter(ex => ex.sets.some(s => s.isCompleted));
        if (completedExercises.length === 0) {
          alert("No sets were completed!");
        return;
    }

    const totalVolume = exercises.reduce((acc: number, ex: ExerciseSession) => {
      return acc + ex.sets.reduce((setAcc: number, s: Set) => {
        if (!s.isCompleted) return setAcc;
        return setAcc + (parseFloat(s.weight || '0') * parseFloat(s.reps || '0'));
      }, 0);
    }, 0);

        const newWorkout: Workout = {
          id: Math.random().toString(36).substr(2, 9),
        name: exercises[0]?.name ? `${exercises[0].name} Session` : 'Quick Workout',
        date: new Date().toISOString(),
        duration: '45m',
        totalVolume,
        exerciseCount: completedExercises.length,
        exercises: completedExercises
    };

        setCompletedWorkouts([newWorkout, ...completedWorkouts]);
        setActiveTab('history');
  };

        const tabs = [
        {id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        {id: 'track', label: 'Track', icon: Dumbbell },
        {id: 'history', label: 'History', icon: HistoryIcon },
        {id: 'timer', label: 'Timer', icon: TimerIcon },
        {id: 'library', label: 'Library', icon: Library },
        {id: 'diet', label: 'Diet', icon: Utensils },
        {id: 'profile', label: 'Profile', icon: User },
        ];

  const latestWeight = progressEntries.length > 0 ? progressEntries[progressEntries.length - 1].weight : 0;

        return (
        <main className="max-w-2xl mx-auto min-h-screen pb-32 pt-8 px-4">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <Dashboard
                key="dashboard"
                lastWorkout={completedWorkouts[0]}
                timerSeconds={timerSeconds}
                isTimerActive={isTimerActive}
                libraryCount={EXERCISES.length}
                onStartWorkout={() => setActiveTab('track')}
                onOpenProgress={() => setIsProgressOpen(true)}
                onConnectWatch={() => setIsWatchOpen(true)}
                latestWeight={latestWeight}
                isWatchConnected={isWatchConnected}
                heartRate={heartRate}
                userName={userProfile.name}
              />
            )}
            {activeTab === 'track' && <Track key="track" onSave={handleSaveWorkout} />}
            {activeTab === 'history' && <WorkoutHistory key="history" workouts={completedWorkouts} />}
            {activeTab === 'timer' && (
              <Timer
                key="timer"
                seconds={timerSeconds}
                totalSeconds={totalTimerSeconds}
                isActive={isTimerActive}
                onToggle={() => setIsTimerActive(!isTimerActive)}
                onReset={() => {
                  setIsTimerActive(false);
                  setTimerSeconds(totalTimerSeconds);
                }}
                onSelectPreset={(t: number) => {
                  setIsTimerActive(false);
                  setTotalTimerSeconds(t);
                  setTimerSeconds(t);
                }}
                onAdjustTime={(a: number) => {
                  const newTime = Math.max(0, timerSeconds + a);
                  setTimerSeconds(newTime);
                  if (!isTimerActive) setTotalTimerSeconds(newTime);
                }}
              />
            )}
            {activeTab === 'library' && <ExerciseLibrary key="library" />}
            {activeTab === 'diet' && <DietChart />}
            {activeTab === 'profile' && <ProfileView profile={userProfile} onUpdate={setUserProfile} />}
          </AnimatePresence>

          <AnimatePresence>
            {isWatchOpen && (
              <WatchModal
                isOpen={isWatchOpen}
                onClose={() => setIsWatchOpen(false)}
                isConnected={isWatchConnected}
                onConnect={() => {
                  setIsWatchConnected(!isWatchConnected);
                  if (!isWatchConnected) setIsWatchOpen(false);
                }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isProgressOpen && (
              <ProgressModal
                isOpen={isProgressOpen}
                onClose={() => setIsProgressOpen(false)}
                data={progressEntries}
                photos={progressPhotos}
                onAddEntry={addProgressEntry}
                onAddPhoto={addProgressPhoto}
              />
            )}
          </AnimatePresence>

          {/* Navigation Bar */}
          <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg glass rounded-2xl p-2 flex justify-between shadow-2xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all ${isActive ? 'text-[#BBF246]' : 'text-[#8e8e93] hover:text-white'
                    }`}
                >
                  <motion.div
                    animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                  >
                    <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                  </motion.div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </main>
        );
}
