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
import { computed } from "vue";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LineChart from "./LineChart.vue";

const props = defineProps({
  todayAverageData: {
    type: Array,
    default: () => [],
  },
});

const currentData = computed(() => ({
  labels: props.todayAverageData.map((item) => formatWibTime(item.createdAt)),
  datasets: [
    buildPhaseDataset("Phase 1", "arus1", 1, "#A3E635", "rgba(163,230,53,0.12)"),
    buildPhaseDataset("Phase 2", "arus2", 1.7, "#F66D9B", "rgba(246,109,155,0.12)"),
    buildPhaseDataset("Phase 3", "arus3", 0.5, "#38BDF8", "rgba(56,189,248,0.12)"),
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    datalabels: {
      color: "#aaaaaa",
      font: {
        size: 18,
        weight: "bold",
      },
    },
    legend: {
      labels: {
        color: "#ffffff",
        font: {
          size: 20, // Ukuran tulisan legend
          weight: "bold",
        },
        boxWidth: 20,
        boxHeight: 10,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#94a3b8",
        font: {
          size: 18, // Ukuran angka sumbu X
          weight: "bold",
        },
      },
      title: {
        display: true,
        text: "Time", // label sumbu X
        color: "#94a3b8",
        font: {
          size: 24, // ukuran font
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
        font: {
          size: 18, // Ukuran angka sumbu Y
          weight: "bold",
        },
      },
      title: {
        display: true,
        text: "Ampere (A)", // label sumbu X
        color: "#94a3b8",
        font: {
          size: 24, // ukuran font
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

function buildPhaseDataset(label, key, multiplier, borderColor, backgroundColor) {
  return {
    label,
    data: props.todayAverageData.map((item) => toScaledNumber(item[key], multiplier)),
    borderColor,
    backgroundColor,
    tension: 0.4,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 5,
  };
}

function toScaledNumber(value, multiplier) {
  const number = Number(value);
  return Number.isFinite(number) ? Number((number * multiplier).toFixed(2)) : 0;
}

function formatWibTime(value) {
  if (!value) return "--:--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })
    .format(date)
    .replace(".", ":");
}
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
