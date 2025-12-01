import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useLessonProgress } from "@/hooks/useProgress";
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  FileText, 
  Download,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward
} from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  description?: string;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  duration?: string;
  type: 'VIDEO' | 'TEXT' | 'PDF' | 'QUIZ';
  order: number;
}

interface LessonPlayerProps {
  lesson: Lesson;
  onComplete?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

const LessonPlayer = ({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious, 
  hasNext = false, 
  hasPrevious = false 
}: LessonPlayerProps) => {
  const { progress, updateProgress, completeLesson } = useLessonProgress(lesson.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeUpdateRef = useRef<NodeJS.Timeout>();

  // Auto-track video progress
  useEffect(() => {
    if (lesson.type === 'VIDEO' && videoRef.current) {
      const video = videoRef.current;
      
      const handleTimeUpdate = () => {
        const current = video.currentTime;
        const total = video.duration;
        setCurrentTime(current);
        
        if (total > 0) {
          const progressPercentage = (current / total) * 100;
          
          // Update progress every 5 seconds
          if (timeUpdateRef.current) {
            clearTimeout(timeUpdateRef.current);
          }
          
          timeUpdateRef.current = setTimeout(() => {
            updateProgress({
              watchTime: Math.floor(current),
              progress: progressPercentage
            });
          }, 2000);
        }
      };

      const handleLoadedMetadata = () => {
        setDuration(video.duration);
      };

      const handleEnded = () => {
        setIsPlaying(false);
        handleCompleteLesson();
      };

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('ended', handleEnded);

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('ended', handleEnded);
        if (timeUpdateRef.current) {
          clearTimeout(timeUpdateRef.current);
        }
      };
    }
  }, [lesson.id, lesson.type]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleCompleteLesson = async () => {
    try {
      await completeLesson();
      onComplete?.();
    } catch (error) {
      console.error('Failed to complete lesson:', error);
    }
  };

  const handleSeek = (newTime: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (lesson.type === 'VIDEO' && duration > 0) {
      return (currentTime / duration) * 100;
    }
    return progress?.isCompleted ? 100 : 0;
  };

  const renderContent = () => {
    switch (lesson.type) {
      case 'VIDEO':
        return (
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full"
              poster="/placeholder.svg"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <div className="flex-1">
                  <Progress
                    value={getProgressPercentage()}
                    className="h-2 bg-white/20"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      handleSeek(percent * duration);
                    }}
                  />
                </div>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.muted = !isMuted;
                      setIsMuted(!isMuted);
                    }
                  }}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        );

      case 'TEXT':
        return (
          <div className="prose prose-gray max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: lesson.content || '' }}
              className="whitespace-pre-wrap"
            />
          </div>
        );

      case 'PDF':
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">PDF Resource</h3>
            <p className="text-muted-foreground mb-4">
              Download the PDF to view the lesson content.
            </p>
            <Button asChild>
              <a href={lesson.fileUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </a>
            </Button>
          </div>
        );

      case 'QUIZ':
        return (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Interactive Quiz</h3>
            <p className="text-muted-foreground mb-4">
              Test your knowledge with this interactive quiz.
            </p>
            <Button>
              Start Quiz
            </Button>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Content type not supported</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="outline">
                  Lesson {lesson.order}
                </Badge>
                <Badge variant={progress?.isCompleted ? "default" : "secondary"}>
                  {progress?.isCompleted ? "Completed" : "In Progress"}
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2">{lesson.title}</CardTitle>
              {lesson.description && (
                <p className="text-muted-foreground">{lesson.description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {lesson.duration && (
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Content */}
      <Card>
        <CardContent className="p-0">
          {renderContent()}
        </CardContent>
      </Card>

      {/* Lesson Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={onPrevious}
                disabled={!hasPrevious}
              >
                <SkipBack className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              {!progress?.isCompleted && (
                <Button onClick={handleCompleteLesson}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Complete
                </Button>
              )}
            </div>

            <Button
              onClick={onNext}
              disabled={!hasNext}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              Next Lesson
              <SkipForward className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonPlayer;
