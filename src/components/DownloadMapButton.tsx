import { Button } from "@/components/ui/button";
import { Download, MapPin } from "lucide-react";
import { toast } from "sonner";

interface DownloadMapButtonProps {
  lat?: number;
  lng?: number;
  label?: string;
}

const DownloadMapButton = ({ lat = 20.2961, lng = 85.8245, label = "Odisha" }: DownloadMapButtonProps) => {
  const handleDownload = () => {
    // Google Maps offline: opens the area in Google Maps app where user can download
    const url = `https://www.google.com/maps/@${lat},${lng},10z`;
    window.open(url, "_blank");
    toast.info(
      "In Google Maps app, tap your profile → Offline maps → Select your own map to download the area for offline use.",
      { duration: 8000 }
    );
  };

  return (
    <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
      <Download className="w-4 h-4" />
      <MapPin className="w-4 h-4" />
      Download {label} Map
    </Button>
  );
};

export default DownloadMapButton;
