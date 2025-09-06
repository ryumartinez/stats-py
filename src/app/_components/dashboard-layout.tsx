"use client"

import React from "react";

export const DashboardLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      {/* Using a style tag for complex grid layouts can be cleaner.
                This defines the grid areas for each child of `.dashboard-grid`.
            */}
      <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    grid-template-rows: repeat(6, 1fr);
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
                .dashboard-grid > *:nth-child(8) { grid-row: 5 / 7; grid-column: 1 / 4; } /* Spans 2 rows, 3 cols */

                /* This class ensures the children shrink and don't overflow */
                .grid-child {
                    min-height: 0;
                    overflow: hidden;
                }
            `}</style>
      <div className="h-screen w-full gap-4 p-4 bg-gray-50 dashboard-grid">
        {/* We map over the children to wrap them in a div with the necessary class */}
        {React.Children.map(children, (child) => (
          <div className="grid-child">{child}</div>
        ))}
      </div>
    </>
  );
};