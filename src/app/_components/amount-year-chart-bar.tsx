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

interface AmountYearChartBarProps {
  data: {
    year: string
    amount: number
  }[]
}

export function AmountYearChartBar({ data }: AmountYearChartBarProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[150px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="year"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="amount" fill="var(--color-amount)">
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