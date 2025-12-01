import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CourseBuilder from "@/components/instructor/CourseBuilder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import {
  BookOpen,
  Users,
  Clock,
  DollarSign,
  Image as ImageIcon,
  Upload,
  ChevronRight,
  CheckCircle,
  Settings,
  Eye
} from "lucide-react";

const CreateCourse = () => {
  const { user, isInstructor } = useAuth();
  const [currentStep, setCurrentStep] = useState<'details' | 'content' | 'pricing' | 'publish'>('details');
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    longDescription: '',
    category: '',
    level: '',
    thumbnail: '',
    price: '',
    originalPrice: '',
    language: 'English',
    requirements: '',
    learningObjectives: ''
  });

  if (!isInstructor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-12">
              <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground mb-6">
                You need instructor privileges to create courses.
              </p>
              <Button asChild>
                <a href="/dashboard">Go to Dashboard</a>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const steps = [
    { id: 'details', title: 'Course Details', icon: BookOpen },
    { id: 'content', title: 'Course Content', icon: Settings },
    { id: 'pricing', title: 'Pricing & Settings', icon: DollarSign },
    { id: 'publish', title: 'Publish Course', icon: Eye }
  ];

  const nextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id as any);
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id as any);
    }
  };

  const updateCourseData = (updates: Partial<typeof courseData>) => {
    setCourseData(prev => ({ ...prev, ...updates }));
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = steps.findIndex(s => s.id === currentStep) > index;
        const StepIcon = step.icon;

        return (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : isCompleted
                  ? 'bg-green-600 text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {isCompleted ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <StepIcon className="h-5 w-5" />
              )}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              isActive ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <ChevronRight className="h-5 w-5 mx-4 text-muted-foreground" />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Course</h1>
            <p className="text-muted-foreground">
              Share your knowledge and inspire students worldwide
            </p>
          </div>

          {/* Step Indicator */}
          {renderStepIndicator()}

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            {currentStep === 'details' && (
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Course Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Complete Web Development Bootcamp"
                      value={courseData.title}
                      onChange={(e) => updateCourseData({ title: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Make it descriptive and compelling
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Short Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief overview of what students will learn..."
                      value={courseData.description}
                      onChange={(e) => updateCourseData({ description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="longDescription">Detailed Description</Label>
                    <Textarea
                      id="longDescription"
                      placeholder="Detailed course description, curriculum overview, what students will achieve..."
                      value={courseData.longDescription}
                      onChange={(e) => updateCourseData({ longDescription: e.target.value })}
                      rows={6}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Category *</Label>
                      <Select value={courseData.category} onValueChange={(value) => updateCourseData({ category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="web-development">Web Development</SelectItem>
                          <SelectItem value="data-science">Data Science</SelectItem>
                          <SelectItem value="mobile-development">Mobile Development</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="photography">Photography</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Level *</Label>
                      <Select value={courseData.level} onValueChange={(value) => updateCourseData({ level: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Course Thumbnail</Label>
                    <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="font-medium">Upload course thumbnail</p>
                      <p className="text-sm text-muted-foreground">1280x720 recommended • JPG, PNG</p>
                      <Button variant="outline" className="mt-4">
                        <Upload className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={nextStep}>
                      Next: Course Content
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'content' && (
              <CourseBuilder
                courseId="new-course"
                courseName={courseData.title || 'New Course'}
              />
            )}

            {currentStep === 'pricing' && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Additional Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Course Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="99.99"
                        value={courseData.price}
                        onChange={(e) => updateCourseData({ price: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price (optional)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        placeholder="199.99"
                        value={courseData.originalPrice}
                        onChange={(e) => updateCourseData({ originalPrice: e.target.value })}
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        Show a discount by setting original price
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requirements">Prerequisites</Label>
                    <Textarea
                      id="requirements"
                      placeholder="What should students know before taking this course?"
                      value={courseData.requirements}
                      onChange={(e) => updateCourseData({ requirements: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="learningObjectives">Learning Objectives</Label>
                    <Textarea
                      id="learningObjectives"
                      placeholder="What will students learn from this course?"
                      value={courseData.learningObjectives}
                      onChange={(e) => updateCourseData({ learningObjectives: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button onClick={nextStep}>
                      Next: Publish Course
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 'publish' && (
              <Card>
                <CardHeader>
                  <CardTitle>Ready to Publish?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <h3 className="font-semibold mb-4">Course Summary</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Title:</strong> {courseData.title || 'Not set'}
                      </div>
                      <div>
                        <strong>Category:</strong> {courseData.category || 'Not set'}
                      </div>
                      <div>
                        <strong>Level:</strong> {courseData.level || 'Not set'}
                      </div>
                      <div>
                        <strong>Price:</strong> ${courseData.price || '0'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Publishing Options</h4>
                    
                    <div className="space-y-3">
                      <Button size="lg" className="w-full">
                        Publish Course Immediately
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        Your course will be live and available to students
                      </p>
                    </div>

                    <div className="text-center">
                      <span className="text-sm text-muted-foreground">or</span>
                    </div>

                    <div className="space-y-3">
                      <Button variant="outline" size="lg" className="w-full">
                        Save as Draft
                      </Button>
                      <p className="text-sm text-muted-foreground text-center">
                        Continue working on your course later
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <Button variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreateCourse;
