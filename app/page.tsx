import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Shield, Globe, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">ForexPro</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-blue-400">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          Trade Forex Like a
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"> Pro</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Access global markets with advanced trading tools, real-time data, and institutional-grade execution. Start
          your trading journey with the most trusted forex platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Start Trading Now
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-slate-600 hover:bg-slate-800 text-lg px-8 py-3 bg-transparent"
          >
            Try Demo Account
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose ForexPro?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Secure & Regulated</CardTitle>
              <CardDescription className="text-slate-300">
                Your funds are protected with bank-level security and regulatory compliance
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Lightning Fast</CardTitle>
              <CardDescription className="text-slate-300">
                Execute trades in milliseconds with our advanced trading infrastructure
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <Globe className="h-12 w-12 text-blue-400 mb-4" />
              <CardTitle className="text-white">Global Markets</CardTitle>
              <CardDescription className="text-slate-300">
                Trade 50+ currency pairs with tight spreads and deep liquidity
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">$2.5B+</div>
            <div className="text-slate-300">Daily Volume</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">500K+</div>
            <div className="text-slate-300">Active Traders</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">0.1ms</div>
            <div className="text-slate-300">Execution Speed</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
            <div className="text-slate-300">Support</div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 max-w-4xl mx-auto">
          <CardContent className="p-12">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Trading?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of traders who trust ForexPro for their trading success
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 text-lg px-8 py-3">
                Create Free Account
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold text-white">ForexPro</span>
            </div>
            <p className="text-slate-400">© 2024 ForexPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
