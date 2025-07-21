"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Star, Shield, Zap, Crown, TrendingUp, Users, DollarSign } from "lucide-react"
import DashboardNav from "../components/DashboardNav"

interface AccountType {
  id: string
  name: string
  title: string
  description: string
  minDeposit: number
  maxLeverage: string
  spreads: string
  commission: string
  features: string[]
  benefits: string[]
  riskLevel: "Conservative" | "Moderate" | "Aggressive"
  recommendedFor: string[]
  icon: React.ReactNode
  color: string
  popular?: boolean
}

const accountTypes: AccountType[] = [
  {
    id: "starter",
    name: "Starter Account",
    title: "Perfect for Beginners",
    description: "Ideal for new traders who want to learn and practice with lower risk exposure.",
    minDeposit: 100,
    maxLeverage: "1:50",
    spreads: "From 1.5 pips",
    commission: "No commission",
    features: [
      "Educational resources included",
      "Risk management tools",
      "Demo account access",
      "Basic market analysis",
      "Email support",
      "Mobile trading app",
    ],
    benefits: ["Low minimum deposit", "Beginner-friendly interface", "Educational support", "Risk protection features"],
    riskLevel: "Conservative",
    recommendedFor: ["New traders", "Risk-averse investors", "Learning-focused users"],
    icon: <Shield className="h-8 w-8" />,
    color: "from-green-500 to-emerald-600",
  },
  {
    id: "professional",
    name: "Professional Account",
    title: "For Experienced Traders",
    description: "Designed for traders with experience who want better trading conditions and advanced tools.",
    minDeposit: 1000,
    maxLeverage: "1:200",
    spreads: "From 0.8 pips",
    commission: "0.05% per trade",
    features: [
      "Advanced charting tools",
      "Real-time market data",
      "Professional indicators",
      "Priority customer support",
      "API access",
      "Advanced order types",
      "Market sentiment analysis",
      "Economic calendar",
    ],
    benefits: [
      "Tighter spreads",
      "Higher leverage options",
      "Advanced trading tools",
      "Priority support",
      "Better execution speed",
    ],
    riskLevel: "Moderate",
    recommendedFor: ["Experienced traders", "Active investors", "Strategy developers"],
    icon: <Zap className="h-8 w-8" />,
    color: "from-blue-500 to-cyan-600",
    popular: true,
  },
  {
    id: "vip",
    name: "VIP Account",
    title: "Premium Trading Experience",
    description:
      "Exclusive account for high-volume traders with institutional-grade features and personalized service.",
    minDeposit: 10000,
    maxLeverage: "1:500",
    spreads: "From 0.2 pips",
    commission: "Negotiable",
    features: [
      "Dedicated account manager",
      "Institutional spreads",
      "Custom trading solutions",
      "24/7 phone support",
      "VIP market insights",
      "Exclusive webinars",
      "Priority trade execution",
      "Custom leverage options",
      "Advanced risk management",
      "Personalized trading strategies",
    ],
    benefits: [
      "Lowest spreads available",
      "Dedicated support team",
      "Custom trading conditions",
      "Exclusive market access",
      "Institutional-grade execution",
      "Personalized service",
    ],
    riskLevel: "Aggressive",
    recommendedFor: ["High-volume traders", "Institutional investors", "Professional fund managers"],
    icon: <Crown className="h-8 w-8" />,
    color: "from-purple-500 to-pink-600",
  },
]

export default function AccountTypesPage() {
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null)

  useEffect(() => {
    // Load selected account type from localStorage on component mount
    const savedAccountType = localStorage.getItem("selectedAccountType")
    if (savedAccountType) {
      const parsedAccountType = JSON.parse(savedAccountType)
      setSelectedAccountType(parsedAccountType)
    }
  }, [])

  const handleSelectAccountType = (accountType: AccountType) => {
    setSelectedAccountType(accountType)
    // Store selected account type in localStorage for persistence
    localStorage.setItem("selectedAccountType", JSON.stringify(accountType))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Conservative":
        return "text-green-400 bg-green-400/10 border-green-400"
      case "Moderate":
        return "text-blue-400 bg-blue-400/10 border-blue-400"
      case "Aggressive":
        return "text-red-400 bg-red-400/10 border-red-400"
      default:
        return "text-slate-400 bg-slate-400/10 border-slate-400"
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <DashboardNav />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Choose Your Account Type</h1>
          <p className="text-slate-300">
            Select the account type that best matches your trading experience and investment goals
          </p>
        </div>

        {/* Current Account Type Banner */}
        {selectedAccountType && (
          <Card className={`bg-gradient-to-r ${selectedAccountType.color} border-0 mb-8`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-white">{selectedAccountType.icon}</div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-white">{selectedAccountType.name}</h3>
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-white/90">{selectedAccountType.title}</p>
                    <p className="text-white/80 text-sm">Currently active account type</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{selectedAccountType.maxLeverage}</div>
                  <p className="text-white/90 text-sm">Max Leverage</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Types Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {accountTypes.map((accountType) => (
            <Card
              key={accountType.id}
              className={`bg-slate-800 border-slate-700 hover:border-blue-500 transition-all duration-300 relative ${
                selectedAccountType?.id === accountType.id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {accountType.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`mx-auto p-4 rounded-full bg-gradient-to-r ${accountType.color} w-fit mb-4`}>
                  <div className="text-white">{accountType.icon}</div>
                </div>
                <CardTitle className="text-2xl text-white">{accountType.name}</CardTitle>
                <p className="text-slate-300 font-medium">{accountType.title}</p>
                <p className="text-slate-400 text-sm mt-2">{accountType.description}</p>
                <Badge className={getRiskColor(accountType.riskLevel)} variant="outline">
                  {accountType.riskLevel} Risk
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Specifications */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">${accountType.minDeposit.toLocaleString()}</div>
                    <p className="text-xs text-slate-400">Min Deposit</p>
                  </div>
                  <div className="text-center p-3 bg-slate-700/50 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                    <div className="text-lg font-bold text-white">{accountType.maxLeverage}</div>
                    <p className="text-xs text-slate-400">Max Leverage</p>
                  </div>
                </div>

                {/* Trading Conditions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white text-sm">Trading Conditions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Spreads:</span>
                      <span className="text-white font-medium">{accountType.spreads}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Commission:</span>
                      <span className="text-white font-medium">{accountType.commission}</span>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white text-sm">Key Features</h4>
                  <div className="space-y-2">
                    {accountType.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-slate-300 text-sm">{feature}</span>
                      </div>
                    ))}
                    {accountType.features.length > 4 && (
                      <p className="text-slate-400 text-xs">+{accountType.features.length - 4} more features</p>
                    )}
                  </div>
                </div>

                {/* Recommended For */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-white text-sm">Recommended For</h4>
                  <div className="flex flex-wrap gap-2">
                    {accountType.recommendedFor.map((recommendation, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {recommendation}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectAccountType(accountType)}
                  className={`w-full ${
                    selectedAccountType?.id === accountType.id
                      ? "bg-green-600 hover:bg-green-700"
                      : `bg-gradient-to-r ${accountType.color} hover:opacity-90`
                  }`}
                >
                  {selectedAccountType?.id === accountType.id ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Current Account
                    </>
                  ) : (
                    <>
                      <Users className="h-4 w-4 mr-2" />
                      Select This Account
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Account Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Feature</th>
                      {accountTypes.map((account) => (
                        <th key={account.id} className="text-center py-3 px-4 text-sm font-medium text-white">
                          {account.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-slate-300">Minimum Deposit</td>
                      {accountTypes.map((account) => (
                        <td key={account.id} className="text-center py-3 px-4 text-white">
                          ${account.minDeposit.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-slate-300">Maximum Leverage</td>
                      {accountTypes.map((account) => (
                        <td key={account.id} className="text-center py-3 px-4 text-white">
                          {account.maxLeverage}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-slate-300">Spreads</td>
                      {accountTypes.map((account) => (
                        <td key={account.id} className="text-center py-3 px-4 text-white">
                          {account.spreads}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-slate-700/50">
                      <td className="py-3 px-4 text-slate-300">Commission</td>
                      {accountTypes.map((account) => (
                        <td key={account.id} className="text-center py-3 px-4 text-white">
                          {account.commission}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-slate-300">Risk Level</td>
                      {accountTypes.map((account) => (
                        <td key={account.id} className="text-center py-3 px-4">
                          <Badge className={getRiskColor(account.riskLevel)} variant="outline">
                            {account.riskLevel}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
