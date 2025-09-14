"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

interface AreaChartData {
  time: string
  amount: number
}

interface TimeAmountAreaChartProps {
  data: AreaChartData[]
  color: string
}

export function TimeAmountAreaChart(props: TimeAmountAreaChartProps) {
  const chartConfig = {
    amount: {
      label: "amount",
      color: `${props.color}`,
    },
  } satisfies ChartConfig

  return (
    <ChartContainer config={chartConfig} className="min-h-[150px] max-h-[150px] w-full">
      <AreaChart
        accessibilityLayer
        data={props.data}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" hideLabel />}
        />
        <Area
          dataKey="amount"
          type="linear"
          fill="var(--color-amount)"
          fillOpacity={0.4}
          stroke="var(--color-amount)"
        />
      </AreaChart>
    </ChartContainer>
  )
}
