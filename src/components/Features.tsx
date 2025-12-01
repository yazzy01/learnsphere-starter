import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  Users, 
  Trophy, 
  Clock, 
  Smartphone, 
  HeadphonesIcon,
  CheckCircle,
  Star
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Expert-Led Courses",
      description: "Learn from industry professionals with years of real-world experience.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Users,
      title: "Community Learning",
      description: "Join a vibrant community of learners and get help when you need it.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Trophy,
      title: "Certificates",
      description: "Earn verified certificates upon course completion to showcase your skills.",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      icon: Clock,
      title: "Learn at Your Pace",
      description: "Self-paced learning that fits your schedule and lifestyle.",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      icon: Smartphone,
      title: "Mobile Learning",
      description: "Access courses anywhere, anytime with our responsive platform.",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team.",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "50,000+",
      label: "Active Students",
      description: "Learning and growing every day"
    },
    {
      icon: BookOpen,
      number: "300+",
      label: "Quality Courses",
      description: "Across various industries"
    },
    {
      icon: Star,
      number: "4.9/5",
      label: "Average Rating",
      description: "From satisfied learners"
    },
    {
      icon: CheckCircle,
      number: "95%",
      label: "Completion Rate",
      description: "Students finish what they start"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SmartLearn?
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide everything you need to succeed in your learning journey with cutting-edge tools and expert guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/30 hover:-translate-y-1"
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Trusted by Students Worldwide
            </h3>
            <p className="text-muted-foreground">
              Join thousands of learners who have transformed their careers with SmartLearn
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.number}
                  </div>
                  <div className="font-semibold text-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;