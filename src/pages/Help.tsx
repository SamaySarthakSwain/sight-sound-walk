import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin } from "lucide-react";

const Help = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Navigation />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Help & Support</h1>
          <p className="text-center text-muted-foreground mb-8">
            Need assistance? We're here to help!
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Reach out to us for any questions or support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Phone Number</h3>
                  <a 
                    href="tel:+918327780375" 
                    className="text-primary hover:underline"
                  >
                    +91 83277 80375
                  </a>
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

          <Card>
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
                  <li>Text-to-speech narration for historical places</li>
                  <li>Save your favorite monuments</li>
                  <li>Track your search history</li>
                  <li>Optional notifications for nearby places</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Help;