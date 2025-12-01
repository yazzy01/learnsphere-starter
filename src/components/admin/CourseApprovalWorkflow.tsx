import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  User,
  Calendar,
  DollarSign,
  BookOpen,
  Star,
  Flag,
  MessageSquare,
  Play,
  FileText
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  category: string;
  level: string;
  thumbnail?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'PUBLISHED' | 'ARCHIVED';
  instructor: {
    id: string;
    name: string;
    email: string;
    bio?: string;
  };
  lessons: Array<{
    id: string;
    title: string;
    type: string;
    duration: string;
    order: number;
  }>;
  createdAt: string;
  submittedAt?: string;
  reviewNotes?: string;
}

interface CourseApprovalWorkflowProps {
  course: Course;
  onApprove: (courseId: string, notes?: string) => void;
  onReject: (courseId: string, reason: string) => void;
  onRequestChanges: (courseId: string, changes: string) => void;
}

const CourseApprovalWorkflow = ({
  course,
  onApprove,
  onReject,
  onRequestChanges
}: CourseApprovalWorkflowProps) => {
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [changeRequests, setChangeRequests] = useState("");
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);
  const [showChangesDialog, setShowChangesDialog] = useState(false);

  const getStatusBadge = () => {
    switch (course.status) {
      case 'PENDING_APPROVAL':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending Review</Badge>;
      case 'PUBLISHED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Published</Badge>;
      case 'ARCHIVED':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Archived</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  const getContentQualityScore = () => {
    let score = 0;
    let maxScore = 100;

    // Title quality (20 points)
    if (course.title.length >= 20 && course.title.length <= 60) score += 20;
    else if (course.title.length >= 10) score += 10;

    // Description quality (15 points)
    if (course.description.length >= 100) score += 15;
    else if (course.description.length >= 50) score += 8;

    // Long description quality (15 points)
    if (course.longDescription && course.longDescription.length >= 200) score += 15;
    else if (course.longDescription && course.longDescription.length >= 100) score += 8;

    // Lessons quality (30 points)
    if (course.lessons.length >= 10) score += 30;
    else if (course.lessons.length >= 5) score += 20;
    else if (course.lessons.length >= 3) score += 10;

    // Pricing (10 points)
    if (course.price > 0 && course.price <= 200) score += 10;
    else if (course.price > 0) score += 5;

    // Category and level (10 points)
    if (course.category && course.level) score += 10;

    return Math.min(score, maxScore);
  };

  const qualityScore = getContentQualityScore();

  const handleApprove = () => {
    onApprove(course.id, approvalNotes);
    setShowApprovalDialog(false);
    setApprovalNotes("");
  };

  const handleReject = () => {
    if (rejectionReason.trim()) {
      onReject(course.id, rejectionReason);
      setShowRejectionDialog(false);
      setRejectionReason("");
    }
  };

  const handleRequestChanges = () => {
    if (changeRequests.trim()) {
      onRequestChanges(course.id, changeRequests);
      setShowChangesDialog(false);
      setChangeRequests("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {getStatusBadge()}
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <CardTitle className="text-xl mb-2">{course.title}</CardTitle>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${course.price}</div>
              {course.originalPrice && (
                <div className="text-sm text-muted-foreground line-through">
                  ${course.originalPrice}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Quality Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5" />
            <span>Content Quality Assessment</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Quality Score</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      qualityScore >= 80 ? 'bg-green-600' : 
                      qualityScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                    }`}
                    style={{ width: `${qualityScore}%` }}
                  />
                </div>
                <span className="font-bold">{qualityScore}/100</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Title Quality</span>
                  <span className={course.title.length >= 20 ? 'text-green-600' : 'text-yellow-600'}>
                    {course.title.length >= 20 ? '✓' : '△'} {course.title.length} chars
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Description</span>
                  <span className={course.description.length >= 100 ? 'text-green-600' : 'text-yellow-600'}>
                    {course.description.length >= 100 ? '✓' : '△'} {course.description.length} chars
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lesson Count</span>
                  <span className={course.lessons.length >= 5 ? 'text-green-600' : 'text-yellow-600'}>
                    {course.lessons.length >= 5 ? '✓' : '△'} {course.lessons.length} lessons
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Pricing</span>
                  <span className={course.price > 0 ? 'text-green-600' : 'text-red-600'}>
                    {course.price > 0 ? '✓' : '✗'} ${course.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Category & Level</span>
                  <span className="text-green-600">✓ Set</span>
                </div>
                <div className="flex justify-between">
                  <span>Thumbnail</span>
                  <span className={course.thumbnail ? 'text-green-600' : 'text-yellow-600'}>
                    {course.thumbnail ? '✓' : '△'} {course.thumbnail ? 'Uploaded' : 'Missing'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Details */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="instructor">Instructor</TabsTrigger>
          <TabsTrigger value="history">Review History</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Course Content ({course.lessons.length} lessons)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.lessons.map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{lesson.title}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          {lesson.type === 'VIDEO' ? <Play className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                          <span>{lesson.type}</span>
                          <span>•</span>
                          <span>{lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {course.longDescription && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{course.longDescription}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="instructor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Instructor Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm">{course.instructor.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{course.instructor.email}</p>
                </div>
                {course.instructor.bio && (
                  <div>
                    <Label className="text-sm font-medium">Bio</Label>
                    <p className="text-sm text-muted-foreground">{course.instructor.bio}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Review Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Course Submitted</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(course.submittedAt || course.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {course.reviewNotes && (
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Review Notes</p>
                      <p className="text-sm text-muted-foreground">{course.reviewNotes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Actions */}
      {course.status === 'PENDING_APPROVAL' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Flag className="h-5 w-5" />
              <span>Review Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Course
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Approve Course</DialogTitle>
                    <DialogDescription>
                      Approve "{course.title}" for publication. The course will be visible to students.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="approval-notes">Approval Notes (Optional)</Label>
                      <Textarea
                        id="approval-notes"
                        placeholder="Add any notes for the instructor..."
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowApprovalDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700">
                      Approve Course
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog open={showChangesDialog} onOpenChange={setShowChangesDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request Changes
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request Changes</DialogTitle>
                    <DialogDescription>
                      Send feedback to the instructor about required changes before approval.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="changes">Required Changes *</Label>
                      <Textarea
                        id="changes"
                        placeholder="Describe the changes needed..."
                        value={changeRequests}
                        onChange={(e) => setChangeRequests(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowChangesDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRequestChanges} disabled={!changeRequests.trim()}>
                      Send Feedback
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
                <Button variant="destructive" onClick={() => setShowRejectionDialog(true)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Course
                </Button>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Course</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject "{course.title}"? This action will notify the instructor.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="my-4">
                    <Label htmlFor="rejection-reason">Rejection Reason *</Label>
                    <Textarea
                      id="rejection-reason"
                      placeholder="Explain why the course is being rejected..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleReject}
                      disabled={!rejectionReason.trim()}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Reject Course
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseApprovalWorkflow;
