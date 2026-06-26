<template>
  <Line :data="chartData" :options="chartOptions" />
  <!-- <div class="h-full p-4"></div> -->
</template>

<script setup>
const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },

  chartOptions: {
    type: Object,
    required: true,
  },
});

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js";

import { Line } from "vue-chartjs";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
);
</script>
