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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    slack: false,
    workflow_failed: true,
    daily_digest: true,
  })

  return (
    <div className="min-h-screen bg-background p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application settings
          </p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-6">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Full Name
                  </label>
                  <Input defaultValue="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input defaultValue="john@example.com" type="email" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Company
                  </label>
                  <Input defaultValue="Acme Corp" />
                </div>
                <Button className="mt-4">Save Changes</Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-6">Danger Zone</h3>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, email: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">Slack Integration</p>
                    <p className="text-sm text-muted-foreground">
                      Send notifications to Slack
                    </p>
                  </div>
                  <Switch
                    checked={notifications.slack}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, slack: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">Workflow Failed Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Alert when a workflow fails
                    </p>
                  </div>
                  <Switch
                    checked={notifications.workflow_failed}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, workflow_failed: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-muted-foreground">
                      Receive daily summary emails
                    </p>
                  </div>
                  <Switch
                    checked={notifications.daily_digest}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, daily_digest: checked })
                    }
                  />
                </div>
              </div>
              <Button className="mt-6">Save Preferences</Button>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-6">Billing Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Current Plan</p>
                  <p className="text-2xl font-bold">Professional</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Billing Cycle
                  </p>
                  <p>$99 / month</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Next Billing Date
                  </p>
                  <p>April 15, 2024</p>
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-6">Payment Method</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded">
                  <div>
                    <p className="font-medium">Visa ending in 4242</p>
                    <p className="text-sm text-muted-foreground">
                      Expires 12/25
                    </p>
                  </div>
                  <Button variant="ghost">Edit</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-6">Password</h3>
              <Button variant="outline">Change Password</Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-6">Two-Factor Authentication</h3>
              <p className="text-muted-foreground mb-4">
                Add an extra layer of security to your account
              </p>
              <Button>Enable 2FA</Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-6">Active Sessions</h3>
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
