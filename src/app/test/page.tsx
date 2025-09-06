import { api, HydrateClient } from "~/trpc/server";
import { AmountYearChartBar } from "~/app/_components/amount-year-chart-bar";
import { AmountMonthChartBar } from "~/app/_components/amount-month-chart-bar";
import { AmountYearChartAreaLinear } from "~/app/_components/amount-year-chart-area-lineal";
import { AmountMonthChartLineMultiple } from "~/app/_components/amount-month-chart-line-multiple";

export default async function Home() {
  const amountYearData = [
    { year: "2021", amount: 186 },
    { year: "2022", amount: 305 },
    { year: "2023", amount: 237 },
    { year: "2024", amount: 73 },
    { year: "2025", amount: 209 },
    { year: "2026", amount: 214 },
  ]

  const amountMonthData = [
    { month: "Junio", amount: 186 },
    { month: "Julio", amount: 305 },
    { month: "Agosto", amount: 237 },
    { month: "Setiembre", amount: 73 },
    { month: "Octubre", amount: 209 },
    { month: "Noviembre", amount: 214 },
  ]

  const amountMonthChartMultipleData = [
    { month: "January", amount1: 186, amount2: 80 },
    { month: "February", amount1: 305, amount2: 200 },
    { month: "March", amount1: 237, amount2: 120 },
    { month: "April", amount1: 73, amount2: 190 },
    { month: "May", amount1: 209, amount2: 130 },
    { month: "June", amount1: 214, amount2: 140 },
  ]

  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <div className="grid grid-cols-3 auto-rows-min">
        <AmountYearChartBar data={amountYearData}/>
        <AmountYearChartBar data={amountYearData}/>
        <AmountYearChartBar data={amountYearData}/>
        <AmountMonthChartBar data={amountMonthData}/>
        <AmountMonthChartBar data={amountMonthData}/>
        <AmountMonthChartBar data={amountMonthData}/>
        <AmountYearChartAreaLinear data={amountYearData}/>
        <AmountMonthChartLineMultiple data={amountMonthChartMultipleData}/>
      </div>
    </HydrateClient>
  );
}
