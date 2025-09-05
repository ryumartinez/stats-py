import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import { ChartBarLabel } from "~/app/_components/chart-bar-label";
import { AmountYearChartBar } from "~/app/_components/amount-year-chart-bar";

export default async function Home() {
  const chartData = [
    { year: "2021", amount: 186 },
    { year: "2022", amount: 305 },
    { year: "2023", amount: 237 },
    { year: "2024", amount: 73 },
    { year: "2025", amount: 209 },
    { year: "2026", amount: 214 },
  ]

  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <AmountYearChartBar data={chartData}/>
    </HydrateClient>
  );
}
