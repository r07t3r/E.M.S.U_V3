import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, FlaskConical, Book } from "lucide-react";

interface Grade {
  id: string;
  subject: { name: string };
  score: string;
  maxScore: string;
  assessmentType: string;
  createdAt: string;
}

interface RecentGradesProps {
  grades: Grade[];
}

export default function RecentGrades({ grades }: RecentGradesProps) {
  const getSubjectIcon = (subjectName: string) => {
    if (subjectName.toLowerCase().includes('math')) return Calculator;
    if (subjectName.toLowerCase().includes('chemistry')) return FlaskConical;
    return Book;
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 70) return "text-blue-600";
    if (percentage >= 60) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Grades</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {grades.length > 0 ? (
            grades.slice(0, 3).map((grade) => {
              const IconComponent = getSubjectIcon(grade.subject?.name || 'Unknown');
              const percentage = grade.score && grade.maxScore 
                ? (parseFloat(grade.score) / parseFloat(grade.maxScore)) * 100 
                : 0;
              
              return (
                <div key={grade.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="text-primary" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{grade.subject?.name || 'Unknown Subject'}</h4>
                      <p className="text-sm text-muted-foreground">{grade.assessmentType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-lg font-bold ${getGradeColor(percentage)}`}>
                      {percentage.toFixed(0)}%
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {new Date(grade.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No grades available yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
