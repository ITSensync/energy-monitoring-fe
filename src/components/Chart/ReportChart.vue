<template>
  <div ref="chartContainerRef" class="h-full w-full min-w-0 py-1 px-4">
    <LineChart :chartData="currentData" :chartOptions="chartOptions" />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, nextTick } from "vue";
import LineChart from "./LineChart.vue";

const props = defineProps({
  chartData: {
    type: Array,
    default: () => [],
  },
  parameter: {
    type: String,
    default: "",
  },
});

const chartContainerRef = ref(null);

const parameterMeta = computed(() => getParameterMeta(props.parameter));

const currentData = computed(() => ({
  labels: props.chartData.map((item) => formatWibTime(item._terminalTime)),
  datasets: [
    buildPhaseDataset(
      parameterMeta.value.label,
      props.parameter,
      1,
      parameterMeta.value.color,
      parameterMeta.value.fillColor,
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
          text: parameterMeta.value.axisLabel,
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
    data: props.chartData.map((item) => toScaledNumber(item[key], multiplier)),
    borderColor,
    backgroundColor,
    tension: 0.4,
    fill: true,
    pointRadius: 3,
    pointHoverRadius: 5,
  };
}

function getParameterMeta(parameter) {
  const map = {
    arus1: {
      label: "Arus 1",
      axisLabel: "Arus 1 (A)",
      color: "#A3E635",
      fillColor: "rgba(163, 230, 53, 0.12)",
    },
    arus2: {
      label: "Arus 2",
      axisLabel: "Arus 2 (A)",
      color: "#F66D9B",
      fillColor: "rgba(246, 109, 155, 0.12)",
    },
    arus3: {
      label: "Arus 3",
      axisLabel: "Arus 3 (A)",
      color: "#38BDF8",
      fillColor: "rgba(56, 189, 248, 0.12)",
    },
    tegangan: {
      label: "Tegangan",
      axisLabel: "Tegangan (V)",
      color: "#F59E0B",
      fillColor: "rgba(245, 158, 11, 0.12)",
    },
    kwatt: {
      label: "Energy",
      axisLabel: "Energy (kWh)",
      color: "#34D399",
      fillColor: "rgba(52, 211, 153, 0.12)",
    },
    temp: {
      label: "Suhu",
      axisLabel: "Suhu (°C)",
      color: "#FB7185",
      fillColor: "rgba(251, 113, 133, 0.12)",
    },
    getaran: {
      label: "Getaran",
      axisLabel: "Getaran (Hz)",
      color: "#8B5CF6",
      fillColor: "rgba(139, 92, 246, 0.12)",
    },
  };

  return (
    map[parameter] || {
      label: "Parameter",
      axisLabel: "Value",
      color: "#A3E635",
      fillColor: "rgba(163, 230, 53, 0.12)",
    }
  );
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

async function exportChartAsPng() {
  await nextTick();

  const canvas = chartContainerRef.value?.querySelector("canvas");
  if (!canvas) return;

  const link = document.createElement("a");
  const fileName = `${(props.parameter || "chart").toUpperCase()}-${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/[:T]/g, "-")}.png`;

  link.href = canvas.toDataURL("image/png");
  link.download = fileName;
  link.click();
}

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});

defineExpose({ exportChartAsPng });
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
