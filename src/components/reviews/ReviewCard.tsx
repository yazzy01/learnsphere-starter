import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp, ThumbsDown, Flag } from "lucide-react";
import { useState } from "react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    helpfulCount?: number;
    isHelpful?: boolean;
  };
  onHelpfulClick?: (reviewId: string, isHelpful: boolean) => void;
  onReportClick?: (reviewId: string) => void;
  currentUserId?: string;
}

const ReviewCard = ({ 
  review, 
  onHelpfulClick, 
  onReportClick, 
  currentUserId 
}: ReviewCardProps) => {
  const [isHelpful, setIsHelpful] = useState(review.isHelpful || false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);

  const handleHelpfulClick = () => {
    const newIsHelpful = !isHelpful;
    setIsHelpful(newIsHelpful);
    setHelpfulCount(prev => newIsHelpful ? prev + 1 : prev - 1);
    onHelpfulClick?.(review.id, newIsHelpful);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={review.user.avatar} alt={review.user.name} />
            <AvatarFallback>{getInitials(review.user.name)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">{review.user.name}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
              
              {/* Rating Badge */}
              <Badge 
                variant={review.rating >= 4 ? "default" : review.rating >= 3 ? "secondary" : "destructive"}
              >
                {review.rating}/5
              </Badge>
            </div>

            {/* Comment */}
            {review.comment && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleHelpfulClick}
                  className={`text-xs ${isHelpful ? 'text-primary' : 'text-muted-foreground'}`}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({helpfulCount})
                </Button>
              </div>

              {currentUserId && currentUserId !== review.user.id && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReportClick?.(review.id)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Report
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
