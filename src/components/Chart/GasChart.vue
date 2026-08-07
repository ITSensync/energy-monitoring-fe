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
import { computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LineChart from "./LineChart.vue";

const props = defineProps({
  history: {
    type: Array,
    default: () => [],
  },
});

const gasData = computed(() => ({
  labels: props.history.slice(-12).map((item) => {
    const date = new Date(item.timestamp || item.createdAt || item.time || Date.now());
    return Number.isNaN(date.getTime())
      ? "--"
      : date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  }),
  datasets: [
    {
      label: "Flow (l/min)",
      data: props.history.slice(-12).map((item) => Number(item.flow ?? item.value ?? 0)),
      borderColor: "#A3E635",
      backgroundColor: "rgba(163,230,53,0.15)",
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointHoverRadius: 5,
    },
  ],
}));

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
