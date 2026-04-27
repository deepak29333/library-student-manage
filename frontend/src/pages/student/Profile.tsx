import React, { useEffect, useState } from 'react';
import { User, Hash, Building2, CalendarDays, Loader2 } from 'lucide-react';
import { getMyProfile } from '@/api/student.api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import type { Student } from '@/types';

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex items-center justify-between py-2.5">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProfile()
      .then(setProfile)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Your library membership details</p>
      </div>

      <div className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-5">
        <div className="bg-primary/10 rounded-full p-3">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
          <p className="text-sm text-slate-500">{user?.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Membership Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Separator className="mb-2" />
          {profile ? (
            <>
              <DetailRow
                label="Seat Number"
                value={
                  <span className="flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5 text-slate-400" />
                    {profile.seatNumber}
                  </span>
                }
              />
              <DetailRow
                label="Status"
                value={
                  <Badge variant={profile.status === 'ACTIVE' ? 'success' : 'destructive'}>
                    {profile.status}
                  </Badge>
                }
              />
              <DetailRow
                label="Library"
                value={
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    {profile.library?.name ?? '—'}
                  </span>
                }
              />
              <DetailRow
                label="Join Date"
                value={
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                    {new Date(profile.joinDate).toLocaleDateString()}
                  </span>
                }
              />
              <DetailRow
                label="Member Since"
                value={new Date(profile.createdAt).toLocaleDateString()}
              />
            </>
          ) : (
            <p className="text-sm text-slate-400 py-4 text-center">Profile data unavailable</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
