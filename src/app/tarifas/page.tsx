import { TarifaLayout } from "~/app/_layouts/tarifa-layout";
import { AmountMonthChartLineMultiple } from "~/app/_components/amount-month-chart-line-multiple";


const MyPage = () => {
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tarifas (2x6 Layout)</h1>

      <TarifaLayout rowHeight="150px">
        {/* This grid will place up to 12 children automatically */}
        <AmountMonthChartLineMultiple data={amountMonthChartMultipleData}/>
        <AmountMonthChartLineMultiple data={amountMonthChartMultipleData}/>
        <AmountMonthChartLineMultiple data={amountMonthChartMultipleData}/>
        <AmountMonthChartLineMultiple data={amountMonthChartMultipleData}/>
        <AmountMonthChartLineMultiple data={amountMonthChartMultipleData}/>
        <AmountMonthChartLineMultiple data={amountMonthChartMultipleData}/>
        {/* ... and so on for up to 12 items */}
      </TarifaLayout>
    </div>
  );
};

export default MyPage;