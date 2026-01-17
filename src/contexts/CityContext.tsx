import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface CityContextType {
  selectedCity: string;
  cityLat: number;
  cityLng: number;
  setSelectedCity: (city: string, lat: number, lng: number) => void;
}

const STORAGE_KEY = "odisha_explorer_selected_city";

interface StoredCity {
  city: string;
  lat: number;
  lng: number;
}

const getStoredCity = (): StoredCity | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading stored city:", e);
  }
  return null;
};

const storeCity = (city: string, lat: number, lng: number) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ city, lat, lng }));
  } catch (e) {
    console.error("Error storing city:", e);
  }
};

const CityContext = createContext<CityContextType | undefined>(undefined);

export const CityProvider = ({ children }: { children: ReactNode }) => {
  const storedCity = getStoredCity();
  
  const [selectedCity, setCity] = useState(storedCity?.city || "Bhubaneswar, Odisha, India");
  const [cityLat, setCityLat] = useState(storedCity?.lat || 20.2961);
  const [cityLng, setCityLng] = useState(storedCity?.lng || 85.8245);

  const setSelectedCity = (city: string, lat: number, lng: number) => {
    setCity(city);
    setCityLat(lat);
    setCityLng(lng);
    storeCity(city, lat, lng);
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
