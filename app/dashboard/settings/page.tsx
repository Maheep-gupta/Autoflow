'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Lock, Bell, CreditCard, Shield, LogOut, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    workflow_failed: true,
    daily_digest: true,
  })
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    setIsSaving(false)
    toast.success('Changes saved successfully')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account, security, and preferences
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-card to-card/60 border border-border/50 p-1">
            <TabsTrigger value="account" className="gap-2 transition-all duration-300 data-[state=active]:bg-blue-600/20 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400">
              <span className="hidden sm:inline">Account</span>
              <span className="sm:hidden">👤</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 transition-all duration-300 data-[state=active]:bg-green-600/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="gap-2 transition-all duration-300 data-[state=active]:bg-purple-600/20 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 transition-all duration-300 data-[state=active]:bg-red-600/20 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* Profile Section */}
            <div className="bg-gradient-to-br from-card to-card/60 border border-border/50 rounded-lg p-6 backdrop-blur">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                Profile Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Full Name
                  </label>
                  <Input defaultValue="John Doe" className="bg-background/50 border-border/50 hover:border-border/80 transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Email Address
                  </label>
                  <Input defaultValue="john@example.com" type="email" className="bg-background/50 border-border/50 hover:border-border/80 transition-colors" />
                  <p className="text-xs text-muted-foreground mt-2">Your primary login email</p>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">
                    Company
                  </label>
                  <Input defaultValue="Acme Corp" className="bg-background/50 border-border/50 hover:border-border/80 transition-colors" />
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="mt-6 gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  {isSaving ? (
                    <>
                      <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-gradient-to-br from-red-500/5 to-red-500/0 border border-red-500/20 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Deleting your account is permanent and cannot be undone. All your workflows and data will be lost.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your workflows, executions, and data will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="mt-4">
                    <label className="text-sm font-medium mb-2 block">
                      Type <span className="font-bold text-red-600">DELETE</span> to confirm
                    </label>
                    <Input
                      placeholder="Type DELETE"
                      value={deleteConfirm}
                      onChange={(e) => setDeleteConfirm(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="flex gap-3 justify-end mt-6">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      disabled={deleteConfirm !== 'DELETE'}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Delete My Account
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-br from-card to-card/60 border border-border/50 rounded-lg p-6 backdrop-blur">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  {
                    key: 'email',
                    title: 'Email Notifications',
                    description: 'Receive updates and alerts via email',
                    icon: '📧',
                  },
                  {
                    key: 'slack',
                    title: 'Slack Integration',
                    description: 'Send notifications to your Slack workspace',
                    icon: '💬',
                  },
                  {
                    key: 'workflow_failed',
                    title: 'Workflow Failed Alerts',
                    description: 'Get notified immediately when a workflow fails',
                    icon: '⚠️',
                  },
                  {
                    key: 'daily_digest',
                    title: 'Daily Digest',
                    description: 'Receive daily summary of your workflow activity',
                    icon: '📊',
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/30 hover:border-border/50 transition-all group"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xl mt-0.5">{item.icon}</span>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, [item.key]: checked })
                      }
                      className="ml-2"
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleSave} disabled={isSaving} className="mt-6 w-full gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-br from-card to-card/60 border border-border/50 rounded-lg p-6 backdrop-blur">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Billing Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background/30 rounded-lg p-4 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Current Plan</p>
                  <p className="text-2xl font-bold">Professional</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Active</p>
                </div>
                <div className="bg-background/30 rounded-lg p-4 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Monthly Cost</p>
                  <p className="text-2xl font-bold">$99</p>
                  <p className="text-xs text-muted-foreground mt-2">Per month</p>
                </div>
                <div className="bg-background/30 rounded-lg p-4 border border-border/30">
                  <p className="text-xs text-muted-foreground mb-1">Next Billing</p>
                  <p className="text-2xl font-bold">Apr 15</p>
                  <p className="text-xs text-muted-foreground mt-2">2024</p>
                </div>
              </div>
              <Button variant="outline" className="border-border/50 hover:bg-accent/20">
                Manage Subscription
              </Button>
            </div>

            <div className="bg-gradient-to-br from-card to-card/60 border border-border/50 rounded-lg p-6 backdrop-blur">
              <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
              <div className="flex items-center justify-between p-4 border border-border/30 bg-background/30 rounded-lg">
                <div>
                  <p className="font-medium">💳 Visa ending in 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
                <Button variant="ghost" className="text-primary hover:bg-primary/10">
                  Update
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-gradient-to-br from-card to-card/60 border border-border/50 rounded-lg p-6 backdrop-blur">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600 dark:text-red-400" />
                Password
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Change your password to keep your account secure
              </p>
              <Button variant="outline" className="border-border/50 hover:bg-accent/20">
                Change Password
              </Button>
            </div>

            <div className="bg-gradient-to-br from-card to-card/60 border border-border/50 rounded-lg p-6 backdrop-blur">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add an extra layer of security to your account using an authenticator app
              </p>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Shield className="h-4 w-4" />
                Enable 2FA
              </Button>
            </div>

            <div className="bg-gradient-to-br from-card to-card/60 border border-border/50 rounded-lg p-6 backdrop-blur">
              <h3 className="font-semibold text-lg mb-4">Active Sessions</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background/30 border border-border/30 rounded-lg">
                  <div>
                    <p className="font-medium">🖥️ Chrome on macOS</p>
                    <p className="text-sm text-muted-foreground">Last active 2 minutes ago</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30 rounded-full font-medium">
                    Current
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-background/30 border border-border/30 rounded-lg hover:border-border/50 transition-all">
                  <div>
                    <p className="font-medium">📱 Safari on iPhone</p>
                    <p className="text-sm text-muted-foreground">Last active 3 hours ago</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-500/10">
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded">
                  <div>
                    <p className="font-medium">Chrome on macOS</p>
                    <p className="text-sm text-muted-foreground">
                      Last active 2 minutes ago
                    </p>
                  </div>
                  <span className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                    Current
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded">
                  <div>
                    <p className="font-medium">Safari on iPhone</p>
                    <p className="text-sm text-muted-foreground">
                      Last active 3 hours ago
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Revoke
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
