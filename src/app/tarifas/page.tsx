import { TarifaLayout } from "~/app/_layouts/tarifa-layout";
import { AmountMonthChartLineMultiple } from "~/app/_components/amount-month-chart-line-multiple";
import ChartHeader from "~/app/_components/chart-header";


const MyPage = () => {

  const tarifaTecnicaYPromedioData = [
    // 2023 Data (Original)
    { month: "Ene 2023", amount1: 4450, amount2: 4600 },
    { month: "Feb 2023", amount1: 4450, amount2: 4500 },
    { month: "Mar 2023", amount1: 4450, amount2: 4450 },
    { month: "Abr 2023", amount1: 4450, amount2: 4000 },
    { month: "May 2023", amount1: 4450, amount2: 4450 },
    { month: "Jun 2023", amount1: 4450, amount2: 4300 },
    { month: "Jul 2023", amount1: 4450, amount2: 4000 },
    { month: "Ago 2023", amount1: 4450, amount2: 4600 },
    { month: "Sep 2023", amount1: 4450, amount2: 4500 },
    { month: "Oct 2023", amount1: 4450, amount2: 4300 },
    { month: "Nov 2023", amount1: 4450, amount2: 4500 },
    { month: "Dec 2023", amount1: 4450, amount2: 4500 },

    // 2024 Data (New)
    { month: "Ene 2024", amount1: 4450, amount2: 4550 },
    { month: "Feb 2024", amount1: 4450, amount2: 4600 },
    { month: "Mar 2024", amount1: 4450, amount2: 4000 },
    { month: "Abr 2024", amount1: 4450, amount2: 4500 },
    { month: "May 2024", amount1: 4450, amount2: 4650 },
    { month: "Jun 2024", amount1: 4450, amount2: 4000 },
    { month: "Jul 2024", amount1: 4450, amount2: 4750 },
    { month: "Ago 2024", amount1: 4450, amount2: 4600 },
    { month: "Sep 2024", amount1: 4450, amount2: 4550 },
    { month: "Oct 2024", amount1: 4450, amount2: 4600 },
    { month: "Nov 2024", amount1: 4450, amount2: 4700 },
    { month: "Dec 2024", amount1: 4450, amount2: 4650 },

    // 2025 Data (New)
    { month: "Ene 2025", amount1: 4450, amount2: 4700 },
    { month: "Feb 2025", amount1: 4450, amount2: 4750 },
    { month: "Mar 2025", amount1: 4450, amount2: 4800 },
    { month: "Abr 2025", amount1: 4450, amount2: 4700 },
    { month: "May 2025", amount1: 4450, amount2: 4850 },
    { month: "Jun 2025", amount1: 4450, amount2: 4000 },
    { month: "Jul 2025", amount1: 4450, amount2: 4800 },
    { month: "Ago 2025", amount1: 4450, amount2: 4900 },
    { month: "Sep 2025", amount1: 4450, amount2: 4850 },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tarifas (2x6 Layout)</h1>

      <TarifaLayout rowHeight="150px">
        {/* This grid will place up to 12 children automatically */}
        <ChartHeader title="Tarifa Tecnica y Promedio (Gs)" description="Descripcion">
          <AmountMonthChartLineMultiple data={tarifaTecnicaYPromedioData}/>
        </ChartHeader>

        <ChartHeader title="Tarifa Tecnica y Promedio (Gs)" description="Descripcion">
          <AmountMonthChartLineMultiple data={tarifaTecnicaYPromedioData}/>
        </ChartHeader>

        <ChartHeader title="Tarifa Tecnica y Promedio (Gs)" description="Descripcion">
          <AmountMonthChartLineMultiple data={tarifaTecnicaYPromedioData}/>
        </ChartHeader>

        <ChartHeader title="Tarifa Tecnica y Promedio (Gs)" description="Descripcion">
          <AmountMonthChartLineMultiple data={tarifaTecnicaYPromedioData}/>
        </ChartHeader>

        <ChartHeader title="Tarifa Tecnica y Promedio (Gs)" description="Descripcion">
          <AmountMonthChartLineMultiple data={tarifaTecnicaYPromedioData}/>
        </ChartHeader>

        <ChartHeader title="Tarifa Tecnica y Promedio (Gs)" description="Descripcion">
          <AmountMonthChartLineMultiple data={tarifaTecnicaYPromedioData}/>
        </ChartHeader>
        {/* ... and so on for up to 12 items */}
      </TarifaLayout>
    </div>
  );
};

export default MyPage;