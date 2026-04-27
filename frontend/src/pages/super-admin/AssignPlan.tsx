import React, { useEffect, useState } from 'react';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { getLibraries, getBillingPlans, assignPlan } from '@/api/library.api';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Library, BillingPlan } from '@/types';

const AssignPlan: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [libraryId, setLibraryId] = useState('');
  const [billingPlanId, setBillingPlanId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    Promise.all([getLibraries(), getBillingPlans()])
      .then(([libs, p]) => {
        setLibraries(libs);
        setPlans(p);
      })
      .catch(() => {});
  }, []);

  const selectedPlan = plans.find((p) => p.id === billingPlanId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await assignPlan(libraryId, billingPlanId);
      const lib = libraries.find((l) => l.id === libraryId);
      setSuccess(`Plan assigned to "${lib?.name}" successfully`);
      setLibraryId('');
      setBillingPlanId('');
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to assign plan',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Assign Billing Plan</h1>
        <p className="text-sm text-slate-500 mt-1">
          Select a library and assign a billing plan to control student limits
        </p>
      </div>

      {plans.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`cursor-pointer transition-all ${
                billingPlanId === plan.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`}
              onClick={() => setBillingPlanId(plan.id)}
            >
              <CardContent className="pt-4 pb-3 text-center">
                <p className="font-semibold text-sm">{plan.name}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {plan.studentLimit === null ? 'Unlimited' : `${plan.studentLimit} students`}
                </p>
                <Badge variant="secondary" className="mt-2 text-xs">
                  ${plan.price}/mo
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            Assign Plan
          </CardTitle>
          <CardDescription>
            {selectedPlan
              ? `Selected: ${selectedPlan.name} (${selectedPlan.studentLimit === null ? 'Unlimited' : selectedPlan.studentLimit + ' students'})`
              : 'Click a plan card above or use the dropdown below'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Library</Label>
              <Select value={libraryId} onValueChange={setLibraryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a library" />
                </SelectTrigger>
                <SelectContent>
                  {libraries.map((lib) => (
                    <SelectItem key={lib.id} value={lib.id}>
                      {lib.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Billing Plan</Label>
              <Select value={billingPlanId} onValueChange={setBillingPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} —{' '}
                      {plan.studentLimit === null ? 'Unlimited' : `${plan.studentLimit} students`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-md px-3 py-2">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || !libraryId || !billingPlanId}
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Assign Plan
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssignPlan;
