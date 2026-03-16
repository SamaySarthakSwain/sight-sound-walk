import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, AlertTriangle, Shield, Flame, Ambulance, Building2, Hospital, Car, HelpCircle } from "lucide-react";
import { useState, useMemo } from "react";
import { useCity } from "@/contexts/CityContext";
import CrowdDensityScanner from "@/components/CrowdDensityScanner";
import MonumentDensityList from "@/components/MonumentDensityList";
import ITOSDashboard from "@/components/ITOSDashboard";
import VirtualTourMap from "@/components/VirtualTourMap";

interface EmergencyService {
  name: string;
  number: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

interface NearbyFacility {
  name: string;
  type: string;
  address: string;
  distance: string;
  phone: string;
  city: string; // which city this facility belongs to
}

const Help = () => {
  const [showNearby, setShowNearby] = useState(false);
  const { selectedCity } = useCity();

  const cityName = selectedCity.split(",")[0].toLowerCase().trim();
  const cityDisplayName = selectedCity.split(",")[0] || "Odisha";

  const emergencyServices: EmergencyService[] = [
    { name: "Police", number: "100", icon: <Shield className="w-6 h-6" />, description: "For crime, theft, accidents", color: "bg-blue-500" },
    { name: "Fire Brigade", number: "101", icon: <Flame className="w-6 h-6" />, description: "For fire emergencies", color: "bg-orange-500" },
    { name: "Ambulance", number: "102", icon: <Ambulance className="w-6 h-6" />, description: "Medical emergencies", color: "bg-red-500" },
    { name: "Emergency (Universal)", number: "112", icon: <AlertTriangle className="w-6 h-6" />, description: "All emergency services", color: "bg-purple-500" },
    { name: "Women Helpline", number: "1091", icon: <Phone className="w-6 h-6" />, description: "Women in distress", color: "bg-pink-500" },
    { name: "Child Helpline", number: "1098", icon: <HelpCircle className="w-6 h-6" />, description: "Children in need", color: "bg-green-500" },
  ];

  const allFacilities: NearbyFacility[] = [
    // === BERHAMPUR ===
    { name: "MKCG Medical College Hospital", type: "Hospital", address: "Brahmapur, Ganjam", distance: "2 km", phone: "+91 680 2202300", city: "berhampur" },
    { name: "Tata Benz Hospital", type: "Hospital", address: "Tata Benz Square, Berhampur", distance: "1.5 km", phone: "+91 680 2225511", city: "berhampur" },
    { name: "Hi-Tech Hospital", type: "Hospital", address: "Gandhi Nagar, Berhampur", distance: "3 km", phone: "+91 680 2240999", city: "berhampur" },
    { name: "City Hospital", type: "Hospital", address: "Old Town, Berhampur", distance: "2.5 km", phone: "+91 680 2232100", city: "berhampur" },
    { name: "Sanjivani Hospital", type: "Hospital", address: "Ankuli, Berhampur", distance: "4 km", phone: "+91 680 2275800", city: "berhampur" },
    { name: "Shanti Memorial Hospital", type: "Hospital", address: "Ambapua, Berhampur", distance: "3.5 km", phone: "+91 680 2268900", city: "berhampur" },
    { name: "Ahalya Hospital", type: "Hospital", address: "Kamapalli, Berhampur", distance: "3 km", phone: "+91 680 2291100", city: "berhampur" },
    { name: "SLN Hospital", type: "Hospital", address: "Haridakhandi, Berhampur", distance: "5 km", phone: "+91 680 2283456", city: "berhampur" },
    { name: "Town Police Station", type: "Police", address: "Court Road, Berhampur", distance: "1 km", phone: "+91 680 2220100", city: "berhampur" },
    { name: "Baidyanathpur Police Station", type: "Police", address: "Baidyanathpur, Berhampur", distance: "2.5 km", phone: "+91 680 2234567", city: "berhampur" },
    { name: "Gosaninuagaon Police Station", type: "Police", address: "Gosani Nuagaon, Berhampur", distance: "3 km", phone: "+91 680 2245678", city: "berhampur" },
    { name: "Lanjipalli Police Station", type: "Police", address: "Lanjipalli, Berhampur", distance: "4 km", phone: "+91 680 2256789", city: "berhampur" },
    { name: "SP Office Ganjam", type: "Police", address: "Chatrapur, Ganjam", distance: "15 km", phone: "+91 680 2270100", city: "berhampur" },
    { name: "Berhampur Fire Station", type: "Fire", address: "NH-16, Berhampur", distance: "2 km", phone: "+91 680 2221101", city: "berhampur" },
    { name: "Apollo Pharmacy", type: "Medical", address: "Gandhi Nagar, Berhampur", distance: "1 km", phone: "+91 680 2225500", city: "berhampur" },
    { name: "MedPlus", type: "Medical", address: "Tata Benz Square, Berhampur", distance: "1.5 km", phone: "+91 680 2235600", city: "berhampur" },
    { name: "Netmeds Store", type: "Medical", address: "Gate Bazaar, Berhampur", distance: "2 km", phone: "+91 680 2245700", city: "berhampur" },

    // === BHUBANESWAR ===
    { name: "AIIMS Bhubaneswar", type: "Hospital", address: "Sijua, Bhubaneswar", distance: "10 km", phone: "+91 674 2476001", city: "bhubaneswar" },
    { name: "Capital Hospital", type: "Hospital", address: "Unit-6, Bhubaneswar", distance: "3 km", phone: "+91 674 2390983", city: "bhubaneswar" },
    { name: "KIMS Hospital", type: "Hospital", address: "KIIT Road, Bhubaneswar", distance: "8 km", phone: "+91 674 2725525", city: "bhubaneswar" },
    { name: "SUM Hospital", type: "Hospital", address: "Shampur, Bhubaneswar", distance: "7 km", phone: "+91 674 2386281", city: "bhubaneswar" },
    { name: "Apollo Hospital", type: "Hospital", address: "Plot No. 251, Bhubaneswar", distance: "5 km", phone: "+91 674 6661066", city: "bhubaneswar" },
    { name: "Care Hospital", type: "Hospital", address: "Nayapalli, Bhubaneswar", distance: "4 km", phone: "+91 674 3090100", city: "bhubaneswar" },
    { name: "Sparsh Hospital", type: "Hospital", address: "Saheed Nagar, Bhubaneswar", distance: "2 km", phone: "+91 674 2546700", city: "bhubaneswar" },
    { name: "Hi-Tech Medical College", type: "Hospital", address: "Pandara, Bhubaneswar", distance: "12 km", phone: "+91 674 2372484", city: "bhubaneswar" },
    { name: "Utkal Hospital", type: "Hospital", address: "Cuttack Road, Bhubaneswar", distance: "6 km", phone: "+91 674 2300682", city: "bhubaneswar" },
    { name: "Kalinga Hospital", type: "Hospital", address: "Chandrasekharpur, Bhubaneswar", distance: "5 km", phone: "+91 674 2300150", city: "bhubaneswar" },
    { name: "Nayapalli Police Station", type: "Police", address: "Nayapalli, Bhubaneswar", distance: "3 km", phone: "+91 674 2553080", city: "bhubaneswar" },
    { name: "Kharavel Nagar Police Station", type: "Police", address: "Kharavel Nagar, Bhubaneswar", distance: "2 km", phone: "+91 674 2536050", city: "bhubaneswar" },
    { name: "Saheed Nagar Police Station", type: "Police", address: "Saheed Nagar, Bhubaneswar", distance: "2.5 km", phone: "+91 674 2547100", city: "bhubaneswar" },
    { name: "Commissionerate Police", type: "Police", address: "Vani Vihar, Bhubaneswar", distance: "4 km", phone: "+91 674 2530035", city: "bhubaneswar" },
    { name: "Bhubaneswar Fire Station", type: "Fire", address: "Unit-1, Bhubaneswar", distance: "3 km", phone: "+91 674 2430101", city: "bhubaneswar" },
    { name: "Apollo Pharmacy", type: "Medical", address: "Saheed Nagar, Bhubaneswar", distance: "1 km", phone: "+91 674 2547800", city: "bhubaneswar" },
    { name: "MedPlus Pharmacy", type: "Medical", address: "Jaydev Vihar, Bhubaneswar", distance: "2 km", phone: "+91 674 2303400", city: "bhubaneswar" },

    // === PURI ===
    { name: "District Headquarters Hospital Puri", type: "Hospital", address: "Grand Road, Puri", distance: "1 km", phone: "+91 6752 222063", city: "puri" },
    { name: "Puri Municipality Hospital", type: "Hospital", address: "Bada Danda, Puri", distance: "1.5 km", phone: "+91 6752 222100", city: "puri" },
    { name: "SDN Hospital Puri", type: "Hospital", address: "Station Road, Puri", distance: "2 km", phone: "+91 6752 223456", city: "puri" },
    { name: "Town Police Station Puri", type: "Police", address: "Grand Road, Puri", distance: "1 km", phone: "+91 6752 222033", city: "puri" },
    { name: "Sea Beach Police Station", type: "Police", address: "CT Road, Puri", distance: "2 km", phone: "+91 6752 222222", city: "puri" },
    { name: "Puri Fire Station", type: "Fire", address: "Puri Town", distance: "1.5 km", phone: "+91 6752 223101", city: "puri" },
    { name: "Apollo Pharmacy Puri", type: "Medical", address: "Grand Road, Puri", distance: "1 km", phone: "+91 6752 224500", city: "puri" },

    // === CUTTACK ===
    { name: "SCB Medical College Hospital", type: "Hospital", address: "Manglabag, Cuttack", distance: "2 km", phone: "+91 671 2414080", city: "cuttack" },
    { name: "Acharya Harihar Cancer Hospital", type: "Hospital", address: "Mangalabag, Cuttack", distance: "2.5 km", phone: "+91 671 2414014", city: "cuttack" },
    { name: "Shishu Bhawan Hospital", type: "Hospital", address: "Cuttack", distance: "3 km", phone: "+91 671 2321295", city: "cuttack" },
    { name: "Ashwini Hospital", type: "Hospital", address: "Sector-1, CDA, Cuttack", distance: "4 km", phone: "+91 671 2367545", city: "cuttack" },
    { name: "Mangalabag Police Station", type: "Police", address: "Mangalabag, Cuttack", distance: "1.5 km", phone: "+91 671 2414100", city: "cuttack" },
    { name: "Purighat Police Station", type: "Police", address: "Purighat, Cuttack", distance: "2 km", phone: "+91 671 2323100", city: "cuttack" },
    { name: "Cuttack Fire Station", type: "Fire", address: "Cuttack City", distance: "2 km", phone: "+91 671 2321101", city: "cuttack" },
    { name: "MedPlus Cuttack", type: "Medical", address: "College Square, Cuttack", distance: "1 km", phone: "+91 671 2320500", city: "cuttack" },
  ];

  const nearbyFacilities = useMemo(() => {
    if (cityName === "berhampur" || cityName === "brahmapur") {
      return allFacilities.filter(f => f.city === "berhampur");
    } else if (cityName === "bhubaneswar" || cityName === "bbsr") {
      return allFacilities.filter(f => f.city === "bhubaneswar");
    } else if (cityName === "puri") {
      return allFacilities.filter(f => f.city === "puri");
    } else if (cityName === "cuttack") {
      return allFacilities.filter(f => f.city === "cuttack");
    }
    // Default: show all
    return allFacilities;
  }, [cityName]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Hospital": return <Hospital className="w-4 h-4 text-red-500" />;
      case "Police": return <Shield className="w-4 h-4 text-blue-500" />;
      case "Fire": return <Flame className="w-4 h-4 text-orange-500" />;
      case "Medical": return <Building2 className="w-4 h-4 text-green-500" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "Hospital": return "bg-red-100 text-red-700 hover:bg-red-100";
      case "Police": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "Fire": return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "Medical": return "bg-green-100 text-green-700 hover:bg-green-100";
      default: return "";
    }
  };

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Help & Support</h1>
          <p className="text-center text-muted-foreground mb-8">
            Emergency services and support at your fingertips
          </p>

          {/* SOS Emergency Section */}
          <Card className="mb-8 border-none glass-card bg-gradient-to-r from-red-50/10 to-orange-50/10 dark:from-red-950/20 dark:to-orange-950/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-red-600 dark:text-red-400">SOS Emergency Services</CardTitle>
                  <CardDescription>Tap to call emergency services immediately</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {emergencyServices.map((service) => (
                  <Button
                    key={service.number}
                    variant="outline"
                    className="h-auto py-4 flex flex-col items-center gap-2 border-2 hover:border-primary transition-all hover:scale-105"
                    onClick={() => handleCall(service.number)}
                  >
                    <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center text-white`}>
                      {service.icon}
                    </div>
                    <span className="font-bold text-lg">{service.number}</span>
                    <span className="font-semibold">{service.name}</span>
                    <span className="text-xs text-muted-foreground text-center">{service.description}</span>
                  </Button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-200">Emergency Tip</p>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Dial 112 for any emergency - it connects to Police, Fire, and Ambulance services automatically.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Nearby Facilities Section */}
          <Card className="mb-8 glass-card border-none">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Nearby Facilities ({cityDisplayName})
                  </CardTitle>
                  <CardDescription>
                    Hospitals, Police Stations, Fire Stations & Medical Stores
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setShowNearby(!showNearby)}>
                  {showNearby ? "Hide" : "Show All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(showNearby ? nearbyFacilities : nearbyFacilities.slice(0, 6)).map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{getTypeIcon(facility.type)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{facility.name}</span>
                          <Badge variant="secondary" className={`text-xs ${getTypeBadgeColor(facility.type)}`}>
                            {facility.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{facility.address}</p>
                        <p className="text-xs text-muted-foreground">{facility.distance} away</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="shrink-0" onClick={() => handleCall(facility.phone)}>
                      <Phone className="w-4 h-4 mr-1" />
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mb-8 glass-card border-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5 text-primary" />
                Quick Emergency Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleCall("108")}>
                  <Ambulance className="w-6 h-6 text-red-500" />
                  <span className="text-sm font-medium">Call 108</span>
                  <span className="text-xs text-muted-foreground">Free Ambulance</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleCall("1073")}>
                  <Car className="w-6 h-6 text-blue-500" />
                  <span className="text-sm font-medium">Road Accident</span>
                  <span className="text-xs text-muted-foreground">Helpline 1073</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleCall("1800-11-0031")}>
                  <Shield className="w-6 h-6 text-green-500" />
                  <span className="text-sm font-medium">Tourist Police</span>
                  <span className="text-xs text-muted-foreground">Tourist Helpline</span>
                </Button>
                <Button variant="outline" className="h-auto py-4 flex flex-col gap-2" onClick={() => handleCall("181")}>
                  <HelpCircle className="w-6 h-6 text-purple-500" />
                  <span className="text-sm font-medium">Women Helpline</span>
                  <span className="text-xs text-muted-foreground">24/7 Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mb-8 glass-card border-none">
            <CardHeader>
              <CardTitle>App Support Contact</CardTitle>
              <CardDescription>Reach out to us for any app-related questions or support</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone Number</h3>
                  <a href="tel:+918327780375" className="text-primary hover:underline">+91 83277 80375</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contact Person</h3>
                  <p className="text-muted-foreground">Samay Sarthak Swain</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted-foreground">Berhampur, Odisha, India</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="glass-card border-none">
            <CardHeader>
              <CardTitle>About Lets Explore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Lets Explore is an educational tourism app designed for Odisha that combines GPS location tracking with text-to-speech narration to create location-based learning experiences.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Key Features:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Real-time GPS tracking of your location</li>
                  <li>Route planning with monuments along the way</li>
                  <li>AI-powered voice guide with camera support</li>
                  <li>Save your favorite monuments</li>
                  <li>Track your search history</li>
                  <li>SOS emergency services</li>
                  <li>Hotel and food recommendations</li>
                  <li>Cab fare comparison</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <CrowdDensityScanner />
          <div className="mt-16">
            <MonumentDensityList />
          </div>
          <div className="mt-16">
            <ITOSDashboard />
          </div>

          {/* 3D Virtual Tour Section */}
          <div className="mt-16 border-t border-border pt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">3D Virtual Tour & Time Travel</h2>
              <p className="text-muted-foreground">Explore historical monuments of Odisha in fully guided 3D space</p>
            </div>
            <VirtualTourMap />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
