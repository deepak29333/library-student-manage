import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, CalendarDays, Hash, Loader2 } from 'lucide-react';
import { getStudentById } from '@/api/student.api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { Student, Subscription } from '@/types';

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getStudentById(id)
      .then(setStudent)
      .catch(() => setError('Failed to load student'))
      .finally(() => setLoading(false));
  }, [id]);

  const latestSubscription: Subscription | undefined = student?.subscriptions?.[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-sm">{error || 'Student not found'}</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link to="/library-admin/students">Back to students</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/library-admin/students">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{student.user?.name}</h1>
          <p className="text-sm text-slate-500">{student.user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Student Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-3" />
            <DetailRow label="Name" value={student.user?.name ?? '—'} />
            <DetailRow label="Email" value={student.user?.email ?? '—'} />
            <DetailRow label="Seat Number" value={<span className="flex items-center gap-1"><Hash className="h-3.5 w-3.5" />{student.seatNumber}</span>} />
            <DetailRow
              label="Status"
              value={
                <Badge variant={student.status === 'ACTIVE' ? 'success' : 'destructive'}>
                  {student.status}
                </Badge>
              }
            />
            <DetailRow
              label="Join Date"
              value={new Date(student.joinDate).toLocaleDateString()}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              Subscription
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-3" />
            {latestSubscription ? (
              <>
                <DetailRow
                  label="Status"
                  value={
                    <Badge
                      variant={latestSubscription.status === 'ACTIVE' ? 'success' : 'destructive'}
                    >
                      {latestSubscription.status}
                    </Badge>
                  }
                />
                <DetailRow
                  label="Start Date"
                  value={new Date(latestSubscription.startDate).toLocaleDateString()}
                />
                <DetailRow
                  label="End Date"
                  value={new Date(latestSubscription.endDate).toLocaleDateString()}
                />
                <DetailRow
                  label="Next Due"
                  value={new Date(latestSubscription.nextDueDate).toLocaleDateString()}
                />
              </>
            ) : (
              <p className="text-sm text-slate-400 py-2">No subscription found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetail;
