import { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  Upload,
  Play,
  FileText,
  HelpCircle,
  X,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Settings,
  Eye,
  Clock,
  Monitor,
  Smartphone,
  Film,
  Image,
  Download,
  Link,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface LessonData {
  id?: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'TEXT' | 'PDF' | 'QUIZ' | 'LINK';
  duration?: string;
  order: number;
  isPreview: boolean;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  linkUrl?: string;
  quizData?: QuizData;
}

interface QuizData {
  questions: Array<{
    id: string;
    question: string;
    type: 'multiple-choice' | 'true-false' | 'short-answer';
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
  }>;
  timeLimit?: number;
  passingScore?: number;
}

interface LessonUploadProps {
  courseId: string;
  onSave: (lesson: LessonData) => Promise<void>;
  onCancel: () => void;
  existingLesson?: LessonData;
  lessonOrder: number;
}

const LessonUpload = ({
  courseId,
  onSave,
  onCancel,
  existingLesson,
  lessonOrder
}: LessonUploadProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'VIDEO' | 'TEXT' | 'PDF' | 'QUIZ' | 'LINK'>('VIDEO');
  const [lessonData, setLessonData] = useState<LessonData>({
    title: existingLesson?.title || '',
    description: existingLesson?.description || '',
    type: existingLesson?.type || 'VIDEO',
    duration: existingLesson?.duration || '',
    order: existingLesson?.order || lessonOrder,
    isPreview: existingLesson?.isPreview || false,
    content: existingLesson?.content || '',
    videoUrl: existingLesson?.videoUrl || '',
    fileUrl: existingLesson?.fileUrl || '',
    linkUrl: existingLesson?.linkUrl || '',
    quizData: existingLesson?.quizData || {
      questions: [],
      timeLimit: 30,
      passingScore: 70
    }
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateLessonData = (updates: Partial<LessonData>) => {
    setLessonData(prev => ({ ...prev, ...updates }));
  };

  // File upload handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file based on lesson type
    const validTypes = {
      VIDEO: ['video/mp4', 'video/webm', 'video/quicktime'],
      PDF: ['application/pdf'],
      IMAGE: ['image/jpeg', 'image/png', 'image/webp']
    };

    if (activeTab === 'VIDEO' && !validTypes.VIDEO.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload MP4, WebM, or QuickTime video files.",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === 'PDF' && !validTypes.PDF.includes(file.type)) {
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF files only.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // In a real app, upload to cloud storage (AWS S3, Cloudinary, etc.)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('courseId', courseId);
      formData.append('lessonType', activeTab);

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock successful upload
      const mockUrl = URL.createObjectURL(file);
      
      if (activeTab === 'VIDEO') {
        updateLessonData({ videoUrl: mockUrl });
      } else if (activeTab === 'PDF') {
        updateLessonData({ fileUrl: mockUrl });
      }

      setUploadProgress(100);
      toast({
        title: "Upload Complete",
        description: `${file.name} has been uploaded successfully.`,
      });

    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  const addQuizQuestion = () => {
    const newQuestion = {
      id: crypto.randomUUID(),
      question: '',
      type: 'multiple-choice' as const,
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };

    updateLessonData({
      quizData: {
        ...lessonData.quizData!,
        questions: [...lessonData.quizData!.questions, newQuestion]
      }
    });
  };

  const updateQuizQuestion = (questionId: string, updates: any) => {
    const updatedQuestions = lessonData.quizData!.questions.map(q =>
      q.id === questionId ? { ...q, ...updates } : q
    );

    updateLessonData({
      quizData: {
        ...lessonData.quizData!,
        questions: updatedQuestions
      }
    });
  };

  const removeQuizQuestion = (questionId: string) => {
    const updatedQuestions = lessonData.quizData!.questions.filter(q => q.id !== questionId);
    updateLessonData({
      quizData: {
        ...lessonData.quizData!,
        questions: updatedQuestions
      }
    });
  };

  const handleSave = async () => {
    if (!lessonData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a lesson title.",
        variant: "destructive",
      });
      return;
    }

    // Validate content based on type
    if (lessonData.type === 'VIDEO' && !lessonData.videoUrl) {
      toast({
        title: "Video Required",
        description: "Please upload a video file.",
        variant: "destructive",
      });
      return;
    }

    if (lessonData.type === 'PDF' && !lessonData.fileUrl) {
      toast({
        title: "PDF Required",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (lessonData.type === 'QUIZ' && lessonData.quizData!.questions.length === 0) {
      toast({
        title: "Questions Required",
        description: "Please add at least one quiz question.",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSave({ ...lessonData, type: activeTab });
      toast({
        title: "Lesson Saved",
        description: "Your lesson has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was an error saving your lesson.",
        variant: "destructive",
      });
    }
  };

  const renderUploadArea = (acceptedTypes: string, icon: React.ReactNode, description: string) => (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
        dragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-muted-foreground/25 hover:border-primary/50'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes}
        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
        className="hidden"
      />
      
      {isUploading ? (
        <div className="space-y-4">
          <div className="animate-pulse">{icon}</div>
          <div>
            <p className="font-medium">Uploading...</p>
            <Progress value={uploadProgress} className="w-full max-w-xs mx-auto mt-2" />
            <p className="text-sm text-muted-foreground mt-1">{Math.round(uploadProgress)}%</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {icon}
          <div>
            <p className="font-medium">Drop your file here or click to browse</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {existingLesson ? 'Edit Lesson' : 'Create New Lesson'}
          </h2>
          <p className="text-muted-foreground">
            Add engaging content to your course
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="h-4 w-4 mr-2" />
            Save Lesson
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Lesson Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter lesson title..."
                  value={lessonData.title}
                  onChange={(e) => updateLessonData({ title: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of what students will learn..."
                  value={lessonData.description}
                  onChange={(e) => updateLessonData({ description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (optional)</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 15 mins"
                    value={lessonData.duration}
                    onChange={(e) => updateLessonData({ duration: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="order">Lesson Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={lessonData.order}
                    onChange={(e) => updateLessonData({ order: parseInt(e.target.value) || 1 })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="preview"
                  checked={lessonData.isPreview}
                  onCheckedChange={(checked) => updateLessonData({ isPreview: checked })}
                />
                <Label htmlFor="preview">Allow free preview</Label>
              </div>
            </CardContent>
          </Card>

          {/* Content Type Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Lesson Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(value: any) => {
                setActiveTab(value);
                updateLessonData({ type: value });
              }}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="VIDEO" className="flex items-center space-x-1">
                    <Play className="h-4 w-4" />
                    <span>Video</span>
                  </TabsTrigger>
                  <TabsTrigger value="TEXT" className="flex items-center space-x-1">
                    <FileText className="h-4 w-4" />
                    <span>Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="PDF" className="flex items-center space-x-1">
                    <Download className="h-4 w-4" />
                    <span>PDF</span>
                  </TabsTrigger>
                  <TabsTrigger value="QUIZ" className="flex items-center space-x-1">
                    <HelpCircle className="h-4 w-4" />
                    <span>Quiz</span>
                  </TabsTrigger>
                  <TabsTrigger value="LINK" className="flex items-center space-x-1">
                    <Link className="h-4 w-4" />
                    <span>Link</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="VIDEO" className="mt-6 space-y-4">
                  {lessonData.videoUrl ? (
                    <div className="space-y-4">
                      <div className="bg-black rounded-lg overflow-hidden">
                        <video
                          src={lessonData.videoUrl}
                          controls
                          className="w-full h-64 object-cover"
                          poster="/placeholder.svg"
                        >
                          Your browser does not support video playback.
                        </video>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Video uploaded successfully</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateLessonData({ videoUrl: '' })}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    renderUploadArea(
                      "video/mp4,video/webm,video/quicktime",
                      <Film className="h-12 w-12 mx-auto text-muted-foreground" />,
                      "MP4, WebM, or QuickTime • Max 500MB"
                    )
                  )}
                </TabsContent>

                <TabsContent value="TEXT" className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="content">Lesson Content</Label>
                    <Textarea
                      id="content"
                      placeholder="Write your lesson content here..."
                      value={lessonData.content}
                      onChange={(e) => updateLessonData({ content: e.target.value })}
                      rows={12}
                      className="font-mono"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports Markdown formatting
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="PDF" className="mt-6 space-y-4">
                  {lessonData.fileUrl ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-red-500" />
                          <div>
                            <p className="font-medium">PDF Document</p>
                            <p className="text-sm text-muted-foreground">Ready for students</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateLessonData({ fileUrl: '' })}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    renderUploadArea(
                      "application/pdf",
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground" />,
                      "PDF files • Max 50MB"
                    )
                  )}
                </TabsContent>

                <TabsContent value="QUIZ" className="mt-6 space-y-6">
                  <div className="space-y-4">
                    {/* Quiz Settings */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                        <Input
                          id="timeLimit"
                          type="number"
                          value={lessonData.quizData?.timeLimit || 30}
                          onChange={(e) => updateLessonData({
                            quizData: {
                              ...lessonData.quizData!,
                              timeLimit: parseInt(e.target.value) || 30
                            }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="passingScore">Passing Score (%)</Label>
                        <Input
                          id="passingScore"
                          type="number"
                          value={lessonData.quizData?.passingScore || 70}
                          onChange={(e) => updateLessonData({
                            quizData: {
                              ...lessonData.quizData!,
                              passingScore: parseInt(e.target.value) || 70
                            }
                          })}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Quiz Questions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Questions</h4>
                        <Button onClick={addQuizQuestion} size="sm">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Question
                        </Button>
                      </div>

                      {lessonData.quizData?.questions.map((question, index) => (
                        <Card key={question.id}>
                          <CardContent className="p-4 space-y-4">
                            <div className="flex items-center justify-between">
                              <Label>Question {index + 1}</Label>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeQuizQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>

                            <Input
                              placeholder="Enter your question..."
                              value={question.question}
                              onChange={(e) => updateQuizQuestion(question.id, { question: e.target.value })}
                            />

                            <div>
                              <Label>Question Type</Label>
                              <Select
                                value={question.type}
                                onValueChange={(value) => updateQuizQuestion(question.id, { type: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                                  <SelectItem value="true-false">True/False</SelectItem>
                                  <SelectItem value="short-answer">Short Answer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {question.type === 'multiple-choice' && (
                              <div className="space-y-2">
                                <Label>Options</Label>
                                {question.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-center space-x-2">
                                    <input
                                      type="radio"
                                      name={`question-${question.id}`}
                                      checked={question.correctAnswer === optionIndex}
                                      onChange={() => updateQuizQuestion(question.id, { correctAnswer: optionIndex })}
                                    />
                                    <Input
                                      placeholder={`Option ${optionIndex + 1}`}
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...(question.options || [])];
                                        newOptions[optionIndex] = e.target.value;
                                        updateQuizQuestion(question.id, { options: newOptions });
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            <div>
                              <Label>Explanation (optional)</Label>
                              <Textarea
                                placeholder="Explain the correct answer..."
                                value={question.explanation}
                                onChange={(e) => updateQuizQuestion(question.id, { explanation: e.target.value })}
                                rows={2}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      {lessonData.quizData?.questions.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <HelpCircle className="h-12 w-12 mx-auto mb-4" />
                          <p>No questions added yet</p>
                          <p className="text-sm">Click "Add Question" to create your first quiz question</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="LINK" className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="linkUrl">External Link URL</Label>
                    <Input
                      id="linkUrl"
                      type="url"
                      placeholder="https://example.com"
                      value={lessonData.linkUrl}
                      onChange={(e) => updateLessonData({ linkUrl: e.target.value })}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Link to external resources, articles, or tools
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant="outline">{activeTab}</Badge>
                  {lessonData.isPreview && <Badge variant="secondary">Free Preview</Badge>}
                </div>
                <h4 className="font-semibold">{lessonData.title || 'Untitled Lesson'}</h4>
                {lessonData.description && (
                  <p className="text-sm text-muted-foreground mt-1">{lessonData.description}</p>
                )}
                {lessonData.duration && (
                  <div className="flex items-center space-x-1 mt-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{lessonData.duration}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Advanced Settings</span>
                </div>
                {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
            {showAdvanced && (
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Mobile Optimized</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Download Allowed</Label>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Auto-play Next</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Captions Available</Label>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Monitor className="h-4 w-4 mt-0.5 text-blue-500" />
                  <p>Record in 1080p for best quality</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Smartphone className="h-4 w-4 mt-0.5 text-green-500" />
                  <p>Test on mobile devices</p>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 mt-0.5 text-orange-500" />
                  <p>Keep lessons under 15 minutes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonUpload;
