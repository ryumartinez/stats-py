"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
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
  amount: {
    label: "amount",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface AmountMonthChartBarProps {
  data: {
    month: string
    amount: number
  }[]
}

export function AmountMonthChartBar({ data }: AmountMonthChartBarProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[150px]">
      <BarChart
        accessibilityLayer
        data={data} // Use the 'data' prop here
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}