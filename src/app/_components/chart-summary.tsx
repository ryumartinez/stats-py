import React from "react";

interface StatWrapperProps {
  children: React.ReactNode;
  name: string;
  value: string;
  unit?: string;
}

export default function ChartSummary(props: StatWrapperProps) {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-3 grid-rows-1">
          <div className="bg-white px-4 py-6 sm:px-6 lg:px-8 col-span-1">
            <p className="text-sm/6 font-medium text-gray-500">{props.name}</p>
            <p className="mt-2 flex items-baseline gap-x-2">
              <span className="text-4xl font-semibold tracking-tight text-gray-900">{props.value}</span>
              {props.unit ? <span className="text-sm text-gray-500">{props.unit}</span> : null}
            </p>
          </div>
          <div className="w-full col-span-2">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  )
}