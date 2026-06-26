<template>
  <BarChart :chart-data="chartData" :chart-options="chartOptions" />
</template>

<script setup>
import BarChart from "./BarChart.vue";

const chartData = {
  labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  datasets: [
    {
      label: "Runtime (Hour)",
      data: [22, 24, 21, 23, 18, 20, 19],
      backgroundColor: (context) => {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        // Saat chart pertama kali render, chartArea belum ada
        if (!chartArea) return "#3B82F6";

        const gradient = ctx.createLinearGradient(
          0,
          chartArea.top,
          0,
          chartArea.bottom,
        );

        gradient.addColorStop(1, "#1E3A8A"); // biru tua (atas)
        gradient.addColorStop(0, "#70ffff"); // biru muda (bawah)

        return gradient;
      },
      borderRadius: 8,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#e2e8f0",
      },
    },
    datalabels: {
      anchor: "end",     // posisi relatif ke bar
      align: "top",      // taruh di atas bar
      color: "#94a3b8",
      font: {
        size: 10,
        weight: "bold"
      },
      formatter: (value) => `${value} h`
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#94a3b8",
      },
    },
    y: {
      ticks: {
        color: "#94a3b8",
      },
      beginAtZero: true,
      max: 24,
    },
  },
};
</script>
