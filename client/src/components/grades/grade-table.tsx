import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Grade {
  id: string;
  subject: { name: string };
  score: string;
  maxScore: string;
  assessmentType: string;
  createdAt: string;
}

interface GradeTableProps {
  grades: Grade[];
}

export default function GradeTable({ grades }: GradeTableProps) {
  const getGradeColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 70) return "bg-blue-100 text-blue-800";
    if (percentage >= 60) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";
    return "F";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Report</CardTitle>
      </CardHeader>
      <CardContent>
        {grades.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Percentage</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => {
                const percentage = grade.score && grade.maxScore 
                  ? (parseFloat(grade.score) / parseFloat(grade.maxScore)) * 100 
                  : 0;
                
                return (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">
                      {grade.subject?.name || 'Unknown Subject'}
                    </TableCell>
                    <TableCell>{grade.assessmentType}</TableCell>
                    <TableCell className="text-center">
                      {grade.score}/{grade.maxScore}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {percentage.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={getGradeColor(percentage)}>
                        {getLetterGrade(percentage)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(grade.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No grades available yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
