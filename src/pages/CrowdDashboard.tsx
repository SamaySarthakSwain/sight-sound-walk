import React, { useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Activity, Shield, Wifi, Clock, ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
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
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden pt-14 md:pt-16">
      <Navigation />
      <JoinSessionModal />
      {/* Header */}
      <header className="sticky top-14 md:top-16 z-40 mx-4 lg:mx-auto max-w-[1400px] rounded-2xl border border-border bg-card/80 dark:bg-card/90 backdrop-blur-xl shadow-lg dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:shadow-xl dark:hover:shadow-[0_0_50px_rgba(0,163,255,0.1)] mb-8 group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="px-6 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shadow-sm dark:shadow-[0_0_20px_rgba(0,163,255,0.3)] backdrop-blur-md"
              style={{ perspective: 1000 }}
            >
              <Activity className="w-6 h-6 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-widest">
                CROWDFLOW
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-semibold">Bhubaneswar Command Center</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted border border-border cursor-default"
            >
              <Wifi className="w-4 h-4 text-success animate-pulse" />
              <span className="text-xs text-success font-mono font-bold tracking-wider">SYSTEM ONLINE</span>
              <div className="relative flex items-center justify-center w-2 h-2 ml-1">
                <span className="absolute inline-flex w-full h-full rounded-full bg-success opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-success" />
              </div>
            </motion.div>
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-muted border border-border font-mono">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground font-medium tracking-wide">{new Date().toLocaleTimeString()}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-2.5 px-5 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary font-mono cursor-pointer"
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
        {/* Local Camera + QR/Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <motion.section variants={itemVariants} className="h-full">
            <SectionTitle subtitle="Your local camera feed with real-time AI analysis">Local Surveillance Node</SectionTitle>
            <LiveCameraDetection />
          </motion.section>

          <div className="space-y-8">
            <motion.section variants={itemVariants}>
              <SectionTitle subtitle="Share this QR code with others to join your session">Scan to Join Stream</SectionTitle>
              <div className="glass-card rounded-2xl p-6">
                <QRShareSection />
              </div>
            </motion.section>

            <motion.section variants={itemVariants}>
              <SectionTitle
                subtitle="View the synchronized grid of all active cameras"
                action={
                  <Link
                    to={`/room${location.search}`}
                    className="flex items-center gap-2 px-5 py-3 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 rounded-xl text-base font-bold tracking-wide transition-all hover:scale-105"
                  >
                    ENTER LIVE ROOM
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                }
              >
                Launch Grid View
              </SectionTitle>
              <div className="glass-card rounded-2xl p-4 overflow-hidden">
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
      </motion.main>

      <AIChatbot />
    </div>
  );
};

export default Index;
