import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = ({ data }) => {
  const chartContainer = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    console.log("chartingg..")
    if (chartContainer.current) {
      // Destroy previous chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartContainer.current.getContext('2d');
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: data,
      });

      chartInstanceRef.current = newChartInstance;
    }

    // Cleanup: Destroy the chart when the component unmounts
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={chartContainer} />;
};

export default BarChart;
