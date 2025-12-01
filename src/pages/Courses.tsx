import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import AdvancedSearch from "@/components/search/AdvancedSearch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Grid, List, TrendingUp, Clock, Star } from "lucide-react";

const Courses = () => {
  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    level: 'all',
    priceRange: [0, 200] as [number, number],
    duration: 'all',
    rating: 0,
    features: [] as string[],
    instructor: '',
    sortBy: 'relevance',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Real course data with extended catalog
  const allCourses = [
    {
      id: "1",
      title: "The Complete Web Development Bootcamp 2024",
      description: "Master HTML, CSS, JavaScript, Node.js, React, MongoDB and Web3 development. Build 32+ projects and become a full-stack web developer.",
      instructor: "Dr. Angela Yu",
      price: 84.99,
      originalPrice: 199.99,
      rating: 4.7,
      studentsCount: 893240,
      duration: "61.5 hours",
      level: "Beginner" as const,
      category: "Web Development",
    },
    {
      id: "2",
      title: "100 Days of Code: Complete Python Pro Bootcamp",
      description: "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!",
      instructor: "Dr. Angela Yu",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.7,
      studentsCount: 756890,
      duration: "58 hours",
      level: "Beginner" as const,
      category: "Programming",
    },
    {
      id: "3",
      title: "React - The Complete Guide 2024",
      description: "Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!",
      instructor: "Maximilian Schwarzmüller",
      price: 94.99,
      originalPrice: 199.99,
      rating: 4.6,
      studentsCount: 567430,
      duration: "48.5 hours",
      level: "Intermediate" as const,
      category: "Web Development",
    },
    {
      id: "4",
      title: "The Web Developer Bootcamp 2024",
      description: "The only course you need to learn web development - HTML, CSS, JS, Node, and More! Created by Colt Steele.",
      instructor: "Colt Steele",
      price: 79.99,
      originalPrice: 189.99,
      rating: 4.7,
      studentsCount: 945820,
      duration: "63.5 hours",
      level: "Beginner" as const,
      category: "Web Development",
    },
    {
      id: "5",
      title: "Machine Learning A-Z: AI, Python & R",
      description: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts. Code templates included.",
      instructor: "Kirill Eremenko",
      price: 94.99,
      originalPrice: 199.99,
      rating: 4.5,
      studentsCount: 1234560,
      duration: "44 hours",
      level: "Intermediate" as const,
      category: "Data Science",
    },
    {
      id: "6",
      title: "The Complete Digital Marketing Course - 12 Courses in 1",
      description: "Master Digital Marketing Strategy, Social Media Marketing, SEO, YouTube, Email, Facebook Marketing, Analytics & More!",
      instructor: "Rob Percival",
      price: 84.99,
      originalPrice: 199.99,
      rating: 4.4,
      studentsCount: 434920,
      duration: "36 hours",
      level: "Beginner" as const,
      category: "Marketing",
    },
    {
      id: "7",
      title: "Complete C# Unity Game Developer 2D",
      description: "Learn Unity in C# & Code Your First Five 2D Video Games for Web, Mac & PC. The Tutorials Cover Tilemap.",
      instructor: "Ben Tristem",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.6,
      studentsCount: 245670,
      duration: "27.5 hours",
      level: "Beginner" as const,
      category: "Game Development",
    },
    {
      id: "8",
      title: "AWS Certified Solutions Architect - Associate 2024",
      description: "Pass the AWS Certified Solutions Architect Associate Certification SAA-C03. Complete Amazon Web Services Cloud training!",
      instructor: "Stephane Maarek",
      price: 99.99,
      originalPrice: 199.99,
      rating: 4.7,
      studentsCount: 856430,
      duration: "27 hours",
      level: "Advanced" as const,
      category: "Cloud Computing",
    },
    {
      id: "9",
      title: "The Complete JavaScript Course 2024: From Zero to Expert!",
      description: "The modern JavaScript course for everyone! Master JavaScript with projects, challenges and theory. Many courses in one!",
      instructor: "Jonas Schmedtmann",
      price: 89.99,
      originalPrice: 199.99,
      rating: 4.7,
      studentsCount: 678430,
      duration: "69 hours",
      level: "Beginner" as const,
      category: "Programming",
    },
    {
      id: "10",
      title: "Complete Node.js Developer Course (3rd Edition)",
      description: "Learn Node.js by building real-world applications with Node, Express, MongoDB, Jest, and more!",
      instructor: "Andrew Mead",
      price: 94.99,
      originalPrice: 199.99,
      rating: 4.6,
      studentsCount: 432890,
      duration: "35 hours",
      level: "Intermediate" as const,
      category: "Backend Development",
    },
    {
      id: "11",
      title: "Python for Data Science and Machine Learning Bootcamp",
      description: "Learn how to use NumPy, Pandas, Seaborn, Matplotlib, Plotly, Scikit-Learn, Machine Learning, Tensorflow, and more!",
      instructor: "Jose Portilla",
      price: 94.99,
      originalPrice: 199.99,
      rating: 4.6,
      studentsCount: 567210,
      duration: "25 hours",
      level: "Intermediate" as const,
      category: "Data Science",
    },
    {
      id: "12",
      title: "Complete Flutter & Dart Development Course",
      description: "Learn to build beautiful, natively compiled applications for mobile from a single codebase with Flutter and Dart.",
      instructor: "Dr. Angela Yu",
      price: 94.99,
      originalPrice: 199.99,
      rating: 4.6,
      studentsCount: 289340,
      duration: "31 hours",
      level: "Intermediate" as const,
      category: "Mobile Development",
    }
  ];

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(1); // Reset pagination when filters change
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleClearFilters = () => {
    setFilters({
      query: '',
      category: 'all',
      level: 'all',
      priceRange: [0, 200],
      duration: 'all',
      rating: 0,
      features: [],
      instructor: '',
      sortBy: 'relevance',
      sortOrder: 'desc'
    });
  };

  const filteredCourses = allCourses.filter(course => {
    // Search query
    const matchesSearch = !filters.query || 
      course.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      course.description.toLowerCase().includes(filters.query.toLowerCase()) ||
      course.instructor.toLowerCase().includes(filters.query.toLowerCase());
    
    // Category filter
    const matchesCategory = filters.category === "all" || course.category === filters.category;
    
    // Level filter
    const matchesLevel = filters.level === "all" || course.level === filters.level;
    
    // Price range filter
    const matchesPrice = course.price >= filters.priceRange[0] && 
      (filters.priceRange[1] >= 200 || course.price <= filters.priceRange[1]);
    
    // Rating filter
    const matchesRating = filters.rating === 0 || course.rating >= filters.rating;
    
    // Instructor filter
    const matchesInstructor = !filters.instructor || 
      course.instructor.toLowerCase().includes(filters.instructor.toLowerCase());
    
    // Duration filter (simplified - would need actual duration data)
    const matchesDuration = filters.duration === 'all'; // Placeholder
    
    return matchesSearch && matchesCategory && matchesLevel && 
           matchesPrice && matchesRating && matchesInstructor && matchesDuration;
  }).sort((a, b) => {
    // Sorting logic
    switch (filters.sortBy) {
      case 'rating':
        return filters.sortOrder === 'desc' ? b.rating - a.rating : a.rating - b.rating;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'popularity':
        return b.studentsCount - a.studentsCount;
      case 'newest':
        return 0; // Would use createdAt in real app
      default:
        return 0; // Relevance - would use search score in real app
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Discover <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Courses</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the perfect learning path with our advanced search and comprehensive course catalog.
            </p>
          </div>

          {/* Advanced Search */}
          <AdvancedSearch
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            initialFilters={filters}
            isLoading={isLoading}
            resultCount={filteredCourses.length}
          />

          {/* View Controls and Results Summary */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <p className="text-muted-foreground">
                {isLoading ? (
                  "Searching..."
                ) : (
                  <>
                    <span className="font-medium">{filteredCourses.length.toLocaleString()}</span> of{' '}
                    <span className="font-medium">{allCourses.length.toLocaleString()}</span> courses
                  </>
                )}
              </p>
              
              {/* Popular Categories */}
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {['Web Development', 'Data Science', 'Design'].map(category => (
                  <Badge
                    key={category}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                    onClick={() => handleFiltersChange({ ...filters, category })}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Course Results */}
          {isLoading ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-48 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-4">
                  We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <Button onClick={handleClearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                  <Button onClick={() => handleFiltersChange({ ...filters, query: '' })}>
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trending Courses Section */}
          {filteredCourses.length > 0 && !isLoading && (
            <div className="mt-16">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Trending This Week</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {allCourses.slice(0, 4).map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-2 line-clamp-2">{course.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{course.rating}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">${course.price}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Courses;