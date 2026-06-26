<template>
  <Swiper
    :modules="[Autoplay, Navigation]"
    :slides-per-view="1"
    :navigation="true"
    :autoplay="{
      delay: 15000,
      disableOnInteraction: false,
    }"
    class="chart-swiper h-full w-full min-w-0 overflow-hidden"
  >
    <SwiperSlide class="min-w-0 pr-10 pl-12">
      <LineChart :chartData="currentData" :chartOptions="chartOptions" />
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LineChart from "./LineChart.vue";

const currentData = {
  labels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30"],
  datasets: [
    {
      label: "Phase 1",
      data: [12.4, 12.0, 11.8, 12.3, 12.1, 12.2, 12.0],
      borderColor: "#A3E635",
      backgroundColor: "rgba(163,230,53,0.12)",
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: "Phase 2",
      data: [11.9, 12.1, 12.0, 12.2, 12.0, 12.1, 11.9],
      borderColor: "#F66D9B",
      backgroundColor: "rgba(246,109,155,0.12)",
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
    {
      label: "Phase 3",
      data: [12.2, 12.3, 12.1, 12.4, 12.2, 12.3, 12.1],
      borderColor: "#38BDF8",
      backgroundColor: "rgba(56,189,248,0.12)",
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
      title: {
        display: true,
        text: "Time", // label sumbu X
        color: "#94a3b8",
        font: {
          size: 12, // ukuran font
          weight: "bold", // normal | bold | 500 | 700
          // style: "italic", // normal | italic
          family: "Arial", // font family
          lineHeight: 1.2,
        },
      },
      grid: {
        color: "rgba(255,255,255,0.05)",
      },
    },
    y: {
      ticks: {
        color: "#94a3b8",
      },
      title: {
        display: true,
        text: "Ampere (A)", // label sumbu X
        color: "#94a3b8",
        font: {
          size: 12, // ukuran font
          weight: "bold", // normal | bold | 500 | 700
          // style: "italic", // normal | italic
          family: "Arial", // font family
          lineHeight: 1.2,
        },
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
