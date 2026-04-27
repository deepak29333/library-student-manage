import React, { useEffect, useState } from 'react';
import { Plus, GraduationCap, Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getStudents, createStudent } from '@/api/student.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Student } from '@/types';

const Students: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    seatNumber: '',
    joinDate: new Date().toISOString().split('T')[0],
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudents();
      setStudents(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await createStudent({
        name: form.name,
        email: form.email,
        password: form.password,
        seatNumber: parseInt(form.seatNumber, 10),
        joinDate: form.joinDate,
      });
      setOpen(false);
      setForm({ name: '', email: '', password: '', seatNumber: '', joinDate: new Date().toISOString().split('T')[0] });
      await fetchStudents();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to create student',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="text-sm text-slate-500 mt-1">Manage students in your library</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="student@example.com"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Seat Number</Label>
                  <Input
                    type="number"
                    min={1}
                    placeholder="e.g. 12"
                    value={form.seatNumber}
                    onChange={(e) => handleChange('seatNumber', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Join Date</Label>
                  <Input
                    type="date"
                    value={form.joinDate}
                    onChange={(e) => handleChange('joinDate', e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Add Student
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No students yet. Add the first one.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Seat</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">Join Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">{s.user?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">{s.user?.email ?? '—'}</td>
                  <td className="px-4 py-3 text-slate-600">#{s.seatNumber}</td>
                  <td className="px-4 py-3">
                    <Badge variant={s.status === 'ACTIVE' ? 'success' : 'destructive'}>
                      {s.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {new Date(s.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link to={`/library-admin/students/${s.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;
