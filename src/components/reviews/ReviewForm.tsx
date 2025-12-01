import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  courseId: string;
  onSubmit: (data: { rating: number; comment: string }) => Promise<void>;
  existingReview?: {
    rating: number;
    comment?: string;
  };
  isEdit?: boolean;
}

const ReviewForm = ({ 
  courseId, 
  onSubmit, 
  existingReview, 
  isEdit = false 
}: ReviewFormProps) => {
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting your review.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({ rating, comment: comment.trim() });
      
      if (!isEdit) {
        setRating(0);
        setComment("");
      }

      toast({
        title: isEdit ? "Review Updated" : "Review Submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredRating || rating);

      return (
        <button
          key={index}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-colors"
        >
          <Star
            className={`h-8 w-8 ${
              isFilled
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-400"
            }`}
          />
        </button>
      );
    });
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return "Poor";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Very Good";
      case 5: return "Excellent";
      default: return "Select a rating";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEdit ? "Edit Your Review" : "Leave a Review"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Your Rating
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                {renderStars()}
              </div>
              <span className="text-sm text-muted-foreground ml-3">
                {getRatingText(hoveredRating || rating)}
              </span>
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-3">
            <label htmlFor="comment" className="text-sm font-medium">
              Your Review (Optional)
            </label>
            <Textarea
              id="comment"
              placeholder="Share your thoughts about this course..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={1000}
              className="resize-none"
            />
            <div className="text-xs text-muted-foreground text-right">
              {comment.length}/1000 characters
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={rating === 0 || isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? "Submitting..."
              : isEdit
              ? "Update Review"
              : "Submit Review"
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
