"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, DollarSign, Activity, PieChart, Shield, Zap, Crown } from "lucide-react"
import TradingChart from "./TradingChart"
import CurrencyPairs from "./CurrencyPairs"
import RecentTrades from "./RecentTrades"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/supabase"

interface DashboardContentProps {
  user: User
  profile: Profile
}

export default function DashboardContent({ user, profile }: DashboardContentProps) {
  const [selectedInvestor, setSelectedInvestor] = useState(null)
  const [selectedAccountType, setSelectedAccountType] = useState(null)

  useEffect(() => {
    // Load selected investor and account type from localStorage
    const savedInvestor = localStorage.getItem("selectedInvestor")
    const savedAccountType = localStorage.getItem("selectedAccountType")

    if (savedInvestor) {
      setSelectedInvestor(JSON.parse(savedInvestor))
    }

    if (savedAccountType) {
      setSelectedAccountType(JSON.parse(savedAccountType))
    }
  }, [])

  const getAccountIcon = (accountId: string) => {
    switch (accountId) {
      case "starter":
        return <Shield className="h-6 w-6" />
      case "professional":
        return <Zap className="h-6 w-6" />
      case "vip":
        return <Crown className="h-6 w-6" />
      default:
        return <Shield className="h-6 w-6" />
    }
  }

  return (
    <main className="container mx-auto px-4 py-6">
      {/* Account Type Banner */}
      {selectedAccountType && (
        <Card className={`bg-gradient-to-r ${selectedAccountType.color} border-0 mb-6`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-white">{getAccountIcon(selectedAccountType.id)}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedAccountType.name}</h3>
                  <p className="text-white/90 text-sm">{selectedAccountType.title}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{selectedAccountType.maxLeverage}</div>
                <p className="text-white/90 text-xs">Max Leverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Investor Banner */}
      {selectedInvestor && (
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 border-0 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {selectedInvestor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Following: {selectedInvestor.name}</h3>
                  <p className="text-purple-100 text-sm">{selectedInvestor.title}</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-purple-100 text-xs">
                      Total: <span className="font-bold">+{selectedInvestor.totalReturn}%</span>
                    </span>
                    <span className="text-purple-100 text-xs">
                      Monthly: <span className="font-bold">+{selectedInvestor.monthlyReturn}%</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-white">{selectedInvestor.successRate}%</div>
                <p className="text-purple-100 text-xs">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
              {selectedAccountType ? selectedAccountType.name : "Demo Account"}
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
  )
}
