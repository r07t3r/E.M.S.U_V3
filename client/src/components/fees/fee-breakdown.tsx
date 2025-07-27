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

interface FeeStructure {
  id: string;
  name: string;
  amount: string;
}

interface FeePayment {
  id: string;
  feeStructureId: string;
  amountPaid: string;
  status: string;
}

interface FeeBreakdownProps {
  feeStructures: FeeStructure[];
  feePayments: FeePayment[];
}

export default function FeeBreakdown({ feeStructures, feePayments }: FeeBreakdownProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-orange-100 text-orange-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFeeStatus = (structure: FeeStructure) => {
    const payment = feePayments.find(p => p.feeStructureId === structure.id);
    if (!payment) return { status: 'pending', paid: 0, balance: parseFloat(structure.amount) };
    
    const paid = parseFloat(payment.amountPaid);
    const total = parseFloat(structure.amount);
    const balance = total - paid;
    
    if (balance <= 0) return { status: 'paid', paid, balance: 0 };
    if (paid > 0) return { status: 'partial', paid, balance };
    return { status: 'pending', paid: 0, balance: total };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {feeStructures.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeStructures.map((structure) => {
                const { status, paid, balance } = getFeeStatus(structure);
                
                return (
                  <TableRow key={structure.id}>
                    <TableCell className="font-medium">{structure.name}</TableCell>
                    <TableCell className="text-right">₦{parseFloat(structure.amount).toLocaleString()}</TableCell>
                    <TableCell className="text-right text-green-600">₦{paid.toLocaleString()}</TableCell>
                    <TableCell className="text-right">₦{balance.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No fee information available.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
