import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Activity, PieChart } from "lucide-react"
import TradingChart from "./components/TradingChart"
import CurrencyPairs from "./components/CurrencyPairs"
import RecentTrades from "./components/RecentTrades"
import DashboardNav from "./components/DashboardNav"
import { getCurrentUser } from "../actions/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const { user, profile } = await getCurrentUser()

  // If no user, redirect to login
  if (!user || !profile) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNav />

      <main className="container mx-auto px-4 py-6">
        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Account Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${profile.account_balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Demo Account
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Equity</CardTitle>
              <Activity className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$26,142.18</div>
              <p className="text-xs text-blue-400">Available margin: $24,847.32</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">P&L Today</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">+$294.86</div>
              <p className="text-xs text-slate-400">+1.14% daily return</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">Open Positions</CardTitle>
              <PieChart className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">7</div>
              <p className="text-xs text-slate-400">Total exposure: $15,420</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Trading Chart */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">EUR/USD</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      1.0847
                    </Badge>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      +0.0023 (+0.21%)
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TradingChart />
                <div className="flex space-x-2 mt-4">
                  <Button className="bg-green-600 hover:bg-green-700 flex-1">BUY 1.0847</Button>
                  <Button variant="destructive" className="flex-1">
                    SELL 1.0845
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Currency Pairs */}
          <div>
            <CurrencyPairs />
          </div>
        </div>

        {/* Recent Trades */}
        <div className="mt-8">
          <RecentTrades />
        </div>
      </main>
    </div>
  )
}
