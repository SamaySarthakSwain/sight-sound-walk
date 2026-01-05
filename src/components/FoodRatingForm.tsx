import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { FoodRating } from "@/hooks/useFoodPlaces";

interface FoodRatingFormProps {
  existingRating: FoodRating | null;
  onSubmit: (rating: {
    overall_rating: number;
    taste_rating: number;
    hygiene_rating: number;
    value_rating: number;
    comment?: string;
  }) => void;
  onCancel: () => void;
}

const FoodRatingForm = ({
  existingRating,
  onSubmit,
  onCancel,
}: FoodRatingFormProps) => {
  const [overall, setOverall] = useState(existingRating?.overall_rating || 3);
  const [taste, setTaste] = useState(existingRating?.taste_rating || 3);
  const [hygiene, setHygiene] = useState(existingRating?.hygiene_rating || 3);
  const [value, setValue] = useState(existingRating?.value_rating || 3);
  const [comment, setComment] = useState(existingRating?.comment || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onSubmit({
      overall_rating: overall,
      taste_rating: taste,
      hygiene_rating: hygiene,
      value_rating: value,
      comment: comment.trim() || undefined,
    });
    setSubmitting(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block">Overall Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setOverall(star)}
              className="p-0.5"
            >
              <Star
                className={`w-6 h-6 transition-colors ${
                  star <= overall
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground hover:text-amber-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm">Taste</label>
            <span className="text-sm font-medium">{taste}/5</span>
          </div>
          <Slider
            value={[taste]}
            onValueChange={(v) => setTaste(v[0])}
            min={1}
            max={5}
            step={1}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm">Hygiene</label>
            <span className="text-sm font-medium">{hygiene}/5</span>
          </div>
          <Slider
            value={[hygiene]}
            onValueChange={(v) => setHygiene(v[0])}
            min={1}
            max={5}
            step={1}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm">Value for Money</label>
            <span className="text-sm font-medium">{value}/5</span>
          </div>
          <Slider
            value={[value]}
            onValueChange={(v) => setValue(v[0])}
            min={1}
            max={5}
            step={1}
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">
          Comment (optional)
        </label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          className="resize-none h-20"
          maxLength={200}
        />
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onCancel}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "..." : existingRating ? "Update" : "Submit"}
        </Button>
      </div>
    </div>
  );
};

export default FoodRatingForm;
