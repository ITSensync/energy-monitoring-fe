<template>
  <section class="grid min-w-0 gap-6 overflow-hidden">
    <!-- GRAFIK BATCH -->
    <div class="flex gap-6 min-w-0">
      <!-- <p class="text-4xl px-2 py-3 font-bold text-slate-100">Grafik</p> -->
      <div
        class="min-w-0 w-2/3 rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] min-h-[400px]"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="mt-2 text-4xl font-extrabold text-slate-100">
              Realtime Motor Current (3 Phase)
            </h2>
          </div>

          <span
            :class="[
              'rounded-full px-4 py-2 text-2xl font-semibold',
              machineStatus === 'running'
                ? 'border border-lime-500/20 bg-lime-500/10 text-lime-400'
                : 'border border-amber-500/20 bg-amber-500/10 text-amber-400',
            ]"
          >
            {{ String(machineStatus).toUpperCase() }}
          </span>
        </div>

        <!-- AREA GRAFIK -->
        <div
          class="mt-6 h-[550px] w-full min-w-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
        >
          <!-- Placeholder -->
          <div
            class="h-full min-w-0 overflow-hidden rounded-2xl border border-dashed border-zinc-700 text-slate-500"
          >
            <ChartSlider :today-average-data="todayAverage" />
          </div>
        </div>
      </div>

      <div class="grid grid-rows-2 w-1/3 h-full gap-4">
        <div class="flex gap-4 w-full h-full items-stretch">
          <!-- Energy Consumption -->
          <div
            class="relative overflow-hidden w-full h-full rounded-3xl border border-lime-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-lime-400"
            ></div>
            <p
              class="text-xl font-bold text-lime-400 uppercase tracking-[0.3em]"
            >
              Energy Consumption
            </p>
            <div
              class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
            >
              <div class="flex w-full items-center justify-between gap-4">
                <div>
                  <p class="text-2xl text-slate-400">Consumption Value</p>
                  <p class="mt-2 text-7xl font-semibold text-slate-100">
                    {{ latestAverage.kwatt }} <sub class="text-3xl">kWh</sub>
                  </p>
                </div>
                <!-- <span
                  class="rounded-full bg-lime-400 px-4 py-2 text-md font-bold text-zinc-900"
                  >Stabil</span
                > -->
              </div>
              <div class="mt-7 flex justify-between text-xl">
                <p>Last Update</p>
                <p class="font-medium">{{ latestAverage.lastUpdate }}</p>
              </div>
            </div>
          </div>
          <!-- VOLTASE CARD -->
          <div
            class="relative overflow-hidden w-full h-full rounded-3xl border border-rose-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-rose-400"
            ></div>
            <p
              class="text-xl font-bold text-rose-400 uppercase tracking-[0.3em]"
            >
              Voltage
            </p>
            <div
              class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
            >
              <div class="flex w-full items-center justify-between gap-4">
                <div>
                  <p class="text-2xl text-slate-400">System</p>
                  <p class="mt-2 text-7xl font-semibold text-slate-100">
                    {{ latestAverage.volt }} <sub class="text-2xl">V</sub>
                  </p>
                </div>
                <!-- <span
                  class="rounded-full bg-rose-400 px-4 py-2 text-md font-bold text-zinc-900"
                  >Stabil</span
                > -->
              </div>
              <div class="mt-7 flex justify-between text-xl">
                <p>Last Update</p>
                <p class="font-medium">{{ latestAverage.lastUpdate }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-4 w-full">
          <!-- Vibration -->
          <div
            class="relative overflow-hidden flex h-full min-w-0 w-full flex-col rounded-[2rem] border border-sky-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-sky-400"
            ></div>
            <p
              class="text-xl font-bold uppercase tracking-[0.3em] text-sky-500"
            >
              Vibration
            </p>
            <div
              class="mt-6 flex flex-col items-center rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
            >
              <div class="flex flex-col w-full justify-between gap-4">
                <p class="text-2xl text-slate-400">Sensor Value</p>
                <p class="text-7xl font-semibold text-slate-100">
                  {{ latestAverage.vibration }} <sub class="text-2xl">Hz</sub>
                </p>
              </div>
              <div class="mt-5 flex justify-between w-full text-lg">
                <p>Last Update</p>
                <p class="font-medium">{{ latestAverage.lastUpdate }}</p>
              </div>
            </div>
          </div>

          <!-- Alert -->
          <div
            class="relative overflow-hidden flex h-full min-w-0 w-full flex-col rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-red-400"
            ></div>
            <p
              class="font-bold text-xl uppercase tracking-[0.3em] text-red-500"
            >
              Alarm Status
            </p>
            <div
              class="mt-6 flex flex-1 flex-col gap-3 overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
            >
              <div
                v-for="status in alarmStatusList"
                :key="status.key"
                class="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-3"
              >
                <div class="flex min-w-0 items-center gap-3">
                  <span
                    :class="[
                      'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
                      alarmStatusIconClass(status.level),
                    ]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      class="h-7 w-7"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      aria-hidden="true"
                    >
                      <path
                        v-if="status.level === 'normal'"
                        d="m5 12 5 5L20 7"
                      />
                      <template v-else>
                        <path d="M12 9v4" />
                        <path d="M12 17h.01" />
                        <path
                          d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                        />
                      </template>
                    </svg>
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-2xl font-semibold text-slate-100">
                      {{ status.text }}
                    </p>
                    <!-- <p class="text-lg text-slate-400">{{ status.value }}</p> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Total Runtime  -->
      </div>
      <!-- <div
        class="relative overflow-hidden flex h-full min-w-0 w-1/3 flex-col rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
      >
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-lime-400"
        ></div>
        <p class="text-sm font-bold uppercase tracking-[0.3em] text-lime-500">Arus</p>
        <div class="mt-4 grid flex-1 grid-rows-3 gap-3">
          <template v-for="phase in currentPhases" :key="phase.key">
            <div class="rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4 flex items-center">
              <div class="flex w-full items-center justify-between gap-4">
                <div>
                  <p class="text-md text-slate-400">{{ phase.label }}</p>
                  <p class="mt-2 text-6xl font-semibold text-slate-100">
                    {{ energy.currents[phase.key] }} A
                  </p>
                </div>
                <span
                  class="rounded-full bg-lime-400 px-4 py-2 text-md font-bold text-zinc-900"
                  >Stabil</span
                >
              </div>
            </div>
          </template>
        </div>
      </div> -->
    </div>

    <div class="col-span-full grid grid-cols-2 gap-6 min-w-0 h-[30svh]">
      <!-- BAR CHART RUNTIME HARIAN -->
      <div
        class="min-w-0 col-span-1 rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] h-[30svh]"
      >
        <!-- <div class="flex items-center justify-between">
          <div>
            <h2 class="mt-2 text-2xl font-extrabold text-slate-100">
              Machine Runtime
            </h2>
          </div>

          <span
            class="rounded-full border border-lime-500/20 bg-lime-500/10 px-4 py-2 text-sm font-semibold text-lime-400"
          >
            Live
          </span>
        </div> -->

        <div class="flex flex-col gap-6 mt-2">
          <!-- <p class="font-medium text-4xl">Machine Runtime Today</p> -->
          <div
            class="h-[380px] w-full min-w-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
          >
            <!-- Placeholder -->
            <div
              class="h-full min-w-0 overflow-hidden rounded-2xl border border-dashed border-zinc-700 text-slate-500 p-2"
            >
              <RuntimeChart :weekly-data="runtimeData.weekly" />
            </div>
          </div>
        </div>

        <!-- AREA GRAFIK -->
      </div>

      <div class="flex flex-row gap-4">
        <div
          class="h-[30svh] w-1/2 relative overflow-hidden rounded-3xl border border-orange-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-orange-400"
          ></div>
          <div class="flex flex-col h-full justify-center gap-8 py-2">
            <div class="flex items-start justify-between">
              <div class="flex flex-col gap-2">
                <p
                  class="font-semibold tracking-[0.2em] text-2xl text-orange-300"
                >
                  OPERATING TIME TODAY
                </p>
                <p class="font-semibold text-8xl text-slate-100">
                  {{ formatTextMinutes(runtimeData.today) }}
                </p>
              </div>
              <div
                class="rounded-2xl border border-orange-400/15 bg-orange-400/10 px-3 py-2 text-right"
              >
                <span
                  class="block text-[18px] uppercase tracking-[0.18em] text-orange-200/80"
                >
                  Minute
                </span>
                <span class="block text-5xl font-semibold text-orange-300">
                  {{ runtimeData.today }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-4">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p
                    class="text-2xl font-semibold uppercase tracking-[0.2em] text-orange-300"
                  >
                    Total Operating Time
                  </p>
                  <p
                    class="mt-3 text-8xl font-semibold leading-none text-slate-100"
                  >
                    {{ formatTextMinutes(runtimeData.allTime) }}
                  </p>
                </div>
                <div
                  class="rounded-2xl border border-orange-400/15 bg-orange-400/10 px-3 py-2 text-right"
                >
                  <span
                    class="block text-[18px] uppercase tracking-[0.18em] text-orange-200/80"
                  >
                    Minute
                  </span>
                  <span class="block text-5xl font-semibold text-orange-300">
                    {{ runtimeData.allTime }}
                  </span>
                </div>
              </div>
              <div>
                <div
                  class="flex items-center justify-between text-xl text-slate-400"
                >
                  <span>Accumulation until today</span>
                  <!-- <span>Target 1440 menit</span> -->
                </div>
                <!-- <div class="mt-3 h-2 overflow-hidden rounded-full bg-zinc-950">
                    <div
                      class="h-full rounded-full bg-orange-400"
                      :style="runtimeDailyBarStyle"
                    ></div>
                  </div> -->
                <p class="mt-1 text-xl text-slate-400">
                  Total runtime of the machine since it was first turned on.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          class="relative overflow-hidden flex h-[30svh] min-w-0 w-1/2 flex-col rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-amber-300"
          ></div>
          <p
            class="font-bold text-lg uppercase tracking-[0.3em] text-yellow-500"
          >
            Activity Log
          </p>
          <div
            class="mt-6 flex flex-1 flex-col justify-start gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4 overflow-y-auto"
          >
            <div class="flex items-center gap-5" v-for="logs in activityData">
              <span
                class="inline-flex h-16 w-16 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
              >
                <svg
                  viewBox="0 0 24 24"
                  class="h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <!-- border lingkaran -->
                  <circle cx="12" cy="12" r="9" />

                  <!-- titik i -->
                  <path d="M12 8h.01" />

                  <!-- batang i -->
                  <path d="M12 12v4" />
                </svg>
              </span>
              <p class="text-2xl text-slate-100">
                <span class="font-bold">{{ logs.time }}:</span>
                {{ logs.message }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <Transition
    enter-active-class="transition duration-300"
    enter-from-class="translate-y-5 opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-5 opacity-0"
  >
    <div
      v-if="alertData.alert"
      class="fixed bottom-6 p-2 right-6 z-50 w-[550px] rounded-2xl border border-red-500/60 bg-zinc-900 shadow-2xl"
    >
      <div class="flex items-start gap-4 p-5">
        <!-- Icon -->
        <div
          class="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400"
        >
          <svg
            class="h-16 w-16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M15 9l-6 6" />
            <path d="M9 9l6 6" />
          </svg>
        </div>

        <!-- Content -->
        <div class="flex-1">
          <p class="text-3xl font-bold text-red-400">Data Not Updated</p>

          <p class="mt-1 text-2xl text-slate-300">
            {{ alertData.message }}
          </p>
        </div>

        <!-- Close -->
        <button
          @click="alertData.alert = false"
          class="rounded-lg text-2xl p-1 text-slate-400 transition hover:bg-zinc-800 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useEnergyStore } from "../stores/useEnergyStore";
import ChartSlider from "./Chart/ChartSlider.vue";
import RuntimeChart from "./Chart/RuntimeChart.vue";
import { useWebSocketFetch } from "../stores/useWSStore.js";
// import { useWebSocket } from "../stores/useWebsocket.js";

const energy = useEnergyStore();
const machineStatus = ref("");
const runtimeData = ref({
  today: 0,
  allTime: 0,
  weekly: [],
});
const activityData = ref([]);
const todayAverage = ref([]);
const latestAverage = ref({
  arus1: 0,
  arus2: 0,
  arus3: 0,
  kwatt: 0,
  volt: 0,
  vibration: 0,
  temp: 0,
  lastUpdate: "",
});
const alertData = ref({
  alert: false,
  message: "",
});

const alarmRules = [
  {
    key: "temp",
    label: "Temperature",
    text: "High Temperature",
    unit: "°C",
    getValue: (data) => data.temp,
    isAlarm: (value) => value >= 60,
  },
  {
    key: "volt",
    label: "Voltage",
    text: "Voltage Out of Range",
    unit: "V",
    getValue: (data) => data.volt,
    isAlarm: (value) => value < 200 || value > 240,
  },
  {
    key: "vibration",
    label: "Vibration",
    text: "High Vibration",
    unit: "Hz",
    getValue: (data) => data.vibration,
    isAlarm: (value) => value >= 50,
  },
  {
    key: "kwatt",
    label: "Energy Consumption",
    text: "No Energy Consumption",
    unit: "kWh",
    getValue: (data) => data.kwatt,
    isAlarm: (value) => value <= 0,
  },
  {
    key: "arus1",
    label: "Current Phase 1",
    text: "Over Current Phase 1",
    unit: "A",
    getValue: (data) => data.arus1,
    isAlarm: (value) => value >= 20,
  },
  {
    key: "arus2",
    label: "Current Phase 2",
    text: "Over Current Phase 2",
    unit: "A",
    getValue: (data) => data.arus2,
    isAlarm: (value) => value >= 20,
  },
  {
    key: "arus3",
    label: "Current Phase 3",
    text: "Over Current Phase 3",
    unit: "A",
    getValue: (data) => data.arus3,
    isAlarm: (value) => value >= 20,
  },
];

const alarmStatusList = computed(() =>
  alarmRules
    .filter((rule) => {
      const value = Number(rule.getValue(latestAverage.value) ?? 0);
      return rule.isAlarm(value);
    })
    .map((rule) => {
      const value = Number(rule.getValue(latestAverage.value) ?? 0);

      return {
        key: rule.key,
        label: rule.label,
        value: `${formatSensorValue(value)} ${rule.unit}`,
        level: "alarm",
        text: rule.text,
      };
    }),
);

// console.log(runtimeData.value)

const { connect, disconnect } = useWebSocketFetch("mtamixer", (payload) => {
  switch (payload.type) {
    case "machine-status":
      machineStatus.value = payload.data.status;
      break;

    case "runtime-stats":
      // console.log(payload.data);
      runtimeData.value = {
        today: payload.data.todayRuntime,
        allTime: payload.data.allTimeRuntime,
        weekly: payload.data.weeklyRuntime,
      };
      break;

    case "activity-logs":
      activityData.value = payload.data.map((logs) => ({
        ...logs,
        time: formatWibTime(logs.time),
      }));
      break;

    case "today-average":
      todayAverage.value = payload.data;
      const length = todayAverage.value.length;
      const lastData = todayAverage.value[length - 1];

      if (!lastData) {
        break;
      }

      latestAverage.value = {
        arus1: lastData.arus1,
        arus2: lastData.arus2,
        arus3: lastData.arus3,
        kwatt: lastData.kwatt,
        volt: lastData.tegangan,
        vibration: lastData.getaran,
        temp: lastData.temp,
        lastUpdate: formatRelativeTime(lastData.createdAt),
      };
      break;

    case "not-update-alert":
      alertData.value = {
        alert: payload.data.alert,
        message: payload.data.message,
      };
      break;

    case "subscribed":
      console.log("Subscribed");
      break;
  }
});

onMounted(() => {
  connect();
});

onBeforeUnmount(() => {
  disconnect();
});

const runtimeBarStyle = computed(() => {
  const percent = Math.min((energy.runtimeMinutes / 60) * 100, 100);
  return {
    width: `${percent}%`,
  };
});

const runtimeDailyBarStyle = computed(() => {
  const percent = Math.min((energy.runtimeToday / 1440) * 100, 100);
  return {
    width: `${percent}%`,
  };
});

function formatTextMinutes(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m`;
}

function formatSensorValue(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function alarmStatusIconClass(level) {
  return level === "alarm"
    ? "border-red-400/30 bg-red-400/10 text-red-400"
    : "border-lime-400/30 bg-lime-400/10 text-lime-400";
}

function alarmStatusBadgeClass(level) {
  return level === "alarm"
    ? "bg-red-400/10 text-red-400"
    : "bg-lime-400/10 text-lime-400";
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

function formatRelativeTime(value) {
  if (!value) return "--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  const diffSeconds = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 1000),
  );

  if (diffSeconds < 60) {
    return `${diffSeconds || 1} ${diffSeconds <= 1 ? "second" : "seconds"} ago`;
  }

  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
}
</script>
