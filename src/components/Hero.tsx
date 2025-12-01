import { Button } from "@/components/ui/button";
import { Play, Users, Award, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-learning.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Award className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">#1 E-Learning Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Learn{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Smarter
              </span>{" "}
              with Expert-Led Courses
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Master new skills with our comprehensive online courses taught by industry experts. 
              Join thousands of learners achieving their goals every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link to="/dashboard">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary text-primary-foreground shadow-xl shadow-primary/25 transition-all duration-300 group w-full sm:w-auto"
                >
                  <Play className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Learning Today
                </Button>
              </Link>
              <Link to="/courses">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 w-full sm:w-auto"
                >
                  Browse Courses
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-2 mx-auto">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-lg mb-2 mx-auto">
                  <BookOpen className="h-6 w-6 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-foreground">300+</div>
                <div className="text-sm text-muted-foreground">Courses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-lg mb-2 mx-auto">
                  <Award className="h-6 w-6 text-success" />
                </div>
                <div className="text-2xl font-bold text-foreground">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image Placeholder */}
          <div className="relative">
            <div className="aspect-square max-w-lg mx-auto relative">
              {/* Floating Cards */}
              <div className="absolute top-4 right-4 bg-card border border-border rounded-xl p-4 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Web Development</div>
                    <div className="text-xs text-muted-foreground">125 courses</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-4 bg-card border border-border rounded-xl p-4 shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-secondary to-warning rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Data Science</div>
                    <div className="text-xs text-muted-foreground">89 courses</div>
                  </div>
                </div>
              </div>

              {/* Central Gradient Circle */}
              <div className="absolute inset-8 bg-gradient-to-br from-primary/20 via-secondary/20 to-warning/20 rounded-full blur-3xl"></div>
              <div className="absolute inset-12 bg-gradient-to-br from-primary to-secondary rounded-full opacity-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;