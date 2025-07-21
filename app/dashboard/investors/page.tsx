"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Star, Users, BarChart3, Search, CheckCircle, Award } from "lucide-react"
import DashboardNav from "../components/DashboardNav"

interface Investor {
  id: string
  name: string
  avatar: string
  title: string
  experience: number
  totalReturn: number
  monthlyReturn: number
  riskLevel: "Low" | "Medium" | "High"
  followers: number
  successRate: number
  minInvestment: number
  totalAssets: number
  specialties: string[]
  description: string
  verified: boolean
  rating: number
}

const mockInvestors: Investor[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    title: "Senior Portfolio Manager",
    experience: 8,
    totalReturn: 127.5,
    monthlyReturn: 8.2,
    riskLevel: "Medium",
    followers: 2847,
    successRate: 89,
    minInvestment: 1000,
    totalAssets: 12500000,
    specialties: ["Forex", "Commodities", "Risk Management"],
    description:
      "Specializes in currency trading with a focus on major pairs and emerging markets. Proven track record in volatile market conditions.",
    verified: true,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    avatar: "/placeholder.svg?height=100&width=100",
    title: "Quantitative Analyst",
    experience: 12,
    totalReturn: 189.3,
    monthlyReturn: 12.1,
    riskLevel: "High",
    followers: 4521,
    successRate: 76,
    minInvestment: 5000,
    totalAssets: 28750000,
    specialties: ["Algorithmic Trading", "High Frequency", "Derivatives"],
    description:
      "Uses advanced mathematical models and algorithms for high-frequency trading strategies with exceptional returns.",
    verified: true,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Emma Thompson",
    avatar: "/placeholder.svg?height=100&width=100",
    title: "Conservative Growth Specialist",
    experience: 15,
    totalReturn: 94.2,
    monthlyReturn: 4.7,
    riskLevel: "Low",
    followers: 1923,
    successRate: 94,
    minInvestment: 500,
    totalAssets: 8900000,
    specialties: ["Long-term Growth", "Blue Chip", "Dividend Stocks"],
    description:
      "Focuses on steady, long-term growth with minimal risk. Perfect for conservative investors seeking stable returns.",
    verified: true,
    rating: 4.7,
  },
  {
    id: "4",
    name: "David Kim",
    avatar: "/placeholder.svg?height=100&width=100",
    title: "Crypto & Digital Assets",
    experience: 6,
    totalReturn: 245.8,
    monthlyReturn: 15.3,
    riskLevel: "High",
    followers: 6789,
    successRate: 71,
    minInvestment: 2000,
    totalAssets: 15600000,
    specialties: ["Cryptocurrency", "DeFi", "NFTs"],
    description:
      "Pioneer in cryptocurrency trading with deep knowledge of blockchain technology and digital asset markets.",
    verified: true,
    rating: 4.6,
  },
  {
    id: "5",
    name: "Lisa Anderson",
    avatar: "/placeholder.svg?height=100&width=100",
    title: "ESG Investment Specialist",
    experience: 10,
    totalReturn: 112.7,
    monthlyReturn: 6.8,
    riskLevel: "Medium",
    followers: 3456,
    successRate: 87,
    minInvestment: 1500,
    totalAssets: 19200000,
    specialties: ["ESG Investing", "Sustainable Finance", "Green Bonds"],
    description:
      "Combines strong financial returns with environmental and social responsibility. Expert in sustainable investment strategies.",
    verified: true,
    rating: 4.8,
  },
  {
    id: "6",
    name: "James Wilson",
    avatar: "/placeholder.svg?height=100&width=100",
    title: "Emerging Markets Expert",
    experience: 14,
    totalReturn: 156.4,
    monthlyReturn: 9.7,
    riskLevel: "High",
    followers: 2134,
    successRate: 82,
    minInvestment: 3000,
    totalAssets: 22100000,
    specialties: ["Emerging Markets", "International Equity", "Currency Hedging"],
    description:
      "Specializes in high-growth emerging market opportunities with sophisticated risk management techniques.",
    verified: true,
    rating: 4.5,
  },
]

export default function InvestorsPage() {
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("totalReturn")

  const filteredInvestors = mockInvestors
    .filter(
      (investor) =>
        investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        investor.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .filter((investor) => riskFilter === "all" || investor.riskLevel.toLowerCase() === riskFilter)
    .sort((a, b) => {
      switch (sortBy) {
        case "totalReturn":
          return b.totalReturn - a.totalReturn
        case "followers":
          return b.followers - a.followers
        case "successRate":
          return b.successRate - a.successRate
        case "experience":
          return b.experience - a.experience
        default:
          return 0
      }
    })

  const handleSelectInvestor = (investor: Investor) => {
    setSelectedInvestor(investor)
    // Store selected investor in localStorage for persistence
    localStorage.setItem("selectedInvestor", JSON.stringify(investor))
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-400 bg-green-400/10 border-green-400"
      case "Medium":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400"
      case "High":
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
          <h1 className="text-3xl font-bold text-white mb-2">Professional Investors</h1>
          <p className="text-slate-300">
            Choose from our verified professional investors and copy their trading strategies
          </p>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search investors or specialties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Risk Level" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="all">All Risk Levels</SelectItem>
              <SelectItem value="low">Low Risk</SelectItem>
              <SelectItem value="medium">Medium Risk</SelectItem>
              <SelectItem value="high">High Risk</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="totalReturn">Total Return</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="successRate">Success Rate</SelectItem>
              <SelectItem value="experience">Experience</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-slate-300 flex items-center">
            <Users className="h-4 w-4 mr-2" />
            {filteredInvestors.length} investors found
          </div>
        </div>

        {/* Selected Investor Banner */}
        {selectedInvestor && (
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-2 border-white">
                    <AvatarImage src={selectedInvestor.avatar || "/placeholder.svg"} alt={selectedInvestor.name} />
                    <AvatarFallback className="bg-blue-500 text-white text-lg">
                      {selectedInvestor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-white">{selectedInvestor.name}</h3>
                      {selectedInvestor.verified && <CheckCircle className="h-5 w-5 text-white" />}
                    </div>
                    <p className="text-blue-100">{selectedInvestor.title}</p>
                    <p className="text-blue-100 text-sm">Currently following this investor</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">+{selectedInvestor.totalReturn}%</div>
                  <p className="text-blue-100 text-sm">Total Return</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Investors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvestors.map((investor) => (
            <Card key={investor.id} className="bg-slate-800 border-slate-700 hover:border-blue-500 transition-colors">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={investor.avatar || "/placeholder.svg"} alt={investor.name} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {investor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">{investor.name}</h3>
                        {investor.verified && <CheckCircle className="h-4 w-4 text-blue-400" />}
                      </div>
                      <p className="text-sm text-slate-400">{investor.title}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-slate-300">{investor.rating}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={getRiskColor(investor.riskLevel)}>{investor.riskLevel}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-slate-300 line-clamp-2">{investor.description}</p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="text-lg font-bold text-green-400">+{investor.totalReturn}%</span>
                    </div>
                    <p className="text-xs text-slate-400">Total Return</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <BarChart3 className="h-4 w-4 text-blue-400" />
                      <span className="text-lg font-bold text-white">{investor.successRate}%</span>
                    </div>
                    <p className="text-xs text-slate-400">Success Rate</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Monthly Return:</span>
                    <span className="text-green-400 font-medium ml-1">+{investor.monthlyReturn}%</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Followers:</span>
                    <span className="text-white font-medium ml-1">{investor.followers.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Experience:</span>
                    <span className="text-white font-medium ml-1">{investor.experience} years</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Min Investment:</span>
                    <span className="text-white font-medium ml-1">${investor.minInvestment.toLocaleString()}</span>
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <p className="text-xs text-slate-400 mb-2">Specialties:</p>
                  <div className="flex flex-wrap gap-1">
                    {investor.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-slate-600 text-slate-300">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleSelectInvestor(investor)}
                  className={`w-full ${
                    selectedInvestor?.id === investor.id
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {selectedInvestor?.id === investor.id ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <Award className="h-4 w-4 mr-2" />
                      Follow Investor
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredInvestors.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No investors found</h3>
            <p className="text-slate-400">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
