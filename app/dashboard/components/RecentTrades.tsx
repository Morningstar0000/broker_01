import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentTrades = [
  {
    id: "1",
    pair: "EUR/USD",
    type: "BUY",
    volume: "0.5",
    openPrice: "1.0825",
    currentPrice: "1.0847",
    pnl: "+$110.00",
    status: "open",
    time: "2 hours ago",
  },
  {
    id: "2",
    pair: "GBP/USD",
    type: "SELL",
    volume: "0.3",
    openPrice: "1.2650",
    currentPrice: "1.2634",
    pnl: "+$48.00",
    status: "open",
    time: "4 hours ago",
  },
  {
    id: "3",
    pair: "USD/JPY",
    type: "BUY",
    volume: "0.2",
    openPrice: "149.20",
    closePrice: "149.82",
    pnl: "+$124.00",
    status: "closed",
    time: "1 day ago",
  },
  {
    id: "4",
    pair: "AUD/USD",
    type: "BUY",
    volume: "0.4",
    openPrice: "0.6745",
    closePrice: "0.6721",
    pnl: "-$96.00",
    status: "closed",
    time: "2 days ago",
  },
]

export default function RecentTrades() {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Recent Trades</CardTitle>
        <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:text-white bg-transparent">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Pair</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Type</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Volume</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Open Price</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Current/Close</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">P&L</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-slate-400">Time</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                  <td className="py-3 px-2 text-white font-medium">{trade.pair}</td>
                  <td className="py-3 px-2">
                    <Badge variant={trade.type === "BUY" ? "default" : "destructive"} className="text-xs">
                      {trade.type}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-slate-300">{trade.volume}</td>
                  <td className="py-3 px-2 text-slate-300">{trade.openPrice}</td>
                  <td className="py-3 px-2 text-slate-300">
                    {trade.status === "open" ? trade.currentPrice : trade.closePrice}
                  </td>
                  <td
                    className={`py-3 px-2 font-medium ${trade.pnl.startsWith("+") ? "text-green-400" : "text-red-400"}`}
                  >
                    {trade.pnl}
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={trade.status === "open" ? "secondary" : "outline"} className="text-xs">
                      {trade.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-slate-400 text-sm">{trade.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
