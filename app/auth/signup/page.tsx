import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Workflow, Chrome, Github } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
              <Workflow className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Workflow</span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create your account</h1>
            <p className="text-muted-foreground">
              Start automating your workflows today
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                className="h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                className="h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-10"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-10"
              />
            </div>
            <label className="flex items-start gap-2 cursor-pointer text-sm">
              <input type="checkbox" className="rounded mt-1" />
              <span>
                I agree to the{' '}
                <Link href="#" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>
            <Button className="w-full h-10">Create account</Button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          {/* OAuth */}
          <div className="space-y-3 mb-6">
            <Button variant="outline" className="w-full gap-2 h-10">
              <Chrome className="h-4 w-4" />
              Google
            </Button>
            <Button variant="outline" className="w-full gap-2 h-10">
              <Github className="h-4 w-4" />
              GitHub
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden md:flex items-center justify-center p-12 bg-card relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8">
            <div className="h-20 w-20 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Workflow className="h-10 w-10 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Join Thousands of Teams</h2>
          <p className="text-muted-foreground mb-8">
            Start your free trial and see how Workflow can transform your team's productivity.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>14-day free trial, no credit card</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Unlimited workflows and executions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>24/7 email and chat support</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Dedicated onboarding specialist</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
