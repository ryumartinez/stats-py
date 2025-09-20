"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

const ChartsPage = () => {
  // Query to fetch all charts
  const { data: charts, refetch: refetchCharts, isLoading } = api.chart.getAll.useQuery();

  // Mutation for creating a new chart
  const createChart = api.chart.create.useMutation({
    onSuccess: () => {
      // After a successful creation, refetch the charts list to update the UI
      void refetchCharts();
      // Reset form fields
      setNewChartName("");
      setUserId(""); // Clear userId field after submission
    },
  });

  // Mutation for deleting a chart
  const deleteChart = api.chart.delete.useMutation({
    onSuccess: () => {
      // Refetch the charts list on successful deletion
      void refetchCharts();
    },
  });

  // State for the new chart form
  const [newChartName, setNewChartName] = useState("");
  const [userId, setUserId] = useState(""); // State for the userId input

  const handleCreateChart = (e: React.FormEvent) => {
    e.preventDefault();
    // Example data - in a real app, this would come from a more complex form
    const exampleData = [
      { date: new Date('2021-01-15'), amount1: 32.9, amount2: null },
      { date: new Date('2021-02-15'), amount1: 31.6, amount2: null },
      { date: new Date('2021-03-15'), amount1: 42.4, amount2: null },
      { date: new Date('2021-04-15'), amount1: 40.0, amount2: null },
      { date: new Date('2021-05-15'), amount1: 41.5, amount2: null },
      { date: new Date('2021-06-15'), amount1: 42.4, amount2: null },
      { date: new Date('2021-07-15'), amount1: 44.9, amount2: null },
      { date: new Date('2021-08-15'), amount1: 36.1, amount2: null },
      { date: new Date('2021-09-15'), amount1: 35.3, amount2: null },
      { date: new Date('2021-10-15'), amount1: 36.3, amount2: null },
      { date: new Date('2021-11-15'), amount1: 35.5, amount2: null },
      { date: new Date('2021-12-15'), amount1: 25.3, amount2: null },
    ];

    createChart.mutate({
      name: newChartName,
      amountUnit: "USD",
      dateUnit: "Month",
      data: exampleData,
    });
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Charts</h1>

      {/* Form to create a new chart */}
      <form onSubmit={handleCreateChart} className="my-4 flex flex-col space-y-2">
        <input
          type="text"
          placeholder="New Chart Name"
          value={newChartName}
          onChange={(e) => setNewChartName(e.target.value)}
          className="rounded border p-2"
        />
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="rounded border p-2"
        />
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white"
          disabled={createChart.isPending}
        >
          {createChart.isPending? "Creating..." : "Create Chart"}
        </button>
      </form>

      {/* Display the list of charts */}
      <div className="space-y-4">
        {isLoading && <p>Loading charts...</p>}
        {charts?.map((chart) => (
          <div key={chart.id} className="rounded border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{chart.name}</h2>
              <button
                onClick={() => deleteChart.mutate({ id: chart.id })}
                className="rounded bg-red-500 px-3 py-1 text-white"
                disabled={deleteChart.isPending}
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Amount Unit: {chart.amountUnit}, Date Unit: {chart.dateUnit}
            </p>
            <ul className="mt-2 list-disc pl-5">
              {chart.data.map((item) => (
                <li key={item.id}>
                  {item.date.toLocaleDateString()}: Amount1: {item.amount1.toString()}, Amount2: {item.amount2?.toString()?? 'N/A'}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </main>
  );
};

export default ChartsPage;