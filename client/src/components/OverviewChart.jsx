import React, { useMemo } from "react";
import { ResponsiveLine } from "@nivo/line";
import { useTheme, CircularProgress, Box } from "@mui/material";

import { useGetSalesQuery } from "state/api";

const OverviewChart = ({ isDashboard = false, view }) => {
  const theme = useTheme();
  const { data, isLoading } = useGetSalesQuery();

  const [totalSalesLine, totalUnitsLine] = useMemo(() => {
    // Agar data nahi hai toh array todne se bacho
    if (!data) return [[], []];

    const totalSalesLine = {
      id: "totalSales",
      color: theme.palette.secondary.main,
      data: [],
    };

    const totalUnitsLine = {
      id: "totalUnits",
      color: theme.palette.secondary[600],
      data: [],
    };

    if (isDashboard) {
      // 🟢 DASHBOARD MODE: DAILY POS CHART (Fast Moving)
      let dailyData = [...(data.dailyData || [])];

      // Geometry Fix: Agar sirf 1 din ka real data hai, toh line draw karne ke liye kal ka "0" assume karo
      if (dailyData.length === 1) {
        const today = new Date(dailyData[0].date);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        dailyData.unshift({
          date: yesterday.toISOString().split("T")[0],
          totalSales: 0,
          totalUnits: 0,
        });
      }

      // Daily data map karo
      dailyData.forEach(({ date, totalSales, totalUnits }) => {
        // Date ko clean format mein dikhane ke liye (e.g., "20 Mar")
        const dateObj = new Date(date);
        const formattedDate = `${dateObj.getDate()} ${dateObj.toLocaleString('en-US', { month: 'short' })}`;

        totalSalesLine.data.push({ x: formattedDate, y: totalSales });
        totalUnitsLine.data.push({ x: formattedDate, y: totalUnits });
      });

    } else {
      // 🔵 OVERVIEW PAGE MODE: MONTHLY ACCUMULATED DATA
      Object.values(data.monthlyData || []).reduce(
        (acc, { month, totalSales, totalUnits }) => {
          const currentSales = acc.sales + totalSales;
          const currentUnits = acc.units + totalUnits;

          totalSalesLine.data.push({ x: month, y: currentSales });
          totalUnitsLine.data.push({ x: month, y: currentUnits });

          return { sales: currentSales, units: currentUnits };
        },
        { sales: 0, units: 0 }
      );
    }

    return [[totalSalesLine], [totalUnitsLine]];
  }, [data, isDashboard, theme]); 

  // loader
  if (!data || isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress size={20} aria-label="Loading..." color="secondary" />
      </Box>
    );
  }

  return (
    <ResponsiveLine
      data={view === "sales" ? totalSalesLine : totalUnitsLine}
      theme={{
        axis: {
          domain: { line: { stroke: theme.palette.secondary[200] } },
          legend: { text: { fill: theme.palette.secondary[200] } },
          ticks: {
            line: { stroke: theme.palette.secondary[200], strokeWidth: 1 },
            text: { fill: theme.palette.secondary[200] },
          },
        },
        legends: { text: { fill: theme.palette.secondary[200] } },
        tooltip: { container: { color: theme.palette.primary.main } },
      }}
      margin={{ top: 20, right: 50, bottom: 50, left: 70 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: "auto",
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      curve="catmullRom"
      enableArea={isDashboard}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        format: (v) => {
          // Dashboard par humne string pehle hi "20 Mar" bana di hai, Overview par lamba rakhna hai
          return v; 
        },
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : "Month",
        legendOffset: 36,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickValues: 5,
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: isDashboard ? "" : `Total ${view === "sales" ? "Revenue" : "Units"} for Year`,
        legendOffset: -60,
        legendPosition: "middle",
      }}
      enableGridX={false}
      enableGridY={false}
      pointSize={10}
      pointColor={{ theme: "background" }}
      pointBorderWidth={2}
      pointBorderColor={{ from: "serieColor" }}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={
        !isDashboard
          ? [
              {
                anchor: "bottom-right",
                direction: "column",
                justify: false,
                translateX: 30,
                translateY: -40,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]
          : undefined
      }
    />
  );
};

export default OverviewChart;