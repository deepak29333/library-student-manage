import React, { useEffect, useState } from 'react';
import { UserPlus, Loader2, CheckCircle } from 'lucide-react';
import { getLibraries, createLibraryAdmin } from '@/api/library.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Library } from '@/types';

const LibraryAdmins: React.FC = () => {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    libraryId: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getLibraries().then(setLibraries).catch(() => {});
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await createLibraryAdmin(form);
      setSuccess(`Admin account created for ${form.email}`);
      setForm({ name: '', email: '', password: '', libraryId: '' });
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Failed to create admin',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Library Admins</h1>
        <p className="text-sm text-slate-500 mt-1">Create an admin account and assign them to a library</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Create Admin
          </CardTitle>
          <CardDescription>The admin will be able to manage students for their library</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                placeholder="e.g. Jane Smith"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="admin@library.com"
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
            <div className="space-y-2">
              <Label>Assign to Library</Label>
              <Select
                value={form.libraryId}
                onValueChange={(val) => handleChange('libraryId', val)}
              >
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

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-md px-3 py-2">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={submitting || !form.libraryId}>
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LibraryAdmins;
