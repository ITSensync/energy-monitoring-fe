<template>
  <BarChart :chart-data="chartData" :chart-options="chartOptions" />
</template>

<script setup>
import { computed } from "vue";
import BarChart from "./BarChart.vue";

const props = defineProps({
  weeklyData: {
    type: Array,
    default: () => [],
  },
});

const fallbackWeeklyData = [
  { day: "Sunday", total: 0 },
  { day: "Monday", total: 0 },
  { day: "Tuesday", total: 0 },
  { day: "Wednesday", total: 0 },
  { day: "Thursday", total: 0 },
  { day: "Friday", total: 0 },
  { day: "Saturday", total: 0 },
];

const chartData = computed(() => {
  const weeklyData = props.weeklyData.length ? props.weeklyData : fallbackWeeklyData;

  return {
    labels: weeklyData.map((item) => item.day || item.date),
    datasets: [
      {
        label: "Runtime (Hour)",
        data: weeklyData.map((item) => minutesToCappedHours(item.total)),
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;

          if (!chartArea) return "#3B82F6";

          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );

          gradient.addColorStop(1, "#1E3A8A");
          gradient.addColorStop(0, "#70ffff");

          return gradient;
        },
        borderRadius: 8,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#e2e8f0",
        font: {
          size: 16,
          weight: "bold",
        }
      },
    },
    datalabels: {
      anchor: "end",     // posisi relatif ke bar
      align: "top",      // taruh di atas bar
      color: "#94a3b8",
      font: {
        size: 20,
        weight: "bold"
      },
      formatter: (value) => `${value} h`
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#94a3b8",
        font: {
          size: 18,      // Ukuran angka sumbu X
          weight: "bold"
        }
      },
    },
    y: {
      ticks: {
        color: "#94a3b8",
        font: {
          size: 18,
          weight: "bold"
        }
      },
      beginAtZero: true,
      max: 24,
    },
  },
};

function minutesToCappedHours(value) {
  const minutes = Number(value);

  if (!Number.isFinite(minutes)) {
    return 0;
  }

  return Math.min(Number((minutes / 60).toFixed(2)), 24);
}
</script>
