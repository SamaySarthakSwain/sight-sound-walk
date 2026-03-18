import React from "react";
import { motion, Variants } from "framer-motion";
import { Activity, Shield, Wifi, Clock, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import StatsCards from "@/components/dashboard/StatsCards";
import QRShareSection from "@/components/dashboard/QRShareSection";
import MultiDeviceView from "@/components/dashboard/MultiDeviceView";
import DetectionHistory from "@/components/dashboard/DetectionHistory";
import JoinSessionModal from "@/components/dashboard/JoinSessionModal";
import LiveCameraDetection from "@/components/dashboard/LiveCameraDetection";
import AIChatbot from "@/components/dashboard/AIChatbot";
import ITOSDashboard from "@/components/dashboard/ITOSDashboard";
import CCTVSimulation from "@/components/dashboard/CCTVSimulation";
import TrafficPrediction from "@/components/dashboard/TrafficPrediction";
import TrafficCharts from "@/components/dashboard/TrafficCharts";
import BerhampurMap from "@/components/dashboard/BerhampurMap";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import CongestionMap from "@/components/dashboard/CongestionMap";
import RouteSuggestions from "@/components/dashboard/RouteSuggestions";
import HelpFeedback from "@/components/dashboard/HelpFeedback";

const SectionTitle = ({ children, subtitle, action }: { children: React.ReactNode; subtitle?: string; action?: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="mb-4 flex items-end justify-between"
  >
    <div>
      <h2 className="text-lg font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
        <span className="w-1 h-6 bg-primary rounded-full" />
        {children}
      </h2>
      {subtitle && <p className="text-xs text-muted-foreground mt-1 ml-3">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </motion.div>
);

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 },
  },
};

const Index = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-transparent relative overflow-x-hidden">
      <JoinSessionModal />
      {/* Header */}
      <header className="sticky top-4 z-50 mx-4 lg:mx-auto max-w-[1400px] rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,163,255,0.15)] mb-8 hover:bg-black/60 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-[0_0_20px_rgba(0,163,255,0.3)] backdrop-blur-md"
              style={{ perspective: 1000 }}
            >
              <Activity className="w-6 h-6 text-primary drop-shadow-[0_0_10px_rgba(0,163,255,0.8)]" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-primary tracking-widest drop-shadow-lg">
                CROWDFLOW
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_5px_rgba(0,163,255,0.8)]" />
                <p className="text-[10px] text-primary/80 uppercase tracking-[0.3em] font-semibold">Bhubaneswar Command Center</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/50 border border-success/20 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-sm cursor-default"
            >
              <Wifi className="w-4 h-4 text-success animate-pulse" />
              <span className="text-xs text-success font-mono font-bold tracking-wider">SYSTEM ONLINE</span>
              <div className="relative flex items-center justify-center w-2 h-2 ml-1">
                <span className="absolute inline-flex w-full h-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </div>
            </motion.div>
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-black/40 border border-white/5 font-mono backdrop-blur-sm shadow-inner group-hover:border-white/10 transition-colors">
              <Clock className="w-4 h-4 text-primary opacity-80" />
              <span className="text-sm text-gray-200 font-medium tracking-wide">{new Date().toLocaleTimeString()}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-2.5 px-5 py-2 rounded-xl bg-accent/10 border border-accent/30 text-accent font-mono shadow-[0_0_15px_rgba(139,92,246,0.2)] backdrop-blur-md cursor-pointer"
            >
              <Shield className="w-4 h-4" />
              <span className="text-sm font-bold tracking-widest">ADMIN</span>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1400px] mx-auto px-4 pb-20 space-y-12"
      >
        {/* Stats */}
        <motion.div variants={itemVariants}>
          <StatsCards />
        </motion.div>

        {/* Local Camera + QR/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.section variants={itemVariants} className="h-full">
            <SectionTitle subtitle="Your local camera feed with real-time AI analysis">Local Surveillance Node</SectionTitle>
            <LiveCameraDetection />
          </motion.section>

          <div className="space-y-8">
            <motion.section variants={itemVariants}>
              <SectionTitle subtitle="Share this QR code with others to join your session">Scan to Join Stream</SectionTitle>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <QRShareSection />
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <SectionTitle
                subtitle="View the synchronized grid of all active cameras"
                action={
                  <Link
                    to={`/room${location.search}`}
                    className="flex items-center gap-2 px-5 py-3 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 rounded-xl text-base font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(0,163,255,0.3)] hover:shadow-[0_0_30px_rgba(0,163,255,0.5)] hover:scale-105"
                  >
                    ENTER LIVE ROOM
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                }
              >
                Launch Grid View
              </SectionTitle>
              <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl p-4 overflow-hidden">
                <MultiDeviceView />
              </div>
            </motion.section>
          </div>
        </div>

        {/* ITOS Dashboard - City Topology */}
        <motion.section variants={itemVariants}>
          <SectionTitle subtitle="50-node city network with multi-objective RL, emergency corridors & incident detection">
            ITOS — Intelligent Traffic Optimization
          </SectionTitle>
          <ITOSDashboard />
        </motion.section>

        {/* Real-time Traffic Density + Predictions (from server) */}
        <motion.section variants={itemVariants}>
          <SectionTitle subtitle="Server-sourced traffic density with 30/60/90 min predictions for Bhubaneswar">
            Traffic Density & Predictions
          </SectionTitle>
          <TrafficPrediction />
        </motion.section>

        {/* Detection History */}
        <motion.section variants={itemVariants}>
          <SectionTitle subtitle="Timestamped log of all detections">Detection History</SectionTitle>
          <DetectionHistory />
        </motion.section>

        {/* Charts + Map side by side */}
        <motion.section variants={itemVariants}>
          <SectionTitle subtitle="Live crowd/vehicle data and server traffic density">Traffic Analytics</SectionTitle>
          <TrafficCharts />
        </motion.section>

        {/* Bhubaneswar Map (GPS-based camera placement) */}
        <motion.section variants={itemVariants}>
          <SectionTitle subtitle="Connected cameras placed at their real GPS coordinates on the Bhubaneswar map">
            Bhubaneswar City Map
          </SectionTitle>
          <BerhampurMap />
        </motion.section>

        {/* Alerts + Congestion + Routes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.section variants={itemVariants}>
            <SectionTitle subtitle="Real-time alerts from camera data">Live Alerts</SectionTitle>
            <AlertsPanel />
          </motion.section>
          <motion.section variants={itemVariants}>
            <SectionTitle subtitle="Visual congestion map from connected cameras">Congestion Map</SectionTitle>
            <CongestionMap />
          </motion.section>
        </div>

        <motion.section variants={itemVariants}>
          <SectionTitle subtitle="Route suggestions based on live camera data">Route Suggestions</SectionTitle>
          <RouteSuggestions />
        </motion.section>

        {/* CCTV Network */}
        <motion.section variants={itemVariants}>
          <SectionTitle subtitle="Connected camera feeds with person/vehicle counts">CCTV Network</SectionTitle>
          <CCTVSimulation />
        </motion.section>

        {/* Help & Feedback */}
        <motion.section variants={itemVariants}>
          <HelpFeedback />
        </motion.section>
      </motion.main>

      <AIChatbot />
    </div>
  );
};

export default Index;
