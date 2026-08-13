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
    <SwiperSlide class="min-w-0 pr-1 pl-1">
      <LineChart :chartData="currentData" :chartOptions="chartOptions" />
    </SwiperSlide>
  </Swiper>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
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
    buildPhaseDataset(
      "Phase 1",
      "arus1",
      1,
      "#A3E635",
      "rgba(163,230,53,0.12)",
    ),
    buildPhaseDataset(
      "Phase 2",
      "arus2",
      1.7,
      "#F66D9B",
      "rgba(246,109,155,0.12)",
    ),
    buildPhaseDataset(
      "Phase 3",
      "arus3",
      0.5,
      "#38BDF8",
      "rgba(56,189,248,0.12)",
    ),
  ],
}));

const chartOptions = computed(() => {
  const width = windowWidth.value;

  let fontSize;
  let titleFontSize;

  if (width < 640) {
    // Mobile
    fontSize = 10;
    titleFontSize = 12;
  } else if (width < 1024) {
    // Tablet
    fontSize = 14;
    titleFontSize = 18;
  } else {
    // Desktop
    fontSize = 18;
    titleFontSize = 24;
  }

  return {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      datalabels: {
        display: false,
      },

      legend: {
        labels: {
          color: "#ffffff",
          font: {
            size: fontSize,
            weight: "bold",
          },
          boxWidth: width < 640 ? 12 : 20,
          boxHeight: width < 640 ? 6 : 10,
        },
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#94a3b8",
          font: {
            size: fontSize,
            weight: "bold",
          },
          maxRotation: 0,
        },

        title: {
          display: true,
          text: "Time",
          color: "#94a3b8",
          font: {
            size: titleFontSize,
            weight: "bold",
            family: "Arial",
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
            size: fontSize,
            weight: "bold",
          },
        },

        title: {
          display: true,
          text: "Ampere (A)",
          color: "#94a3b8",
          font: {
            size: titleFontSize,
            weight: "bold",
            family: "Arial",
          },
        },

        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
    },
  };
});

function buildPhaseDataset(
  label,
  key,
  multiplier,
  borderColor,
  backgroundColor,
) {
  return {
    label,
    data: props.todayAverageData.map((item) =>
      toScaledNumber(item[key], multiplier),
    ),
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

const windowWidth = ref(window.innerWidth);

function handleResize() {
  windowWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
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
