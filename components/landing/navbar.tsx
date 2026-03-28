'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Workflow } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 h-16 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/40 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <Workflow className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Workflow
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
            Features
          </a>
          <a href="#how-it-works" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
            How It Works
          </a>
          <a href="#pricing" className="text-white/60 hover:text-white transition-colors text-sm font-medium">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/auth/login" className="text-white/60 hover:text-white transition-colors text-sm font-medium hidden sm:block">
            Sign In
          </Link>
          <Link href="/dashboard">
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0 hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              size="sm"
            >
              Start Free
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
