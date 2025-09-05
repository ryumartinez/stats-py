import { api, HydrateClient } from "~/trpc/server";
import { AmountYearChartBar } from "~/app/_components/amount-year-chart-bar";
import { AmountMonthChartBar } from "~/app/_components/amount-month-chart-bar";

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

  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <AmountYearChartBar data={amountYearData}/>
      <AmountMonthChartBar data={amountMonthData}/>
    </HydrateClient>
  );
}
