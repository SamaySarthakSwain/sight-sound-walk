import { useState, useRef } from "react";
import Navigation from "@/components/Navigation";
import MoreSubNav from "@/components/MoreSubNav";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Lock, CheckCircle2, XCircle, Sparkles, Scroll, ChevronRight, BookOpen } from "lucide-react";

// ── Web Audio Synth Sound Effects ────────────────────────────────────────────────
const playSoundEffect = (type: "correct" | "incorrect" | "complete") => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!ctx) return;
    const now = ctx.currentTime;
    
    if (type === "correct") {
      // 2-tone pleasant chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.1); // E5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1046.5, now); // C6
      osc2.frequency.setValueAtTime(1318.5, now + 0.1); // E6

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.4);
      osc2.stop(now + 0.4);
    } else if (type === "incorrect") {
      // Dull double thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.15);

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 180;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "complete") {
      // Triumphant major chord arpeggio
      const chord = [261.63, 329.63, 392.00, 523.25]; // C major chord
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = "sine";
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.08 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now + idx * 0.08);
        osc.stop(now + 1.5);
      });
    }
  } catch (err) {
    console.error("Audio error", err);
  }
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface QuestQuestion {
  id: string;
  question: string;
  hint: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface Quest {
  id: string;
  monument: string;
  title: string;
  description: string;
  difficulty: "Novice" | "Explorer" | "Scholar" | "Historian";
  xpReward: number;
  stamp: string;
  stampName: string;
  color: string;
  questions: QuestQuestion[];
  unlocked: boolean;
}

// ── Data ───────────────────────────────────────────────────────────────────────
const QUESTS: Quest[] = [
  {
    id: "konark-wheel",
    monument: "Konark Sun Temple",
    title: "The Celestial Clockmaker",
    description: "Unravel the astronomical genius hidden in the Sun Temple's chariot wheels",
    difficulty: "Explorer",
    xpReward: 250,
    stamp: "☀️",
    stampName: "Konark Solar Sundial Stamp",
    color: "from-amber-500/20 to-orange-500/20",
    unlocked: true,
    questions: [
      {
        id: "q1",
        question: "How many spokes does each main chariot wheel of the Konark Sun Temple have?",
        hint: "Think about how many hours are in a day...",
        options: ["8 spokes", "16 spokes", "24 spokes", "32 spokes"],
        correct: 2,
        explanation: "Each of the 24 main wheels has 24 spokes — one for each hour of the day. The 8 cardinal spokes represent the 8 Praharas (3-hour divisions) of the day."
      },
      {
        id: "q2",
        question: "How many pairs of wheels does the Konark Sun Temple have in total?",
        hint: "It represents the months of the Indian calendar...",
        options: ["6 pairs", "12 pairs", "24 pairs", "36 pairs"],
        correct: 1,
        explanation: "The temple has 12 pairs of wheels — representing the 12 months of the year. Together they create a giant solar calendar that the priests used to track time and dates."
      },
      {
        id: "q3",
        question: "What animal is most prominently carved at the base of the Konark chariot, pulling the Sun God's chariot?",
        hint: "The Sun God Surya rides across the sky pulled by these noble animals...",
        options: ["7 Elephants", "7 Horses", "12 Bulls", "24 Lions"],
        correct: 1,
        explanation: "Seven horses pull the chariot of the Sun God Surya, representing the 7 days of the week. The chariot has 24 wheels for hours and 12 pairs for months — the entire temple is an astronomical clock."
      },
    ],
  },
  {
    id: "jagannath-rath",
    monument: "Puri Jagannath Temple",
    title: "The Lord of the Universe",
    description: "Discover the cosmic symbolism and sacred mysteries of Shri Jagannath Dhama",
    difficulty: "Novice",
    xpReward: 150,
    stamp: "🛕",
    stampName: "Puri Temple Chariot Stamp",
    color: "from-yellow-500/20 to-amber-500/20",
    unlocked: true,
    questions: [
      {
        id: "q1",
        question: "What is unique about the flag on top of the Jagannath Temple spire that defies conventional physics?",
        hint: "Watch the flag carefully on a clear day...",
        options: ["It never tears in the wind", "It always waves opposite to the wind direction", "It glows at night", "It changes colors at noon"],
        correct: 1,
        explanation: "The flag on the Jagannath Temple's Neelachakra (blue wheel) always waves in the opposite direction to the wind — one of the 'miraculous' architectural phenomenon that has puzzled scientists, possibly due to the unique air currents created by the temple structure."
      },
      {
        id: "q2",
        question: "What is the Rath Yatra? During the festival, how many chariots are used for the three deities?",
        hint: "Jagannath, Balabhadra, and Subhadra each have their own...",
        options: ["1 giant chariot", "2 chariots", "3 chariots", "12 chariots"],
        correct: 2,
        explanation: "Three separate massive wooden chariots are built fresh every year — Nandighosha for Jagannath (45 ft, 16 wheels), Taladhwaja for Balabhadra (44 ft, 14 wheels), and Darpadalana for Subhadra (43 ft, 12 wheels)."
      },
    ],
  },
  {
    id: "lingaraj-temple",
    monument: "Lingaraj Temple, Bhubaneswar",
    title: "The Kalinga Pinnacle",
    description: "Explore the masterpiece of Kalinga architecture and its syncretic deity structures",
    difficulty: "Scholar",
    xpReward: 350,
    stamp: "🔱",
    stampName: "Kalinga Spire Stamp",
    color: "from-stone-500/20 to-slate-500/20",
    unlocked: true,
    questions: [
      {
        id: "q1",
        question: "What style of temple architecture does the Lingaraja Temple represent, characterized by the soaring curvilinear tower?",
        hint: "It is the native style of Odisha monuments...",
        options: ["Dravidian Style", "Nagara Kalinga Style", "Vesara Style", "Chola Style"],
        correct: 1,
        explanation: "Lingaraja Temple is the pinnacle of the Kalinga style of Nagara architecture, showcasing a dual-axis layout consisting of the Deula (sanctum), Jagamohana (assembly hall), Nata Mandira (dance hall), and Bhoga Mandapa (offering hall)."
      },
      {
        id: "q2",
        question: "Who is the main deity of Lingaraj Temple, representing a unique syncretic blend of Shiva and Vishnu?",
        hint: "A combination of Hari and Hara...",
        options: ["Lord Jagannath", "Lord Harihara", "Lord Somnath", "Lord Ganesha"],
        correct: 1,
        explanation: "The deity of Lingaraja is worshipped as Harihara — a combined form of Vishnu (Hari) and Shiva (Hara), reflecting the historical synthesis of Shaivism and Vaishnavism in medieval Odisha."
      }
    ],
  },
  {
    id: "udayagiri-caves",
    monument: "Udayagiri & Khandagiri Caves",
    title: "The Emperor's Rock-Cut Inscriptions",
    description: "Decode the 2,000-year-old Jain monuments and ancient royal inscriptions",
    difficulty: "Historian",
    xpReward: 500,
    stamp: "📜",
    stampName: "Hathigumpha Scroll Stamp",
    color: "from-emerald-500/20 to-teal-500/20",
    unlocked: true,
    questions: [
      {
        id: "q1",
        question: "In which ancient script is the famous Hathigumpha inscription of King Kharavela written?",
        hint: "Think about the script used by King Ashoka for his rock edicts...",
        options: ["Devanagari Script", "Brahmi Script", "Kharosthi Script", "Sanskrit Script"],
        correct: 1,
        explanation: "The Hathigumpha inscription ('Elephant Cave' inscription) is written in the deep-carved Brahmi script, dating back to the 2nd century BCE under the rule of King Kharavela of the Mahameghavahana dynasty."
      },
      {
        id: "q2",
        question: "How many rock-cut caves are there in the Udayagiri and Khandagiri complexes combined?",
        hint: "It is a prime-ish odd number, split between two hills...",
        options: ["18 caves", "24 caves", "33 caves", "42 caves"],
        correct: 2,
        explanation: "The complex contains 33 rock-cut caves. Udayagiri (Hill of Sunrise) has 18 caves, and Khandagiri (Broken Hill) has 15 caves. They served as residential retreats for Jain monks during the monsoon seasons."
      }
    ],
  },
];

const EXPLORER_LEVELS = [
  { name: "Novice Traveler", minXP: 0, icon: "🌱", color: "text-green-400" },
  { name: "Heritage Explorer", minXP: 200, icon: "🗺️", color: "text-blue-400" },
  { name: "Temple Scholar", minXP: 500, icon: "📚", color: "text-purple-400" },
  { name: "Royal Historian", minXP: 900, icon: "👑", color: "text-amber-400" },
  { name: "Legendary Sage", minXP: 1400, icon: "⭐", color: "text-yellow-300" },
];

// ── Quest Modal ────────────────────────────────────────────────────────────────
const QuestModal = ({ quest, onClose, onComplete }: { quest: Quest; onClose: () => void; onComplete: (xp: number) => void }) => {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = quest.questions[step];
  const isLast = step === quest.questions.length - 1;

  const handleSubmit = () => {
    if (selected === null) return;
    setAnswered(true);
    if (selected === q.correct) {
      setCorrectCount(c => c + 1);
      playSoundEffect("correct");
    } else {
      playSoundEffect("incorrect");
    }
  };

  const handleNext = () => {
    if (isLast) {
      playSoundEffect("complete");
      setFinished(true);
      return;
    }
    setStep(s => s + 1);
    setSelected(null);
    setAnswered(false);
  };

  if (finished) {
    const earned = Math.round((correctCount / quest.questions.length) * quest.xpReward);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
        <div className="bg-[#120d09] border border-[#c49a5e]/30 rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-amber-500/10 border border-[#c49a5e]/40 flex items-center justify-center text-4xl shadow-lg">
            {correctCount === quest.questions.length ? "🏆" : "⭐"}
          </div>
          <div className="pt-6">
            <h2 className="text-2xl font-bold text-amber-100">{correctCount === quest.questions.length ? "Perfect Score!" : "Quest Complete!"}</h2>
            <p className="text-amber-100/50 text-sm mt-2">You answered {correctCount} of {quest.questions.length} questions correctly.</p>
          </div>
          
          <div className="bg-black/40 border border-white/5 rounded-2xl p-5">
            <div className="text-4xl font-black text-amber-400">+{earned} XP</div>
            <div className="text-xs text-amber-100/40 mt-1 uppercase tracking-wider">Heritage Experience Points</div>
            
            {correctCount === quest.questions.length && (
              <div className="mt-4 pt-4 border-t border-[#c49a5e]/10 flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-3xl shadow-inner animate-pulse">
                  {quest.stamp}
                </div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-widest">Stamp Unlocked!</div>
                <div className="text-sm font-semibold text-white">{quest.stampName}</div>
              </div>
            )}
          </div>
          
          <Button 
            className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-6 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/5"
            onClick={() => {
              onComplete(earned);
              onClose();
            }}
          >
            Claim Rewards & Update Passport <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="bg-[#120d09] border border-[#c49a5e]/20 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-br ${quest.color} p-6 border-b border-[#c49a5e]/10`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-400/60 uppercase tracking-wider font-semibold">{quest.monument}</div>
              <h3 className="font-extrabold text-xl text-amber-100 mt-1">{quest.title}</h3>
            </div>
            <button onClick={onClose} className="text-amber-100/50 hover:text-white transition-colors text-lg">✕</button>
          </div>
          
          {/* Progress bar */}
          <div className="flex gap-2 mt-5">
            {quest.questions.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < step ? "bg-amber-400" : i === step ? "bg-amber-400/40 animate-pulse" : "bg-white/10"
                }`} 
              />
            ))}
          </div>
          <div className="text-[10px] text-amber-100/40 mt-2 font-mono uppercase tracking-wider">Question {step + 1} of {quest.questions.length}</div>
        </div>

        <div className="p-6 space-y-5">
          <p className="font-bold text-lg text-white leading-relaxed">{q.question}</p>
          <div className="text-xs text-amber-200/60 italic flex items-center gap-1.5 bg-amber-400/5 p-3 rounded-xl border border-amber-400/10">
            <span>💡</span>
            <span><strong>Hint:</strong> {q.hint}</span>
          </div>

          <div className="space-y-3">
            {q.options.map((opt, i) => {
              let style = "bg-white/5 border-white/5 hover:bg-white/10 text-amber-100 hover:border-white/10";
              if (answered) {
                if (i === q.correct) style = "bg-green-500/15 border-green-500/40 text-green-300";
                else if (i === selected) style = "bg-red-500/15 border-red-500/40 text-red-300";
                else style = "bg-white/5 border-transparent text-amber-100/30 opacity-40";
              } else if (i === selected) {
                style = "bg-amber-500/15 border-amber-500/40 text-amber-300";
              }
              
              return (
                <button 
                  key={i} 
                  disabled={answered}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all duration-200 flex items-center gap-4 ${style}`}
                >
                  <span className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    i === selected && !answered ? "bg-amber-400 text-black border-amber-400" : "border-current"
                  }`}>
                    {answered ? (
                      i === q.correct ? <CheckCircle2 className="w-4 h-4" /> : i === selected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)
                    ) : (
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span className="font-medium">{opt}</span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`rounded-xl p-4 text-xs leading-relaxed border ${
              selected === q.correct 
                ? "bg-green-500/5 border-green-500/20 text-green-200/80" 
                : "bg-red-500/5 border-red-500/20 text-red-200/80"
            }`}>
              <strong>{selected === q.correct ? "✓ Correct! " : "✗ Not quite. "}</strong>{q.explanation}
            </div>
          )}

          <div className="flex gap-4 pt-2">
            {!answered ? (
              <Button 
                className="flex-1 rounded-xl bg-amber-500 text-black font-bold py-5 hover:bg-amber-600" 
                disabled={selected === null} 
                onClick={handleSubmit}
              >
                Submit Answer
              </Button>
            ) : (
              <Button 
                className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold py-5 hover:from-amber-600 hover:to-orange-600" 
                onClick={handleNext}
              >
                {isLast ? "Finish Quest" : "Next Question"} <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ──────────────────────────────────────────────────────────────────
const HeritageQuests = () => {
  const [totalXP, setTotalXP] = useState(0);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [earnedStamps, setEarnedStamps] = useState<string[]>([]);

  const level = EXPLORER_LEVELS.reduce((best, lvl) => totalXP >= lvl.minXP ? lvl : best, EXPLORER_LEVELS[0]);
  const nextLevel = EXPLORER_LEVELS[EXPLORER_LEVELS.indexOf(level) + 1];
  const progress = nextLevel ? ((totalXP - level.minXP) / (nextLevel.minXP - level.minXP)) * 100 : 100;

  const handleComplete = (xp: number, questId: string) => {
    setTotalXP(t => t + xp);
    setCompletedQuests(c => [...new Set([...c, questId])]);
    const quest = QUESTS.find(q => q.id === questId);
    if (quest && xp === quest.xpReward) {
      setEarnedStamps(s => [...new Set([...s, quest.stampName])]);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20 relative">
      {/* Beautiful Scenery Background */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1622308644420-b3191eb13cfa?auto=format&fit=crop&q=80&w=2070')" }}
      />
      {/* Gradient Overlay for Readability (Adapts to Light/Dark) */}
      <div className="fixed inset-0 z-0 bg-white/80 dark:bg-[#0d0905]/85 backdrop-blur-[2px] transition-all duration-700" />
      
      <div className="relative z-10">
      <Navigation />
      <MoreSubNav />
      
      {activeQuest && (
        <QuestModal 
          quest={activeQuest} 
          onClose={() => setActiveQuest(null)}
          onComplete={(xp) => handleComplete(xp, activeQuest.id)} 
        />
      )}

      {/* Hero */}
      <div className="relative pt-36 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-radial-at-t from-[#c49a5e]/8 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-sm text-amber-400 mb-6 font-medium">
            <Trophy className="w-4 h-4 animate-bounce" /> Gamified Passport Quests
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-200 dark:via-orange-400 dark:to-rose-400 bg-clip-text text-transparent">Heritage Scavenger Quests</span>
            <br /><span className="text-foreground/90 text-3xl md:text-4xl font-light">Test Your Knowledge & Unlock Collectible Stamps</span>
          </h1>
          <p className="text-foreground/70 dark:text-amber-100/60 max-w-2xl mx-auto text-base leading-relaxed font-light">
            Each monument contains celestial secrets, architectural mysteries, and historical scripts. Complete quests on-site or virtually to advance your Explorer Rank.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        {/* Explorer Rank Status */}
        <div className="bg-white/60 dark:bg-black/40 border border-border/50 dark:border-[#c49a5e]/15 rounded-3xl p-6 mb-8 max-w-2xl mx-auto backdrop-blur-md shadow-xl dark:shadow-none">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-4xl shadow-inner">
              {level.icon}
            </div>
            <div className="flex-1 w-full text-center sm:text-left">
              <div className="text-xs text-amber-400 uppercase tracking-widest font-bold">Current Rank</div>
              <h3 className={`text-xl font-black mt-0.5 ${level.color.replace('400', '600').replace('text-yellow-300', 'text-yellow-600')} dark:${level.color}`}>{level.name}</h3>
              <p className="text-xs text-foreground/60 dark:text-amber-100/40 mt-1 font-mono">
                {totalXP} XP Accumlated {nextLevel ? `· ${nextLevel.minXP - totalXP} XP left for next rank` : "· Maximum Rank Achieved"}
              </p>
              <div className="mt-3 h-2.5 bg-muted dark:bg-black/40 border border-border/50 dark:border-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-border/50 dark:border-[#c49a5e]/10 pt-4 sm:pt-0 sm:pl-6 text-center shrink-0">
              <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-mono">{completedQuests.length}</div>
              <div className="text-[10px] text-foreground/60 dark:text-amber-100/40 uppercase tracking-wider font-bold mt-1">Quests Completed</div>
            </div>
          </div>
        </div>

        {/* Digital Passport Stamp Binder */}
        <div className="bg-white/60 dark:bg-black/40 border border-border/50 dark:border-[#c49a5e]/15 rounded-3xl p-6 mb-10 max-w-3xl mx-auto backdrop-blur-md shadow-xl dark:shadow-none">
          <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Digital Passport Stamps
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {QUESTS.map(q => {
              const isEarned = earnedStamps.includes(q.stampName);
              return (
                <div 
                  key={q.id} 
                  className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 transition-all duration-300 ${
                    isEarned 
                      ? "bg-amber-100/50 dark:bg-amber-500/5 border-amber-500/30 dark:border-amber-500/25 shadow-inner" 
                      : "bg-black/5 dark:bg-black/20 border-black/10 dark:border-white/5 opacity-60 dark:opacity-40"
                  }`}
                >
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl transition-transform ${
                    isEarned ? "bg-amber-500/20 dark:bg-amber-400/10 border border-amber-500/40 dark:border-amber-400/20 rotate-0 hover:rotate-12" : "bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/5"
                  }`}>
                    {isEarned ? q.stamp : "🔒"}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-foreground truncate max-w-[120px]">{q.stampName.replace(" Stamp", "")}</h4>
                    <p className="text-[9px] text-amber-600 dark:text-amber-400/60 uppercase font-mono tracking-wider mt-0.5">
                      {isEarned ? "UNLOCKED" : "LOCKED"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quests list */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {QUESTS.map(quest => {
            const done = completedQuests.includes(quest.id);
            return (
              <div 
                key={quest.id} 
                id={`quest-${quest.id}`}
                className={`relative bg-white/70 dark:bg-gradient-to-br dark:from-black/60 dark:to-black/30 border rounded-3xl overflow-hidden transition-all duration-300 backdrop-blur-md flex flex-col justify-between shadow-xl dark:shadow-none ${
                  done 
                    ? "border-green-500/40 dark:border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)] dark:shadow-[0_0_15px_rgba(34,197,94,0.02)]" 
                    : quest.unlocked 
                      ? "border-border/60 dark:border-[#c49a5e]/10 hover:border-amber-500/40 dark:hover:border-[#c49a5e]/25 hover:shadow-2xl" 
                      : "border-black/5 dark:border-white/5 opacity-60 dark:opacity-55"
                }`}
              >
                {/* Visual strip */}
                <div className={`h-1.5 bg-gradient-to-r ${quest.color.replace("/20", "")}`} />
                
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[10px] text-amber-600 dark:text-amber-400/60 font-bold uppercase tracking-wider font-mono">{quest.monument}</div>
                        <h3 className="font-extrabold text-lg text-foreground mt-1 leading-snug">{quest.title}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                          quest.difficulty === "Novice" ? "bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/30 dark:border-green-500/20" :
                          quest.difficulty === "Explorer" ? "bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/30 dark:border-blue-500/20" :
                          quest.difficulty === "Scholar" ? "bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/30 dark:border-purple-500/20" :
                          "bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 dark:border-amber-500/20"
                        }`}>{quest.difficulty}</span>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-bold">+{quest.xpReward} XP</span>
                      </div>
                    </div>

                    <p className="text-sm text-foreground/70 dark:text-amber-100/60 leading-relaxed font-light mt-3">{quest.description}</p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/50 dark:border-white/5 pt-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{quest.stamp}</span>
                      <span className="text-xs text-foreground/60 dark:text-amber-100/40 truncate max-w-[120px] font-medium">{quest.stampName}</span>
                    </div>

                    {done ? (
                      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm font-bold bg-green-100 dark:bg-green-500/10 border border-green-500/30 dark:border-green-500/20 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" /> Complete
                      </div>
                    ) : quest.unlocked ? (
                      <Button 
                        size="sm" 
                        className="bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl px-5 py-2.5 transition-all shadow-md shadow-amber-500/5"
                        onClick={() => setActiveQuest(quest)}
                      >
                        Start Quest <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-foreground/40 dark:text-amber-100/30 text-sm bg-black/5 dark:bg-white/5 border border-transparent px-3 py-1.5 rounded-xl">
                        <Lock className="w-4 h-4" /> Locked
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
};

export default HeritageQuests;
