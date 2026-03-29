'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Bell, Lock, Trash2, Save } from 'lucide-react';

export function SettingsPageContent() {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    emailNotifications: true,
    slackNotifications: false,
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSaveProfile = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast.success('Profile updated', {
        description: 'Your profile has been saved successfully',
      });
    }
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText.toUpperCase() === 'DELETE') {
      toast.error('Account deletion initiated', {
        description: 'Your account will be deleted within 24 hours',
      });
      setDeleteDialogOpen(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 transition-all duration-200">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="danger">Danger</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
              </div>

              <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700 transition-all duration-200">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Manage how you receive updates</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive workflow alerts via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.emailNotifications}
                  onChange={e =>
                    setFormData({ ...formData, emailNotifications: e.target.checked })
                  }
                  className="h-5 w-5 rounded transition-all"
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
                <div>
                  <p className="font-medium text-sm">Slack Notifications</p>
                  <p className="text-xs text-muted-foreground">Send alerts to your Slack workspace</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.slackNotifications}
                  onChange={e =>
                    setFormData({ ...formData, slackNotifications: e.target.checked })
                  }
                  className="h-5 w-5 rounded transition-all"
                />
              </div>

              <Button onClick={() => {
                toast.success('Preferences saved', {
                  description: 'Your notification settings have been updated',
                });
              }} className="bg-blue-600 hover:bg-blue-700 transition-all duration-200">
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="danger" className="space-y-4">
          <Card className="border-red-500/50 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>

            <CardContent>
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                className="transition-all duration-200"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Account Permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              Type <span className="font-mono font-bold">DELETE</span> below to confirm. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Input
            placeholder="Type DELETE to confirm"
            value={deleteConfirmText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteConfirmText(e.target.value)}
            className="mt-4"
          />

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText.toUpperCase() !== 'DELETE'}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
