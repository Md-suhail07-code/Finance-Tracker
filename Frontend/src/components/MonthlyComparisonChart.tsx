import React from "react";
import { ResponsiveBar } from "@nivo/bar";

interface MonthlyDataPoint {
  income: number;
  expense: number;
}

interface MonthlyComparisonChartProps {
  data: MonthlyDataPoint[];
}

const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({ data }) => {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const formattedData = monthNames.map((month, index) => {
    const apiPoint = data?.[index]?? { income: 0, expense: 0 };
    return {
      month,
      Income: apiPoint.income,
      Expense: apiPoint.expense,
    };
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  // Detect mobile for responsive settings
  const isMobile = typeof window!== 'undefined' && window.innerWidth < 640;

  return (
    <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/5 rounded-2xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Monthly Overview
        </h2>
        <p className="text-[10px] text-zinc-500 mt-0.5">
          Comparison matrix of income versus expense flow
        </p>
      </div>

      <div className="w-full h-64 sm:h-80">
        <ResponsiveBar
          data={formattedData}
          keys={["Income", "Expense"]}
          indexBy="month"
          margin={{
            top: 10,
            right: isMobile? 10 : 10,
            bottom: isMobile? 60 : 40,
            left: isMobile? 35 : 50
          }}
          padding={isMobile? 0.2 : 0.3}
          innerPadding={isMobile? 2 : 0}
          groupMode="grouped"
          colors={["#10b981", "#ef4444"]}
          borderRadius={4}
          theme={{
            background: "transparent",
            text: {
              fill: "#71717a",
              fontSize: isMobile ? 9 : 11,
            },
            axis: {
              domain: { line: { stroke: "transparent" } },
              ticks: { line: { stroke: "transparent" } }
            },
            grid: {
              line: { stroke: "rgba(255, 255, 255, 0.05)", strokeDasharray: "3 3" }
            },
            tooltip: {
              container: {
                background: "#09090b",
                color: "#ffffff",
                fontSize: 12,
                borderRadius: 12,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }
            }
          }}
          axisBottom={{
            tickSize: 0,
            tickPadding: 10,
            tickRotation: isMobile? -45 : 0, // Rotate labels on mobile
            truncateTickAt: 0
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 5,
            tickValues: isMobile? 3 : 5, // Fewer ticks on mobile
            format: (value) =>
              new Intl.NumberFormat("en-IN", {
                notation: "compact",
                maximumFractionDigits: isMobile? 0 : 1
              }).format(value)
          }}
          enableLabel={false}
          tooltip={({ id, value, color }) => (
            <div className="flex items-center gap-2 px-3 py-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-medium">{id}:</span>
              <span>{formatCurrency(value)}</span>
            </div>
          )}
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateY: isMobile? 55 : 40,
              itemWidth: isMobile? 70 : 80,
              itemHeight: 20,
              itemTextColor: "#a1a1aa",
              symbolSize: 10,
              symbolShape: "circle",
              itemDirection: "left-to-right"
            }
          ]}
          animate={true}
          motionConfig="gentle"
        />
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;