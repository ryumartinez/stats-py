import { api, HydrateClient } from "~/trpc/server";
import { AmountMonthChartLineMultiple } from "~/app/_components/amount-month-chart-line-multiple";
import { SubsidioDashboardLayout } from "~/app/_layouts/subsidio-dashboard-layout";
import StatSummary from "~/app/_components/stat-summary";
import ChartHeader from "~/app/_components/chart-header";
import { TimeAmountBarChart } from "~/app/_components/time-amount-bar-chart";
import { TimeAmountAreaChart } from "~/app/_components/time-amount-area-chart";

export default async function Home() {
  const amountYearData = [
    { time: "2021", amount: 186 },
    { time: "2022", amount: 305 },
    { time: "2023", amount: 237 },
    { time: "2024", amount: 73 },
    { time: "2025", amount: 209 },
  ]

  const amountMonthData = [
    { time: "Enero", amount: 120 },
    { time: "Febrero", amount: 150 },
    { time: "Marzo", amount: 95 },
    { time: "Abril", amount: 180 },
    { time: "Mayo", amount: 210 },
    { time: "Junio", amount: 186 },
    { time: "Julio", amount: 305 },
    { time: "Agosto", amount: 237 },
    { time: "Setiembre", amount: 73 },
    { time: "Octubre", amount: 209 },
    { time: "Noviembre", amount: 214 },
    { time: "Diciembre", amount: 175 },
  ]



  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <SubsidioDashboardLayout rowHeight="200px">
        <ChartHeader title="Validaciones" description="Equivalente a cantidad de pasajes">
          <TimeAmountBarChart data={amountYearData} color="lightblue"/>
        </ChartHeader>

        <ChartHeader title="Kilometros" description="Distancia recorrida por los buses">
          <TimeAmountBarChart data={amountYearData} color="blue"/>
        </ChartHeader>

        <ChartHeader title="IPK - Indice Pasajero por Kilometro" description="Validaciones por Kilometro">
          <TimeAmountBarChart data={amountYearData} color="gray"/>
        </ChartHeader>

        <StatSummary name="Total Validaciones" value="678" unit="M">
          <ChartHeader title="Validaciones" description="">
            <TimeAmountBarChart data={amountMonthData} color="lightblue"/>
          </ChartHeader>
        </StatSummary>

        <StatSummary name="Total Kilometros" value="444" unit="M">
          <ChartHeader title="Kilometros Recorridos" description="">
            <TimeAmountBarChart data={amountMonthData} color="gray"/>
          </ChartHeader>
        </StatSummary>

        <StatSummary name="IPK" value="1.53">
          <ChartHeader title="IPK - Indice Pasajero por Kilometro" description="">
            <TimeAmountBarChart data={amountMonthData} color="blue"/>
          </ChartHeader>
        </StatSummary>

        <div className="h-full rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center">
          <span className="font-medium text-amber-800">Tall Info Box</span>
        </div>
        <TimeAmountAreaChart data={amountYearData} color="gray"/>

      </SubsidioDashboardLayout>
    </HydrateClient>
  );
}
