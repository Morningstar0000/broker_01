"use client"

import { useEffect, useRef } from "react"

export default function TradingChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    // Generate sample candlestick data
    const data = []
    let price = 1.082
    for (let i = 0; i < 50; i++) {
      const open = price
      const change = (Math.random() - 0.5) * 0.002
      const close = open + change
      const high = Math.max(open, close) + Math.random() * 0.001
      const low = Math.min(open, close) - Math.random() * 0.001

      data.push({ open, high, low, close })
      price = close
    }

    // Chart dimensions
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Find price range
    const allPrices = data.flatMap((d) => [d.high, d.low])
    const minPrice = Math.min(...allPrices)
    const maxPrice = Math.max(...allPrices)
    const priceRange = maxPrice - minPrice

    // Clear canvas
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i
      ctx.beginPath()
      ctx.moveTo(x, padding)
      ctx.lineTo(x, height - padding)
      ctx.stroke()
    }

    // Draw candlesticks
    const candleWidth = (chartWidth / data.length) * 0.8

    data.forEach((candle, index) => {
      const x = padding + (chartWidth / data.length) * index + (chartWidth / data.length - candleWidth) / 2
      const openY = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight
      const closeY = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight
      const highY = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight
      const lowY = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight

      const isGreen = candle.close > candle.open
      ctx.fillStyle = isGreen ? "#10b981" : "#ef4444"
      ctx.strokeStyle = isGreen ? "#10b981" : "#ef4444"
      ctx.lineWidth = 1

      // Draw wick
      ctx.beginPath()
      ctx.moveTo(x + candleWidth / 2, highY)
      ctx.lineTo(x + candleWidth / 2, lowY)
      ctx.stroke()

      // Draw body
      const bodyTop = Math.min(openY, closeY)
      const bodyHeight = Math.abs(closeY - openY)
      ctx.fillRect(x, bodyTop, candleWidth, bodyHeight)
    })

    // Draw price labels
    ctx.fillStyle = "#94a3b8"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "right"

    for (let i = 0; i <= 5; i++) {
      const price = minPrice + (priceRange / 5) * (5 - i)
      const y = padding + (chartHeight / 5) * i
      ctx.fillText(price.toFixed(4), padding - 10, y + 4)
    }
  }, [])

  return (
    <div className="w-full h-80 bg-slate-900 rounded-lg overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
