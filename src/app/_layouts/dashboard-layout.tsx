"use client"

import React from "react";

// --- Interface for DashboardLayout Props ---
interface DashboardLayoutProps {
  children: React.ReactNode;
  rowHeight?: string;
}

// --- UPDATED DashboardLayout Component ---
// This component no longer has a fixed height and accepts a `rowHeight` prop.
export const DashboardLayout = ({ children, rowHeight = '180px' }: DashboardLayoutProps) => {
  return (
    <>
      {/* Using a style tag for complex grid layouts can be cleaner. */}
      <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                }
                /* Assigning each child to a specific grid area */
                .dashboard-grid > *:nth-child(1) { grid-row: 1 / 2; grid-column: 1 / 2; }
                .dashboard-grid > *:nth-child(2) { grid-row: 1 / 2; grid-column: 2 / 3; }
                .dashboard-grid > *:nth-child(3) { grid-row: 1 / 2; grid-column: 3 / 4; }
                
                /* This is the area to the left of the Tall Info Box, now split into 3 rows */
                .dashboard-grid > *:nth-child(4) { grid-row: 2 / 3; grid-column: 1 / 3; } /* Top item */
                .dashboard-grid > *:nth-child(5) { grid-row: 3 / 4; grid-column: 1 / 3; } /* Middle item */
                .dashboard-grid > *:nth-child(6) { grid-row: 4 / 5; grid-column: 1 / 3; } /* Bottom item */

                /* This is the Tall Info Box, now the 7th child */
                .dashboard-grid > *:nth-child(7) { grid-row: 2 / 5; grid-column: 3 / 4; } /* Spans 3 rows, 1 col */
                
                /* This is the bottom chart, now the 8th child */
                .dashboard-grid > *:nth-child(8) { grid-row: 5 / 6; grid-column: 1 / 4; } /* Spans 1 row, 3 cols */

                /* This class ensures the children shrink and don't overflow */
                .grid-child {
                    min-height: 0;
                    overflow: hidden;
                }
            `}</style>
      {/* The `h-screen` class has been removed.
                The row height is now controlled by the `rowHeight` prop via an inline style.
            */}
      <div
        className="w-full gap-8 dashboard-grid"
        style={{ gridTemplateRows: `repeat(6, ${rowHeight})` }}
      >
        {/* We map over the children to wrap them in a div with the necessary class */}
        {React.Children.map(children, (child) => (
          <div className="grid-child">{child}</div>
        ))}
      </div>
    </>
  );
};