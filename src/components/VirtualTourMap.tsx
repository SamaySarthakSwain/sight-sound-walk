import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Play, Pause, Navigation, Clock, Eye, Volume2, VolumeX } from 'lucide-react';
import { monuments3dData, Monument3D } from '@/data/monuments3d';

// Note: Ensure you have a Mapbox Access Token. 
// You can set it in your .env as VITE_MAPBOX_TOKEN.
// For demonstration, you must provide your own token below if env var is missing.
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'; // Demo token or fallback

const VirtualTourMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(86.0945); // Konark default
  const [lat, setLat] = useState(19.8876);
  const [zoom, setZoom] = useState(16);
  const [pitch, setPitch] = useState(60);
  const [bearing, setBearing] = useState(120);

  const [isTourRunning, setIsTourRunning] = useState(false);
  const [currentMonumentIndex, setCurrentMonumentIndex] = useState(0);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [currentYear, setCurrentYear] = useState(2024);

  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [lng, lat],
      zoom: zoom,
      pitch: pitch,
      bearing: bearing,
      antialias: true
    });

    map.current.on('load', () => {
      // Add 3D Terrain
      map.current?.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      map.current?.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

      // Add 3D Buildings
      const layers = map.current?.getStyle().layers;
      let labelLayerId;
      if (layers) {
        for (let i = 0; i < layers.length; i++) {
          if (layers[i].type === 'symbol' && layers[i].layout && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
          }
        }
      }

      map.current?.addLayer(
        {
          'id': '3d-buildings',
          'source': 'composite',
          'source-layer': 'building',
          'filter': ['==', 'extrude', 'true'],
          'type': 'fill-extrusion',
          'minzoom': 15,
          'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate', ['linear'], ['zoom'],
              15, 0,
              15.05, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.6
          }
        },
        labelLayerId
      );

      // Add Sky / Fog for cinematic effect
      map.current?.setFog({
        'range': [-1, 2],
        'horizon-blend': 0.3,
        'color': '#242B4B',
        'high-color': '#161B36',
        'space-color': '#0B1026',
        'star-intensity': 0.8
      });

      // Add markers for monuments
      monuments3dData.forEach((monument, index) => {
        const markerEl = document.createElement('div');
        markerEl.className = 'w-6 h-6 bg-primary rounded-full border-2 border-white cursor-pointer shadow-lg flex items-center justify-center animate-bounce';
        markerEl.innerHTML = `<div class="w-2 h-2 bg-white rounded-full"></div>`;
        
        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3 class="font-bold text-lg">${monument.name}</h3><p class="text-sm">${monument.description}</p>`
        );

        new mapboxgl.Marker(markerEl)
          .setLngLat(monument.coordinates)
          .setPopup(popup)
          .addTo(map.current!)
          .getElement().addEventListener('click', () => {
            flyToMonument(index);
          });
      });
    });

    return () => {
      if (synth) synth.cancel();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const speak = (text: string) => {
    if (!isSpeechEnabled || !synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    synth.speak(utterance);
  };

  const flyToMonument = (index: number) => {
    if (!map.current) return;
    const monument = monuments3dData[index];
    
    // Zoom out slightly first, then swoop in
    map.current.flyTo({
      center: monument.coordinates,
      zoom: 16.5,
      pitch: 75,
      bearing: Math.floor(Math.random() * 360),
      duration: 5000,
      essential: true
    });

    setCurrentMonumentIndex(index);
    speak(monument.historyText);

    // After reaching monument, slowly rotate camera
    setTimeout(() => {
      rotateCamera(0);
    }, 5500);
  };

  const rotateCamera = (timestamp: number) => {
    if (!map.current || !isTourRunning) return;
    map.current.rotateTo((timestamp / 100) % 360, { duration: 0 });
    requestAnimationFrame(rotateCamera);
  };

  const toggleTour = () => {
    if (isTourRunning) {
      setIsTourRunning(false);
      if (synth) synth.cancel();
    } else {
      setIsTourRunning(true);
      flyToMonument(currentMonumentIndex);
    }
  };

  const currentMonument = monuments3dData[currentMonumentIndex];

  return (
    <Card className="relative overflow-hidden group glass-card border-none rounded-xl h-[600px] w-full mt-8 shadow-2xl">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
      
      {/* Floating Control Panel */}
      <div className="absolute top-4 left-4 z-10 w-80 glass-panel bg-background/80 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl transition-transform duration-300">
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary" />
          3D Virtual Tour
        </h3>
        <p className="text-sm text-muted-foreground mb-4">Explore {monuments3dData.length} historical sites</p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-lg">{currentMonument.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{currentMonument.description}</p>
        </div>

        <div className="space-y-3">
          <Button 
            onClick={toggleTour} 
            className="w-full font-bold shadow-lg hover:shadow-primary/50 transition-all bg-gradient-to-r from-primary to-primary/80"
          >
            {isTourRunning ? <><Pause className="mr-2 w-4 h-4" /> Pause Tour</> : <><Play className="mr-2 w-4 h-4" /> Start Guided Tour</>}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="w-full flex items-center gap-2 glass-button">
              <Eye className="w-4 h-4" /> VR Mode
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full flex items-center gap-2 glass-button"
              onClick={() => {
                setIsSpeechEnabled(!isSpeechEnabled);
                if (isSpeechEnabled && synth) synth.cancel();
              }}
            >
              {isSpeechEnabled ? <Volume2 className="w-4 h-4 text-green-500" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
              Voice Guide
            </Button>
          </div>

          {/* Time Travel Slider */}
          <div className="pt-3 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Time Travel</span>
              <span className="text-xs font-bold text-primary">{currentYear} AD</span>
            </div>
            <Slider 
              defaultValue={[2024]} 
              max={2024} 
              min={1000} 
              step={100}
              onValueChange={(val) => setCurrentYear(val[0])}
            />
          </div>
        </div>
      </div>

      {/* Hotspots Overlay Display */}
      {currentMonument.hotspots && isTourRunning && (
        <div className="absolute bottom-4 right-4 z-10 w-64 glass-panel bg-background/80 backdrop-blur-md p-3 rounded-lg border border-white/20 shadow-xl animate-fade-in">
          <h4 className="font-semibold text-sm mb-2 border-b border-white/10 pb-1">Points of Interest</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {currentMonument.hotspots.map((spot, idx) => (
              <div 
                key={idx} 
                className="p-2 rounded bg-white/5 hover:bg-white/10 cursor-pointer transition-colors text-xs"
                onClick={() => {
                  map.current?.flyTo({ center: spot.coordinates, zoom: 18, pitch: 80 });
                  speak(spot.description);
                }}
              >
                <span className="font-bold text-primary mr-1">📍 {spot.name}</span>
                <span className="text-muted-foreground block mt-1">{spot.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default VirtualTourMap;
