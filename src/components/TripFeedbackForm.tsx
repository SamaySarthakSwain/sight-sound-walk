import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, ThumbsUp, ThumbsDown, Send } from "lucide-react";
import { useSaveFeedback, TripHistory } from "@/hooks/useCabServices";
import { toast } from "sonner";

interface TripFeedbackFormProps {
  trip: TripHistory;
  onSubmit?: () => void;
}

const StarRating = ({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) => (
  <div className="space-y-1">
    <Label className="text-sm">{label}</Label>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  </div>
);

const TripFeedbackForm = ({ trip, onSubmit }: TripFeedbackFormProps) => {
  const [rating, setRating] = useState(0);
  const [driverRating, setDriverRating] = useState(0);
  const [vehicleCondition, setVehicleCondition] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

  const saveFeedback = useSaveFeedback();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please provide an overall rating");
      return;
    }

    try {
      await saveFeedback.mutateAsync({
        trip_id: trip.id,
        rating,
        driver_rating: driverRating || null,
        vehicle_condition: vehicleCondition || null,
        punctuality: punctuality || null,
        comment: comment || null,
        would_recommend: wouldRecommend,
      });

      toast.success("Thank you for your feedback!");
      onSubmit?.();
    } catch (error) {
      toast.error("Failed to submit feedback");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">How was your trip?</CardTitle>
        <p className="text-sm text-muted-foreground">
          {trip.start_location} → {trip.end_location}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <StarRating value={rating} onChange={setRating} label="Overall Experience *" />

        <div className="grid grid-cols-3 gap-4">
          <StarRating value={driverRating} onChange={setDriverRating} label="Driver" />
          <StarRating
            value={vehicleCondition}
            onChange={setVehicleCondition}
            label="Vehicle"
          />
          <StarRating value={punctuality} onChange={setPunctuality} label="On Time" />
        </div>

        <div className="space-y-2">
          <Label>Would you recommend this service?</Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={wouldRecommend === true ? "default" : "outline"}
              size="sm"
              onClick={() => setWouldRecommend(true)}
              className="gap-2"
            >
              <ThumbsUp className="w-4 h-4" />
              Yes
            </Button>
            <Button
              type="button"
              variant={wouldRecommend === false ? "destructive" : "outline"}
              size="sm"
              onClick={() => setWouldRecommend(false)}
              className="gap-2"
            >
              <ThumbsDown className="w-4 h-4" />
              No
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Additional Comments</Label>
          <Textarea
            id="comment"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={saveFeedback.isPending}
          className="w-full gap-2"
        >
          <Send className="w-4 h-4" />
          Submit Feedback
        </Button>
      </CardContent>
    </Card>
  );
};

export default TripFeedbackForm;
