import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, Play } from "lucide-react";
import { Link } from "react-router-dom";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsCount: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  imageUrl?: string;
}

const CourseCard = ({
  id,
  title,
  description,
  instructor,
  price,
  originalPrice,
  rating,
  studentsCount,
  duration,
  level,
  category,
}: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "bg-success/10 text-success border-success/20";
      case "Intermediate":
        return "bg-warning/10 text-warning border-warning/20";
      case "Advanced":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Link to={`/course/${id}`} className="block h-full">
      <Card className="group h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/30">
        {/* Course Image Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-primary/10 via-secondary/10 to-warning/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-60"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          {/* Category Badge */}
          <Badge className="absolute top-3 left-3 bg-card/90 text-card-foreground border-border/50">
            {category}
          </Badge>
          
          {/* Level Badge */}
          <Badge className={`absolute top-3 right-3 ${getLevelColor(level)}`}>
            {level}
          </Badge>
        </div>

        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">by {instructor}</p>
        </CardHeader>

        <CardContent className="flex-1 pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>

          {/* Course Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium text-foreground">{rating}</span>
              <span>({studentsCount.toLocaleString()})</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{studentsCount.toLocaleString()} students</span>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-foreground">
                ${price}
              </span>
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
            
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle enrollment logic here
              }}
            >
              Enroll Now
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;