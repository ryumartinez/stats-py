import { api, HydrateClient } from "~/trpc/server";
import { AmountYearChartBar } from "~/app/_components/amount-year-chart-bar";
import { AmountMonthChartBar } from "~/app/_components/amount-month-chart-bar";
import { AmountYearChartAreaLinear } from "~/app/_components/amount-year-chart-area-lineal";
import { AmountMonthChartLineMultiple } from "~/app/_components/amount-month-chart-line-multiple";
import { DashboardLayout } from "~/app/_components/dashboard-layout";
import StatWrapper from "~/app/_components/stat-wrapper";

export default async function Home() {
  const amountYearData = [
    { year: "2021", amount: 186 },
    { year: "2022", amount: 305 },
    { year: "2023", amount: 237 },
    { year: "2024", amount: 73 },
    { year: "2025", amount: 209 },
  ]

  const amountMonthData = [
    { month: "Enero", amount: 120 },
    { month: "Febrero", amount: 150 },
    { month: "Marzo", amount: 95 },
    { month: "Abril", amount: 180 },
    { month: "Mayo", amount: 210 },
    { month: "Junio", amount: 186 },
    { month: "Julio", amount: 305 },
    { month: "Agosto", amount: 237 },
    { month: "Setiembre", amount: 73 },
    { month: "Octubre", amount: 209 },
    { month: "Noviembre", amount: 214 },
    { month: "Diciembre", amount: 175 },
  ]

  const amountMonthChartMultipleData = [
    { month: "January", amount1: 120, amount2: 90 },
    { month: "February", amount1: 150, amount2: 100 },
    { month: "March", amount1: 95, amount2: 110 },
    { month: "April", amount1: 180, amount2: 130 },
    { month: "May", amount1: 210, amount2: 150 },
    { month: "June", amount1: 186, amount2: 140 },
    { month: "July", amount1: 305, amount2: 200 },
    { month: "August", amount1: 237, amount2: 120 },
    { month: "September", amount1: 73, amount2: 190 },
    { month: "October", amount1: 209, amount2: 170 },
    { month: "November", amount1: 214, amount2: 160 },
    { month: "December", amount1: 175, amount2: 180 },
  ]

  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <DashboardLayout rowHeight="200px">
        <AmountYearChartBar data={amountYearData} />
        <AmountYearChartBar data={amountYearData} />
        <AmountYearChartBar data={amountYearData} />
        <StatWrapper name="Total Validaciones" value="678" unit="M">
          <AmountMonthChartBar data={amountMonthData} />
        </StatWrapper>
        <StatWrapper name="Total Kilometros" value="444" unit="M">
          <AmountMonthChartBar data={amountMonthData} />
        </StatWrapper>
        <StatWrapper name="IPK" value="1.53">
          <AmountMonthChartBar data={amountMonthData} />
        </StatWrapper>
        <div className="h-full rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center">
          <span className="font-medium text-amber-800">Tall Info Box</span>
        </div>
        <AmountMonthChartLineMultiple data={amountMonthChartMultipleData} />
      </DashboardLayout>
    </HydrateClient>
  );
}
