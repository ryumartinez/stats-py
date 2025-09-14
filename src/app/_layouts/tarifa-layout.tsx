"use client"

import React from "react";

// --- Interface for Layout Props ---
interface GridLayoutProps {
  children: React.ReactNode;
  rowHeight?: string;
}

// --- A 2-column, 6-row grid layout named TarifaLayout ---
export const TarifaLayout = ({ children, rowHeight = '180px' }: GridLayoutProps) => {
  return (
    <>
      {/* A style tag for the grid structure.
        Using specific class names like 'tarifa-grid' prevents potential style conflicts.
      */}
      <style>{`
        .tarifa-grid {
            display: grid;
            /* Defines the two columns, each taking up equal space */
            grid-template-columns: repeat(2, 1fr); 
        }

        /* This utility class ensures grid children don't overflow their container */
        .tarifa-grid-child {
            min-height: 0;
            overflow: hidden;
        }
      `}</style>

      {/* The main grid container.
        - 'tarifa-grid' applies our column structure.
        - The inline style dynamically sets the six rows to the specified height.
      */}
      <div
        className="w-full gap-8 tarifa-grid"
        style={{ gridTemplateRows: `repeat(6, ${rowHeight})` }}
      >
        {/* We map over the children to wrap them in a div with the necessary utility class */}
        {React.Children.map(children, (child) => (
          <div className="tarifa-grid-child">{child}</div>
        ))}
      </div>
    </>
  );
};