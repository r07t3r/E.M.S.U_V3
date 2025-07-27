import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Plus, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Assignment {
  id: string;
  teacherId: string;
  classId: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  subject?: {
    name: string;
  };
  class?: {
    name: string;
  };
}

interface AssignmentManagerProps {
  userRole: string;
  classId?: string;
  studentId?: string;
}

export default function AssignmentManager({ userRole, classId, studentId }: AssignmentManagerProps) {
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    maxScore: 100,
    classId: classId || "",
    subjectId: ""
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['/api/assignments', { classId, studentId }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (classId) params.set('classId', classId);
      if (studentId) params.set('studentId', studentId);
      
      return fetch(`/api/assignments?${params}`, {
        credentials: 'include',
      }).then(res => res.json());
    },
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: typeof newAssignment) => {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(assignmentData),
      });
      if (!response.ok) throw new Error('Failed to create assignment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
      setNewAssignment({ title: "", description: "", dueDate: "", maxScore: 100, classId: classId || "", subjectId: "" });
      setIsCreateOpen(false);
    },
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignment.title && newAssignment.description && newAssignment.dueDate) {
      createAssignmentMutation.mutate(newAssignment);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="text-gray-500" size={16} />;
      case 'published': return <CheckCircle className="text-green-500" size={16} />;
      case 'closed': return <AlertCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (dueDate: string) => {
    const days = getDaysUntilDue(dueDate);
    if (days < 0) return 'text-red-600';
    if (days <= 2) return 'text-orange-600';
    if (days <= 7) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Assignments
        </CardTitle>
        {userRole === 'teacher' && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus size={16} />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAssignment} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      placeholder="Assignment title"
                      value={newAssignment.title}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Max Score</label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={newAssignment.maxScore}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Class ID</label>
                    <Input
                      placeholder="Enter class ID"
                      value={newAssignment.classId}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, classId: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject ID</label>
                    <Input
                      placeholder="Enter subject ID"
                      value={newAssignment.subjectId}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, subjectId: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="datetime-local"
                    value={newAssignment.dueDate}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    placeholder="Assignment description and instructions..."
                    value={newAssignment.description}
                    onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createAssignmentMutation.isPending}>
                    {createAssignmentMutation.isPending ? "Creating..." : "Create Assignment"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.length > 0 ? (
            assignments.map((assignment: Assignment, index: number) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              const isOverdue = daysUntilDue < 0;
              
              return (
                <motion.div
                  key={assignment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{assignment.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{assignment.subject?.name || 'Unknown Subject'}</span>
                        <span>•</span>
                        <span>{assignment.class?.name || 'Unknown Class'}</span>
                        <span>•</span>
                        <span>Max Score: {assignment.maxScore}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(assignment.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(assignment.status)}
                          {assignment.status}
                        </span>
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {assignment.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} className="text-muted-foreground" />
                        <span className={getDueDateColor(assignment.dueDate)}>
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock size={16} className="text-muted-foreground" />
                        <span className={getDueDateColor(assignment.dueDate)}>
                          {isOverdue ? 
                            `${Math.abs(daysUntilDue)} days overdue` : 
                            daysUntilDue === 0 ? 'Due today' : `${daysUntilDue} days left`
                          }
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                      {userRole === 'student' && (
                        <Button size="sm" className="gap-2">
                          <BookOpen size={16} />
                          Submit Work
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar for deadline proximity */}
                  {!isOverdue && daysUntilDue <= 7 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Time remaining</span>
                        <span>{daysUntilDue} days</span>
                      </div>
                      <Progress 
                        value={Math.max(0, (7 - daysUntilDue) / 7 * 100)} 
                        className="h-2"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-4">No assignments available</p>
              <p className="text-sm text-muted-foreground">
                {userRole === 'teacher' ? 
                  "Create your first assignment using the button above" :
                  "New assignments will appear here when created"
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}