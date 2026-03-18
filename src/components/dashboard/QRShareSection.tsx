import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { QrCode, Smartphone, Copy, Check, Wifi } from "lucide-react";
import { useWebRTC } from "../../contexts/WebRTCContext";

const QRShareSection = () => {
  const [copied, setCopied] = useState(false);
  const { sessionId } = useWebRTC();
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://crowdmanagementsystem.lovable.app";
  const sessionUrl = sessionId ? `${appUrl}/room?session=${sessionId}&join=true` : `${appUrl}/room`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <QrCode className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
          Scan & Connect Your Device
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="p-4 rounded-xl bg-white"
            style={{ perspective: 1000 }}
          >
            <QRCodeSVG
              value={sessionUrl}
              size={200}
              bgColor="#ffffff"
              fgColor="#0a0e1a"
              level="H"
              includeMargin={false}
            />
          </motion.div>
          <p className="text-xs text-muted-foreground text-center max-w-[250px]">
            Scan this QR code with your phone to access the live crowd detection dashboard on your device
          </p>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { step: 1, icon: QrCode, text: "Scan the QR code with your phone camera" },
              { step: 2, icon: Smartphone, text: "Open the link — the dashboard loads instantly" },
              { step: 3, icon: Wifi, text: "Tap 'Start Camera' to share your live crowd feed" },
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + item.step * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary font-mono">{item.step}</span>
                </div>
                <p className="text-xs text-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <input
              readOnly
              value={sessionUrl}
              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QRShareSection;
