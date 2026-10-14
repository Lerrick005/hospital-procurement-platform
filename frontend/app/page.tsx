'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Shield, Zap, Users, TrendingUp, Award, Building2, Heart } from 'lucide-react'
import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'HIPAA compliant with end-to-end encryption for all procurement data.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Insights',
      description: 'Smart recommendations and anomaly detection powered by machine learning.'
    },
    {
      icon: Users,
      title: 'Supplier Management',
      description: 'Comprehensive supplier profiles, performance tracking, and scoring.'
    },
    {
      icon: TrendingUp,
      title: 'Spend Analytics',
      description: 'Real-time budget tracking, forecasting, and optimization tools.'
    },
    {
      icon: Award,
      title: 'Compliance Ready',
      description: 'Automated compliance checks and audit trails for all transactions.'
    },
    {
      icon: Heart,
      title: 'Healthcare Focused',
      description: 'Built specifically for hospitals with medical procurement workflows.'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-healthcare-primary/5 via-transparent to-healthcare-accent/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-healthcare-primary/10 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-healthcare-primary/10 text-healthcare-primary text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-healthcare-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-healthcare-primary" />
              </span>
              Next-Generation Hospital Procurement
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-healthcare-primary to-healthcare-accent bg-clip-text text-transparent">
                MediProcure
              </span>
              <br />
              <span className="text-foreground">Enterprise Procurement</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              AI-powered supplier management and procurement platform built for modern healthcare institutions.
              Streamline operations, reduce costs, and ensure compliance.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="gap-2 text-base h-12 px-8">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="text-base h-12 px-8">
                  Sign In
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {[
                { label: 'Hospitals', value: '200+' },
                { label: 'Suppliers', value: '10,000+' },
                { label: 'Transactions', value: '.5B+' },
                { label: 'Satisfaction', value: '98%' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-healthcare-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for Modern Procurement
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade tools designed specifically for healthcare procurement professionals.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="h-full hover:shadow-soft-lg transition-all duration-300 hover:scale-[1.02]">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-healthcare-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-healthcare-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-r from-healthcare-primary to-healthcare-accent p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-10" />
          
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Procurement?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
              Join hundreds of healthcare institutions already using MediProcure to streamline their procurement operations.
            </p>
            <Link href="/auth/login">
              <Button size="lg" variant="secondary" className="gap-2 text-base h-12 px-8">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
