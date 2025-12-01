import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Filter, X, ChevronDown, Star, Clock, Users, DollarSign } from "lucide-react";

interface SearchFilters {
  query: string;
  category: string;
  level: string;
  priceRange: [number, number];
  duration: string;
  rating: number;
  features: string[];
  instructor: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onClearFilters: () => void;
  initialFilters?: Partial<SearchFilters>;
  isLoading?: boolean;
  resultCount?: number;
}

const AdvancedSearch = ({
  onFiltersChange,
  onClearFilters,
  initialFilters = {},
  isLoading = false,
  resultCount = 0
}: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'all',
    level: 'all',
    priceRange: [0, 200],
    duration: 'all',
    rating: 0,
    features: [],
    instructor: '',
    sortBy: 'relevance',
    sortOrder: 'desc',
    ...initialFilters
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const categories = [
    'Web Development',
    'Data Science',
    'Mobile Development', 
    'Programming',
    'Design',
    'Marketing',
    'Business',
    'Photography',
    'Music',
    'Health & Fitness'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  
  const durations = [
    { value: '0-2', label: '0-2 hours' },
    { value: '3-6', label: '3-6 hours' },
    { value: '7-17', label: '7-17 hours' },
    { value: '17+', label: '17+ hours' }
  ];

  const features = [
    'Certificate of Completion',
    'Downloadable Resources',
    'Lifetime Access',
    'Mobile Access',
    'Assignments',
    'Quizzes',
    'Coding Exercises',
    'Case Studies'
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    updateFilters({ features: newFeatures });
  };

  const clearAllFilters = () => {
    const defaultFilters: SearchFilters = {
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
    };
    setFilters(defaultFilters);
    onClearFilters();
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category !== 'all') count++;
    if (filters.level !== 'all') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 200) count++;
    if (filters.duration !== 'all') count++;
    if (filters.rating > 0) count++;
    if (filters.features.length > 0) count++;
    if (filters.instructor) count++;
    return count;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 cursor-pointer transition-colors ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300 hover:text-yellow-400"
        }`}
        onClick={() => updateFilters({ rating: i + 1 })}
      />
    ));
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for courses..."
                value={filters.query}
                onChange={(e) => updateFilters({ query: e.target.value })}
                className="pl-10"
              />
            </div>
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="shrink-0">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {getActiveFilterCount() > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFilterCount()}
                    </Badge>
                  )}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center space-x-4 mt-3">
            <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.level} onValueChange={(value) => updateFilters({ level: value })}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                "Searching..."
              ) : (
                `${resultCount.toLocaleString()} courses found`
              )}
            </div>
            <div className="flex items-center space-x-2">
              {filters.features.map(feature => (
                <Badge key={feature} variant="secondary" className="text-xs">
                  {feature}
                  <X 
                    className="h-3 w-3 ml-1 cursor-pointer" 
                    onClick={() => handleFeatureToggle(feature)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Advanced Filters */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <div className="border-t bg-muted/20">
              <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4" />
                    <span>Price Range</span>
                  </Label>
                  <div className="space-y-2">
                    <Slider
                      value={filters.priceRange}
                      onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                      max={200}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}+</span>
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Duration</span>
                  </Label>
                  <Select value={filters.duration} onValueChange={(value) => updateFilters({ duration: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any duration</SelectItem>
                      {durations.map(duration => (
                        <SelectItem key={duration.value} value={duration.value}>
                          {duration.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Star className="h-4 w-4" />
                    <span>Minimum Rating</span>
                  </Label>
                  <div className="flex items-center space-x-1">
                    {renderStars(filters.rating)}
                    {filters.rating > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => updateFilters({ rating: 0 })}
                        className="ml-2 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Instructor */}
                <div className="space-y-3">
                  <Label className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Instructor</span>
                  </Label>
                  <Input
                    placeholder="Search by instructor name"
                    value={filters.instructor}
                    onChange={(e) => updateFilters({ instructor: e.target.value })}
                  />
                </div>

                {/* Features */}
                <div className="space-y-3 md:col-span-2">
                  <Label>Course Features</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {features.map(feature => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={filters.features.includes(feature)}
                          onCheckedChange={() => handleFeatureToggle(feature)}
                        />
                        <Label
                          htmlFor={feature}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default AdvancedSearch;
