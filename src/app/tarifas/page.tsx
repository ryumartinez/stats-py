import { TarifaLayout } from "~/app/_layouts/tarifa-layout";


const MyPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tarifas (2x6 Layout)</h1>

      <TarifaLayout rowHeight="150px">
        {/* This grid will place up to 12 children automatically */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">Item 1</div>
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">Item 2</div>
        <div className="bg-green-100 border border-green-300 rounded-lg p-4">Item 3</div>
        <div className="bg-green-100 border border-green-300 rounded-lg p-4">Item 4</div>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">Item 5</div>
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">Item 6</div>
        {/* ... and so on for up to 12 items */}
      </TarifaLayout>
    </div>
  );
};

export default MyPage;