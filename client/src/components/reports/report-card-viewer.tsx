import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye } from "lucide-react";
import { motion } from "framer-motion";

interface ReportCard {
  id: string;
  studentId: string;
  academicSessionId: string;
  term: 'first' | 'second' | 'third';
  totalScore: string;
  totalPossible: string;
  average: string;
  position: number;
  classSize: number;
  teacherComment: string;
  principalComment: string;
  nextTermBegins: string;
  isPublished: boolean;
  generatedAt: string;
}

interface ReportCardViewerProps {
  studentId?: string;
}

export default function ReportCardViewer({ studentId }: ReportCardViewerProps) {
  const { data: reportCards = [], isLoading } = useQuery({
    queryKey: ['/api/report-cards', studentId],
    queryFn: () => fetch(`/api/report-cards${studentId ? `?studentId=${studentId}` : ''}`, {
      credentials: 'include',
    }).then(res => res.json()),
  });

  const getTermName = (term: string) => {
    switch (term) {
      case 'first': return '1st Term';
      case 'second': return '2nd Term';
      case 'third': return '3rd Term';
      default: return term;
    }
  };

  const getGradeColor = (average: number) => {
    if (average >= 80) return 'text-green-600 bg-green-50';
    if (average >= 70) return 'text-blue-600 bg-blue-50';
    if (average >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Report Cards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {reportCards.length > 0 ? (
            reportCards.map((reportCard: ReportCard, index: number) => {
              const average = parseFloat(reportCard.average);
              const percentage = parseFloat(reportCard.totalScore) / parseFloat(reportCard.totalPossible) * 100;
              
              return (
                <motion.div
                  key={reportCard.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-lg border bg-gradient-to-r from-background to-muted/20 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {getTermName(reportCard.term)} Report Card
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Generated: {new Date(reportCard.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={reportCard.isPublished ? "default" : "secondary"}>
                        {reportCard.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg bg-background border">
                      <p className="text-sm text-muted-foreground">Total Score</p>
                      <p className="text-2xl font-bold text-foreground">
                        {reportCard.totalScore}/{reportCard.totalPossible}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-background border">
                      <p className="text-sm text-muted-foreground">Percentage</p>
                      <p className={`text-2xl font-bold ${getGradeColor(percentage).split(' ')[0]}`}>
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-background border">
                      <p className="text-sm text-muted-foreground">Average</p>
                      <p className={`text-2xl font-bold ${getGradeColor(average).split(' ')[0]}`}>
                        {average.toFixed(1)}
                      </p>
                    </div>
                    
                    <div className="text-center p-4 rounded-lg bg-background border">
                      <p className="text-sm text-muted-foreground">Position</p>
                      <p className="text-2xl font-bold text-foreground">
                        {reportCard.position}/{reportCard.classSize}
                      </p>
                    </div>
                  </div>

                  {(reportCard.teacherComment || reportCard.principalComment) && (
                    <div className="space-y-3 mb-6">
                      {reportCard.teacherComment && (
                        <div className="p-4 rounded-lg bg-muted/50">
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Class Teacher's Comment:
                          </p>
                          <p className="text-sm text-foreground">
                            {reportCard.teacherComment}
                          </p>
                        </div>
                      )}
                      
                      {reportCard.principalComment && (
                        <div className="p-4 rounded-lg bg-primary/5">
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Principal's Comment:
                          </p>
                          <p className="text-sm text-foreground">
                            {reportCard.principalComment}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {reportCard.nextTermBegins && (
                    <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 mb-4">
                      <p className="text-sm text-blue-800">
                        <strong>Next Term Begins:</strong> {new Date(reportCard.nextTermBegins).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye size={16} />
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download size={16} />
                      Download PDF
                    </Button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <p className="text-muted-foreground mt-4">No report cards available yet</p>
              <p className="text-sm text-muted-foreground">
                Report cards will appear here once they are generated
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}