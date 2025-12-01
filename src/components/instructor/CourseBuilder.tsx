import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LessonUpload from "./LessonUpload";
import {
  Plus,
  Play,
  FileText,
  HelpCircle,
  Link,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Save,
  Send
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'TEXT' | 'PDF' | 'QUIZ' | 'LINK';
  duration?: string;
  order: number;
  isPreview: boolean;
  status: 'draft' | 'published';
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  linkUrl?: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  order: number;
}

interface CourseBuilderProps {
  courseId: string;
  courseName: string;
  initialSections?: Section[];
}

const CourseBuilder = ({ courseId, courseName, initialSections = [] }: CourseBuilderProps) => {
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>(initialSections.length > 0 ? initialSections : [
    {
      id: '1',
      title: 'Introduction',
      lessons: [],
      order: 1
    }
  ]);
  const [showLessonUpload, setShowLessonUpload] = useState(false);
  const [editingLesson, setEditingLesson] = useState<{ sectionId: string; lesson?: Lesson } | null>(null);

  const addSection = () => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: `Section ${sections.length + 1}`,
      lessons: [],
      order: sections.length + 1
    };
    setSections([...sections, newSection]);
  };

  const updateSectionTitle = (sectionId: string, title: string) => {
    setSections(sections.map(section =>
      section.id === sectionId ? { ...section, title } : section
    ));
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter(section => section.id !== sectionId));
  };

  const addLesson = (sectionId: string) => {
    setEditingLesson({ sectionId });
    setShowLessonUpload(true);
  };

  const editLesson = (sectionId: string, lesson: Lesson) => {
    setEditingLesson({ sectionId, lesson });
    setShowLessonUpload(true);
  };

  const saveLesson = async (lessonData: any) => {
    if (!editingLesson) return;

    const { sectionId } = editingLesson;
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    if (editingLesson.lesson) {
      // Update existing lesson
      const updatedLessons = section.lessons.map(lesson =>
        lesson.id === editingLesson.lesson!.id
          ? { ...lesson, ...lessonData, id: editingLesson.lesson!.id }
          : lesson
      );
      
      setSections(sections.map(s =>
        s.id === sectionId ? { ...s, lessons: updatedLessons } : s
      ));
    } else {
      // Add new lesson
      const newLesson: Lesson = {
        id: crypto.randomUUID(),
        ...lessonData,
        order: section.lessons.length + 1,
        status: 'draft' as const
      };

      setSections(sections.map(s =>
        s.id === sectionId
          ? { ...s, lessons: [...s.lessons, newLesson] }
          : s
      ));
    }

    setShowLessonUpload(false);
    setEditingLesson(null);
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    setSections(sections.map(section =>
      section.id === sectionId
        ? {
            ...section,
            lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
          }
        : section
    ));
  };

  const moveLessonUp = (sectionId: string, lessonId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const lessonIndex = section.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex <= 0) return;

    const newLessons = [...section.lessons];
    [newLessons[lessonIndex], newLessons[lessonIndex - 1]] = 
    [newLessons[lessonIndex - 1], newLessons[lessonIndex]];

    // Update order numbers
    newLessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });

    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, lessons: newLessons } : s
    ));
  };

  const moveLessonDown = (sectionId: string, lessonId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;

    const lessonIndex = section.lessons.findIndex(l => l.id === lessonId);
    if (lessonIndex >= section.lessons.length - 1) return;

    const newLessons = [...section.lessons];
    [newLessons[lessonIndex], newLessons[lessonIndex + 1]] = 
    [newLessons[lessonIndex + 1], newLessons[lessonIndex]];

    // Update order numbers
    newLessons.forEach((lesson, index) => {
      lesson.order = index + 1;
    });

    setSections(sections.map(s =>
      s.id === sectionId ? { ...s, lessons: newLessons } : s
    ));
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Play className="h-4 w-4" />;
      case 'TEXT': return <FileText className="h-4 w-4" />;
      case 'PDF': return <Download className="h-4 w-4" />;
      case 'QUIZ': return <HelpCircle className="h-4 w-4" />;
      case 'LINK': return <Link className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getCompletionStats = () => {
    const totalLessons = sections.reduce((sum, section) => sum + section.lessons.length, 0);
    const publishedLessons = sections.reduce(
      (sum, section) => sum + section.lessons.filter(l => l.status === 'published').length,
      0
    );
    return { totalLessons, publishedLessons };
  };

  const { totalLessons, publishedLessons } = getCompletionStats();
  const completionPercentage = totalLessons > 0 ? (publishedLessons / totalLessons) * 100 : 0;

  const saveCourse = async () => {
    toast({
      title: "Course Saved",
      description: "Your course structure has been saved successfully.",
    });
  };

  const submitForReview = async () => {
    if (totalLessons === 0) {
      toast({
        title: "No Content",
        description: "Please add at least one lesson before submitting for review.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Submitted for Review",
      description: "Your course has been submitted for admin approval.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{courseName}</h1>
          <p className="text-muted-foreground">Build your course content</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={saveCourse}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button onClick={submitForReview}>
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Course Progress</span>
            <span className="text-sm font-normal">
              {publishedLessons}/{totalLessons} lessons completed
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={completionPercentage} className="h-2 mb-4" />
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{sections.length}</div>
              <div className="text-sm text-muted-foreground">Sections</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalLessons}</div>
              <div className="text-sm text-muted-foreground">Lessons</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Structure */}
      <div className="space-y-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                    className="text-lg font-semibold bg-transparent border-none outline-none focus:bg-muted rounded px-2 py-1"
                  />
                  <Badge variant="outline">
                    {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addLesson(section.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Lesson
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => addLesson(section.id)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lesson
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteSection(section.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Section
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {section.lessons.length > 0 ? (
                <div className="space-y-2">
                  {section.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {getLessonIcon(lesson.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium">{lesson.title}</h4>
                            <Badge
                              variant={lesson.status === 'published' ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {lesson.status}
                            </Badge>
                            {lesson.isPreview && (
                              <Badge variant="outline" className="text-xs">
                                Preview
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <span>{lesson.type}</span>
                            </span>
                            {lesson.duration && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{lesson.duration}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveLessonUp(section.id, lesson.id)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveLessonDown(section.id, lesson.id)}
                          disabled={index === section.lessons.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editLesson(section.id, lesson)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLesson(section.id, lesson.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4" />
                  <p>No lessons in this section</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => addLesson(section.id)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Lesson
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Add Section Button */}
        <Button
          variant="outline"
          onClick={addSection}
          className="w-full h-16 border-dashed"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Section
        </Button>
      </div>

      {/* Lesson Upload Dialog */}
      <Dialog open={showLessonUpload} onOpenChange={setShowLessonUpload}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson?.lesson ? 'Edit Lesson' : 'Create New Lesson'}
            </DialogTitle>
            <DialogDescription>
              Add engaging content to help students learn effectively
            </DialogDescription>
          </DialogHeader>
          {editingLesson && (
            <LessonUpload
              courseId={courseId}
              onSave={saveLesson}
              onCancel={() => {
                setShowLessonUpload(false);
                setEditingLesson(null);
              }}
              existingLesson={editingLesson.lesson}
              lessonOrder={
                sections.find(s => s.id === editingLesson.sectionId)?.lessons.length || 0 + 1
              }
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseBuilder;
