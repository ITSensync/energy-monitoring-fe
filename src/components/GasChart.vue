<template>
  <Swiper
    :modules="[]"
    :slides-per-view="1"
    class="chart-swiper h-full w-full min-w-0 overflow-hidden"
  >
    <SwiperSlide class="min-w-0 pr-10 pl-12">
      <LineChart :chartData="gasData" :chartOptions="chartOptions" />
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LineChart from "./LineChart.vue";

const gasData = {
  labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30"],
  datasets: [
    {
      label: "Gas",
      data: [120, 140, 135, 160, 180, 170, 190],
      borderColor: "#A3E635",
      backgroundColor: "rgba(163,230,53,0.15)",
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
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
  },
  scales: {
    x: {
      ticks: {
        color: "#94a3b8",
      },
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
    },
    y: {
      ticks: {
        color: "#94a3b8",
      },
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
    },
  },
};
</script>

<style>
.swiper-pagination-bullet {
  background: #94a3b8;
}

.swiper-pagination-bullet-active {
  background: #a3e635;
}

.swiper-button-next,
.swiper-button-prev {
  color: #a3e635;
}

.chart-swiper .swiper-wrapper,
.chart-swiper .swiper-slide {
  min-width: 0;
}
</style>
