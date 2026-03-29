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
    <div className="min-h-screen from-background via-background to-card/10 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold  from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account, security, and preferences
          </p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4  from-card to-card/60 border border-border/50 p-1">
            
            <TabsTrigger value="account">
              Account
            </TabsTrigger>

            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>

            <TabsTrigger value="billing">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>

            <TabsTrigger value="security">
              <Shield className="h-4 w-4" />
              Security
            </TabsTrigger>

          </TabsList>

          {/* ACCOUNT */}
          <TabsContent value="account" className="space-y-6">
            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-4">Profile</h3>

              <Input defaultValue="John Doe" className="mb-3" />
              <Input defaultValue="john@example.com" className="mb-3" />
              <Input defaultValue="Acme Corp" className="mb-3" />

              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            {/* Danger Zone */}
            <div className="border border-red-300 rounded-lg p-6">
              <h3 className="text-red-600 font-semibold mb-3">
                Danger Zone
              </h3>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    Delete Account
                  </Button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Account</AlertDialogTitle>
                    <AlertDialogDescription>
                      This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <Input
                    placeholder="Type DELETE"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                  />

                  <div className="flex gap-2 justify-end mt-4">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={deleteConfirm !== 'DELETE'}>
                      Delete
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>

          {/* NOTIFICATIONS */}
          <TabsContent value="notifications">
            <div className="border rounded-lg p-6 space-y-4">
              {Object.keys(notifications).map((key) => (
                <div key={key} className="flex justify-between">
                  <span>{key}</span>
                  <Switch
                    checked={notifications[key as keyof typeof notifications]}
                    onCheckedChange={(val) =>
                      setNotifications({ ...notifications, [key]: val })
                    }
                  />
                </div>
              ))}

              <Button onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </TabsContent>

          {/* BILLING */}
          <TabsContent value="billing">
            <div className="border rounded-lg p-6">
              <p>Plan: Professional</p>
              <p>$99/month</p>
              <Button variant="outline">Manage</Button>
            </div>
          </TabsContent>

          {/* SECURITY */}
          <TabsContent value="security">
            <div className="border rounded-lg p-6 space-y-4">
              <Button variant="outline">Change Password</Button>
              <Button>Enable 2FA</Button>

              <div>
                <p>Chrome on macOS (Current)</p>
                <p>Safari on iPhone</p>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </div>
    </div>
  )
}