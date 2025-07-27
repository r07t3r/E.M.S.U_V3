import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
  studentId: string;
  class: {
    name: string;
  };
}

interface StudentListProps {
  students: Student[];
}

export default function StudentList({ students }: StudentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {students.length > 0 ? (
            students.map((student) => (
              <div key={student.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={student.user.profileImageUrl} />
                    <AvatarFallback>
                      {student.user.firstName[0]}{student.user.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-foreground">
                      {student.user.firstName} {student.user.lastName}
                    </h4>
                    <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
                  </div>
                </div>
                <Badge variant="secondary">{student.class.name}</Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
