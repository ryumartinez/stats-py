"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart"

const chartConfig = {
  amount1: {
    label: "amount1",
    color: "var(--chart-1)",
  },
  amount2: {
    label: "amount2",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

interface AmountMonthChartLineMultipleProps {
  data: {
    month: string
    amount1: number
    amount2: number
  }[]
}

export function AmountMonthChartLineMultiple({ data }: AmountMonthChartLineMultipleProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[150px] w-full">
      <LineChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Line
          dataKey="amount1"
          type="monotone"
          stroke="var(--color-amount1)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="amount2"
          type="monotone"
          stroke="var(--color-amount2)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
