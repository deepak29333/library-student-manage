import React, { useEffect, useState } from 'react';
import { CalendarDays, CalendarCheck, CalendarX, Clock, Loader2 } from 'lucide-react';
import { getMySubscription } from '@/api/subscription.api';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Subscription as SubscriptionType } from '@/types';

const DetailRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <span className="text-sm font-medium text-slate-900">{value}</span>
  </div>
);

const SubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMySubscription()
      .then(setSubscription)
      .catch(() => setError('No active subscription found'))
      .finally(() => setLoading(false));
  }, []);

  const isActive = subscription?.status === 'ACTIVE';

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
        <h1 className="text-2xl font-bold text-slate-900">My Subscription</h1>
        <p className="text-sm text-slate-500 mt-1">Your current library subscription status</p>
      </div>

      {error || !subscription ? (
        <Card>
          <CardContent className="py-10 text-center text-slate-400">
            <CalendarX className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">{error || 'No subscription found'}</p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div
            className={`rounded-xl border-2 p-6 ${
              isActive
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Subscription Status</p>
                <p className={`text-3xl font-bold mt-1 ${isActive ? 'text-green-700' : 'text-red-700'}`}>
                  {isActive ? 'Active' : 'Expired'}
                </p>
              </div>
              <Badge
                variant={isActive ? 'success' : 'destructive'}
                className="text-sm px-3 py-1"
              >
                {subscription.status}
              </Badge>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-primary" />
                Subscription Details
              </CardTitle>
              <CardDescription>Monthly subscription — 30 days cycle</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-2" />
              <DetailRow
                icon={<CalendarCheck className="h-4 w-4" />}
                label="Start Date"
                value={new Date(subscription.startDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
              <DetailRow
                icon={<CalendarX className="h-4 w-4" />}
                label="End Date"
                value={new Date(subscription.endDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Next Due Date"
                value={new Date(subscription.nextDueDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
            </CardContent>
          </Card>

          {!isActive && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              Your subscription has expired. Please contact your library admin for renewal.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubscriptionPage;
