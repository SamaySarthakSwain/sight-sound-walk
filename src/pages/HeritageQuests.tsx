import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Lock, CheckCircle2, XCircle, Sparkles, Scroll, ChevronRight } from "lucide-react";

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
    stamp: "⚙️",
    stampName: "Golden Sundial Stamp",
    color: "from-amber-500/20 to-orange-500/20",
    unlocked: true,
    questions: [
      {
        id: "q1", question: "How many spokes does each main chariot wheel of the Konark Sun Temple have?",
        hint: "Think about how many hours are in a day...",
        options: ["8 spokes", "16 spokes", "24 spokes", "32 spokes"],
        correct: 2,
        explanation: "Each of the 24 main wheels has 24 spokes — one for each hour of the day. The 8 cardinal spokes represent the 8 Praharas (3-hour divisions) of the day."
      },
      {
        id: "q2", question: "How many pairs of wheels does the Konark Sun Temple have in total?",
        hint: "It represents the months of the Indian calendar...",
        options: ["6 pairs", "12 pairs", "24 pairs", "36 pairs"],
        correct: 1,
        explanation: "The temple has 12 pairs of wheels — representing the 12 months of the year. Together they create a giant solar calendar that the priests used to track time and dates."
      },
      {
        id: "q3", question: "What animal is most prominently carved at the base of the Konark chariot, pulling the Sun God's chariot?",
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
    stampName: "Celestial Chariot Stamp",
    color: "from-yellow-500/20 to-amber-500/20",
    unlocked: true,
    questions: [
      {
        id: "q1", question: "What is unique about the flag on top of the Jagannath Temple spire that defies conventional physics?",
        hint: "Watch the flag carefully on a clear day...",
        options: ["It never tears in the wind", "It always waves opposite to the wind direction", "It glows at night", "It changes colors at noon"],
        correct: 1,
        explanation: "The flag on the Jagannath Temple's Neelachakra (blue wheel) always waves in the opposite direction to the wind — one of the 'miraculous' architectural phenomenon that has puzzled scientists, possibly due to the unique air currents created by the temple structure."
      },
      {
        id: "q2", question: "What is the Rath Yatra? During the festival, how many chariots are used for the three deities?",
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
    title: "The Great Lord of the Universe",
    description: "Explore the masterpiece of Kalinga architecture and its sacred geometry",
    difficulty: "Scholar",
    xpReward: 350,
    stamp: "🏛️",
    stampName: "Kalinga Architect Stamp",
    color: "from-stone-500/20 to-slate-500/20",
    unlocked: false,
    questions: [],
  },
  {
    id: "udayagiri-caves",
    monument: "Udayagiri & Khandagiri Caves",
    title: "The Jain King's Retreat",
    description: "Decode the 2,000-year-old rock-cut inscriptions of King Kharavela",
    difficulty: "Historian",
    xpReward: 500,
    stamp: "📜",
    stampName: "Ancient Scroll Stamp",
    color: "from-emerald-500/20 to-teal-500/20",
    unlocked: false,
    questions: [],
  },
];

const EXPLORER_LEVELS = [
  { name: "Novice Traveler", minXP: 0, icon: "🌱", color: "text-green-400" },
  { name: "Heritage Explorer", minXP: 200, icon: "🗺️", color: "text-blue-400" },
  { name: "Temple Scholar", minXP: 500, icon: "📚", color: "text-purple-400" },
  { name: "Royal Historian", minXP: 900, icon: "👑", color: "text-amber-400" },
  { name: "Legendary Sage", minXP: 1500, icon: "⭐", color: "text-yellow-300" },
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
    if (selected === q.correct) setCorrectCount(c => c + 1);
  };

  const handleNext = () => {
    if (isLast) { setFinished(true); return; }
    setStep(s => s + 1);
    setSelected(null); setAnswered(false);
  };

  if (finished) {
    const earned = Math.round((correctCount / quest.questions.length) * quest.xpReward);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="glass-card rounded-3xl p-8 max-w-md w-full text-center space-y-5 border border-white/10">
          <div className="text-6xl">{correctCount === quest.questions.length ? "🏆" : correctCount > 0 ? "⭐" : "📖"}</div>
          <h2 className="text-2xl font-bold">{correctCount === quest.questions.length ? "Perfect Score!" : "Quest Complete!"}</h2>
          <p className="text-muted-foreground">You answered {correctCount} of {quest.questions.length} questions correctly.</p>
          <div className="glass-panel rounded-2xl p-4">
            <div className="text-3xl font-bold text-primary">+{earned} XP</div>
            <div className="text-sm text-muted-foreground">earned this quest</div>
            {correctCount === quest.questions.length && (
              <div className="mt-3 flex items-center justify-center gap-2 text-amber-400 font-semibold">
                <span className="text-2xl">{quest.stamp}</span>
                {quest.stampName} Unlocked!
              </div>
            )}
          </div>
          <Button className="glass-button w-full rounded-xl" onClick={() => { onComplete(earned); onClose(); }}>
            Claim Rewards <Sparkles className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="glass-card rounded-3xl max-w-lg w-full border border-white/10 overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-br ${quest.color} p-5`}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">{quest.monument}</div>
              <h3 className="font-bold text-lg">{quest.title}</h3>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">✕</button>
          </div>
          <div className="flex gap-2 mt-3">
            {quest.questions.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i < step ? "bg-primary" : i === step ? "bg-primary/60" : "bg-white/10"}`} />
            ))}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Question {step + 1} of {quest.questions.length}</div>
        </div>

        <div className="p-5 space-y-4">
          <p className="font-semibold text-base leading-relaxed">{q.question}</p>
          <p className="text-xs text-muted-foreground italic">💡 Hint: {q.hint}</p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let style = "bg-white/5 border-white/10 hover:bg-white/10 text-foreground";
              if (answered) {
                if (i === q.correct) style = "bg-green-500/20 border-green-500/40 text-green-300";
                else if (i === selected) style = "bg-red-500/20 border-red-500/40 text-red-300";
                else style = "bg-white/5 border-white/5 text-muted-foreground opacity-50";
              } else if (i === selected) {
                style = "bg-primary/20 border-primary/40 text-primary";
              }
              return (
                <button key={i} disabled={answered}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 flex items-center gap-3 ${style}`}>
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs font-bold shrink-0">
                    {answered ? (i === q.correct ? <CheckCircle2 className="w-4 h-4" /> : i === selected ? <XCircle className="w-4 h-4" /> : String.fromCharCode(65 + i)) : String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`rounded-xl p-3 text-sm leading-relaxed ${selected === q.correct ? "bg-green-500/10 border border-green-500/20 text-green-300" : "bg-red-500/10 border border-red-500/20 text-red-300"}`}>
              {selected === q.correct ? "✅ Correct! " : "❌ Not quite. "}{q.explanation}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            {!answered ? (
              <Button className="glass-button flex-1 rounded-xl" disabled={selected === null} onClick={handleSubmit}>
                Submit Answer
              </Button>
            ) : (
              <Button className="glass-button flex-1 rounded-xl" onClick={handleNext}>
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
    if (quest && xp === quest.xpReward) setEarnedStamps(s => [...new Set([...s, quest.stampName])]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {activeQuest && (
        <QuestModal quest={activeQuest} onClose={() => setActiveQuest(null)}
          onComplete={(xp) => { handleComplete(xp, activeQuest.id); setActiveQuest(null); }} />
      )}

      <div className="relative pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/8 via-transparent to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 pt-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-sm text-amber-400 mb-6 font-medium">
            <Trophy className="w-4 h-4" /> Heritage Quest Challenges
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">Become a</span>
            <br /><span className="text-foreground/90">Heritage Master</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            Solve riddles, decode ancient secrets, and earn rare digital stamps. Progress from Novice Traveler to Legendary Sage.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        {/* Explorer Level Card */}
        <div className="glass-card rounded-2xl p-5 mb-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{level.icon}</div>
            <div className="flex-1">
              <div className={`text-lg font-bold ${level.color}`}>{level.name}</div>
              <div className="text-sm text-muted-foreground">{totalXP} XP earned{nextLevel ? ` · ${nextLevel.minXP - totalXP} XP to ${nextLevel.name}` : " · MAX LEVEL"}</div>
              <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completedQuests.length}</div>
              <div className="text-xs text-muted-foreground">Quests Done</div>
            </div>
          </div>
        </div>

        {/* Stamps */}
        {earnedStamps.length > 0 && (
          <div className="mb-8 max-w-2xl mx-auto">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Scroll className="w-4 h-4" /> Earned Stamps</h3>
            <div className="flex flex-wrap gap-2">
              {earnedStamps.map(stamp => (
                <div key={stamp} className="px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-sm font-medium flex items-center gap-1.5">
                  <Star className="w-3 h-3" />{stamp}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quests grid */}
        <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {QUESTS.map(quest => {
            const done = completedQuests.includes(quest.id);
            return (
              <div key={quest.id} id={`quest-${quest.id}`}
                className={`relative glass-card rounded-2xl overflow-hidden transition-all duration-300 glow-card ${!quest.unlocked ? "opacity-60" : ""}`}>
                <div className={`h-2 bg-gradient-to-r ${quest.color.replace("/20", "")}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">{quest.monument}</div>
                      <h3 className="font-bold text-base">{quest.title}</h3>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        quest.difficulty === "Novice" ? "bg-green-500/20 text-green-400" :
                        quest.difficulty === "Explorer" ? "bg-blue-500/20 text-blue-400" :
                        quest.difficulty === "Scholar" ? "bg-purple-500/20 text-purple-400" :
                        "bg-amber-500/20 text-amber-400"
                      }`}>{quest.difficulty}</span>
                      <span className="text-xs text-primary font-semibold">+{quest.xpReward} XP</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{quest.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{quest.stamp}</span>
                      <span className="text-xs text-muted-foreground">{quest.stampName}</span>
                    </div>
                    {done ? (
                      <div className="flex items-center gap-1.5 text-green-400 text-sm font-semibold">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </div>
                    ) : quest.unlocked ? (
                      <Button size="sm" className="glass-button rounded-xl" onClick={() => setActiveQuest(quest)}>
                        Start Quest <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
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
  );
};

export default HeritageQuests;
