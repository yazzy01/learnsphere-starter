import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Play, 
  FileText, 
  Download, 
  Lock, 
  CheckCircle, 
  Clock,
  PlayCircle,
  BookOpen,
  HelpCircle
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: string;
  order: number;
  type: 'VIDEO' | 'TEXT' | 'PDF' | 'QUIZ';
  isPreview: boolean;
  isCompleted?: boolean;
  progress?: number;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  totalDuration: string;
  completedLessons: number;
}

interface LessonListProps {
  sections: Section[];
  isEnrolled: boolean;
  currentUserId?: string;
  onLessonClick: (lesson: Lesson) => void;
  onStartCourse?: () => void;
}

const LessonList = ({ 
  sections, 
  isEnrolled, 
  currentUserId, 
  onLessonClick,
  onStartCourse 
}: LessonListProps) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([sections[0]?.id]);

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircle className="h-4 w-4" />;
      case 'TEXT':
        return <FileText className="h-4 w-4" />;
      case 'PDF':
        return <Download className="h-4 w-4" />;
      case 'QUIZ':
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLessonTypeColor = (type: Lesson['type']) => {
    switch (type) {
      case 'VIDEO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'TEXT':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PDF':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'QUIZ':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const canAccessLesson = (lesson: Lesson) => {
    return isEnrolled || lesson.isPreview;
  };

  const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const completedLessons = sections.reduce((acc, section) => acc + section.completedLessons, 0);
  const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Course Progress (if enrolled) */}
      {isEnrolled && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Course Progress</span>
              <span className="text-lg font-bold">{Math.round(overallProgress)}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3 mb-2" />
            <p className="text-sm text-muted-foreground">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </CardContent>
        </Card>
      )}

      {/* Course Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Course Content</CardTitle>
            <div className="text-sm text-muted-foreground">
              {sections.length} sections • {totalLessons} lessons
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Accordion 
            type="multiple" 
            value={expandedSections}
            onValueChange={setExpandedSections}
          >
            {sections.map((section, sectionIndex) => {
              const sectionProgress = section.lessons.length > 0 
                ? (section.completedLessons / section.lessons.length) * 100 
                : 0;

              return (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="text-left">
                        <div className="font-semibold">
                          Section {sectionIndex + 1}: {section.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {section.lessons.length} lessons • {section.totalDuration}
                          {isEnrolled && (
                            <span className="ml-2">
                              • {section.completedLessons}/{section.lessons.length} completed
                            </span>
                          )}
                        </div>
                      </div>
                      {isEnrolled && (
                        <div className="flex items-center space-x-2">
                          <Progress value={sectionProgress} className="w-16 h-2" />
                          <span className="text-xs text-muted-foreground">
                            {Math.round(sectionProgress)}%
                          </span>
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-4">
                      {section.lessons.map((lesson, lessonIndex) => {
                        const canAccess = canAccessLesson(lesson);
                        
                        return (
                          <div
                            key={lesson.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                              canAccess
                                ? "hover:bg-muted cursor-pointer"
                                : "opacity-60 cursor-not-allowed bg-muted/50"
                            }`}
                            onClick={() => canAccess && onLessonClick(lesson)}
                          >
                            <div className="flex items-center space-x-3 flex-1">
                              {/* Lesson Status Icon */}
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                {lesson.isCompleted ? (
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                ) : canAccess ? (
                                  getLessonIcon(lesson.type)
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>

                              {/* Lesson Info */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-sm">
                                    {lessonIndex + 1}. {lesson.title}
                                  </span>
                                  {lesson.isPreview && (
                                    <Badge variant="secondary" className="text-xs">
                                      Preview
                                    </Badge>
                                  )}
                                </div>
                                {lesson.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {lesson.description}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Lesson Meta */}
                            <div className="flex items-center space-x-3">
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getLessonTypeColor(lesson.type)}`}
                              >
                                {lesson.type}
                              </Badge>
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {/* Call to Action for Non-enrolled Users */}
          {!isEnrolled && (
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <h4 className="font-semibold mb-2">Enroll to Access Full Course</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Get access to all {totalLessons} lessons and start learning today!
                </p>
                <Button onClick={onStartCourse} className="w-full sm:w-auto">
                  <Play className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonList;
