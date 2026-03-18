import { createContext, useContext, useState, type ReactNode } from "react";

type DetectionData = {
  personCount: number;
  vehicleCount: number;
  bboxes: any[]; // Detection results for visual feedback
  setPersonCount: (n: number) => void;
  setVehicleCount: (n: number) => void;
  setBboxes: (boxes: any[]) => void;
};

const DetectionContext = createContext<DetectionData>({
  personCount: 0,
  vehicleCount: 0,
  bboxes: [],
  setPersonCount: () => {},
  setVehicleCount: () => {},
  setBboxes: () => {},
});

export const useDetection = () => useContext(DetectionContext);

export const DetectionProvider = ({ children }: { children: ReactNode }) => {
  const [personCount, setPersonCount] = useState(0);
  const [vehicleCount, setVehicleCount] = useState(0);
  const [bboxes, setBboxes] = useState<any[]>([]);

  return (
    <DetectionContext.Provider value={{ personCount, vehicleCount, bboxes, setPersonCount, setVehicleCount, setBboxes }}>
      {children}
    </DetectionContext.Provider>
  );
};
