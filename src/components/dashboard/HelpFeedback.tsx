import { useState } from "react";
import { motion } from "framer-motion";
import { HelpCircle, Mail, Send, CheckCircle, Users, MessageSquare } from "lucide-react";

const teamMembers = [
  { name: "Samay Sarthak Swain", role: "Team Lead", email: "samaysarthakswaian4@gmail.com" },
  { name: "Bikash Rath", role: "Team Member" },
  { name: "Arpita Chowdhury", role: "Team Member" },
  { name: "Prasidhi Sasmal", role: "Team Member" },
  { name: "Slok Samarth Swain", role: "Team Member" },
  { name: "Lipsa Acharya", role: "Team Member" },
  { name: "Rudrasis Panda", role: "Team Member" },
  { name: "M Kaivalya", role: "Team Member" },
];

const HelpFeedback = () => {
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!feedback.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFeedback("");
      setName("");
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="bg-card border border-border rounded-lg p-6"
      id="help"
    >
      <div className="flex items-center gap-2 mb-6">
        <HelpCircle className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground uppercase tracking-wider">Help & Feedback</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Our Team</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`p-3 rounded-lg border transition-all ${
                  member.role === "Team Lead"
                    ? "bg-primary/10 border-primary/30 hover:glow-primary"
                    : "bg-secondary/50 border-border hover:border-primary/20"
                }`}
              >
                <p className="text-xs font-semibold text-foreground">{member.name}</p>
                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{member.role}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1 mt-1.5 text-[10px] text-primary hover:underline"
                  >
                    <Mail className="w-3 h-3" />
                    {member.email}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Send Feedback</h4>
          </div>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-3"
            >
              <div className="w-14 h-14 rounded-full bg-success/20 border border-success/30 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-success" />
              </div>
              <p className="text-sm font-semibold text-foreground">Thank you for your feedback!</p>
              <p className="text-xs text-muted-foreground">We'll review it shortly.</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Share your feedback, suggestions, or report issues..."
                rows={5}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              />
              <button
                onClick={handleSubmit}
                disabled={!feedback.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Submit Feedback
              </button>
              <p className="text-[10px] text-muted-foreground text-center">
                For queries, contact Team Lead:{" "}
                <a href="mailto:samaysarthakswaian4@gmail.com" className="text-primary hover:underline">
                  samaysarthakswaian4@gmail.com
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HelpFeedback;
