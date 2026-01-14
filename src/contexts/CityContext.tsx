import { createContext, useContext, useState, ReactNode } from "react";

interface CityContextType {
  selectedCity: string;
  cityLat: number;
  cityLng: number;
  setSelectedCity: (city: string, lat: number, lng: number) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCity, setCity] = useState("Bhubaneswar, Odisha, India");
  const [cityLat, setCityLat] = useState(20.2961);
  const [cityLng, setCityLng] = useState(85.8245);

  const setSelectedCity = (city: string, lat: number, lng: number) => {
    setCity(city);
    setCityLat(lat);
    setCityLng(lng);
  };

  return (
    <CityContext.Provider value={{ selectedCity, cityLat, cityLng, setSelectedCity }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
};
