import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

const currencyPairs = [
  { pair: "EUR/USD", price: "1.0847", change: "+0.0023", percent: "+0.21%", trend: "up" },
  { pair: "GBP/USD", price: "1.2634", change: "-0.0012", percent: "-0.09%", trend: "down" },
  { pair: "USD/JPY", price: "149.82", change: "+0.45", percent: "+0.30%", trend: "up" },
  { pair: "AUD/USD", price: "0.6721", change: "+0.0034", percent: "+0.51%", trend: "up" },
  { pair: "USD/CAD", price: "1.3456", change: "-0.0023", percent: "-0.17%", trend: "down" },
  { pair: "EUR/GBP", price: "0.8587", change: "+0.0015", percent: "+0.17%", trend: "up" },
  { pair: "USD/CHF", price: "0.8923", change: "-0.0008", percent: "-0.09%", trend: "down" },
  { pair: "NZD/USD", price: "0.6234", change: "+0.0021", percent: "+0.34%", trend: "up" },
]

export default function CurrencyPairs() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Currency Pairs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {currencyPairs.map((pair) => (
          <div
            key={pair.pair}
            className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <div>
              <div className="font-medium text-white">{pair.pair}</div>
              <div className="text-sm text-slate-400">{pair.price}</div>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${pair.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                {pair.change}
              </div>
              <div className={`text-xs flex items-center ${pair.trend === "up" ? "text-green-400" : "text-red-400"}`}>
                {pair.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {pair.percent}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
