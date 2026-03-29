'use client'

import Link from 'next/link'
import { Workflow } from 'lucide-react'

const footerLinks = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Templates', href: '#' },
    { label: 'API', href: '#' },
  ],
  company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press', href: '#' },
  ],
  resources: [
    { label: 'Documentation', href: '#' },
    { label: 'Guides', href: '#' },
    { label: 'Support', href: '#' },
    { label: 'Community', href: '#' },
  ],
  legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-white/[0.02] backdrop-blur-sm py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Main footer content */}
        <div className="grid md:grid-cols-5 gap-12 md:gap-8 mb-12">
          {/* Branding */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-6">
              <div className="h-8 w-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Workflow className="h-5 w-5 text-white" />
              </div>
              <span className="bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Workflow
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              The no-code workflow automation platform for teams that want to move faster.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-6 capitalize text-sm tracking-wider">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white/50 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-white/50 text-sm">
            <p>&copy; {new Date().getFullYear()} Workflow. All rights reserved.</p>
          </div>

          {/* Social links */}
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-white/50 hover:text-white transition-colors text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
