import React from "react";

interface ChartDetailsProps {
  children: React.ReactNode;
  title: string;
  description: string;
  questionMarkText?: string;
}

export default function ChartHeader(props: ChartDetailsProps) {
  return (
    <div>
      <div>
        <h3 className="text-base font-semibold text-gray-900 text-center">{props.title}</h3>
        <p className="max-w-4xl text-sm text-gray-500 text-center">
          {props.description}
        </p>
      </div>
      {props.children}
    </div>
  )
}