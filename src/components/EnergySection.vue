<template>
  <section class="grid min-w-0 gap-6 overflow-hidden">
    <!-- GRAFIK BATCH -->
    <div class="flex gap-6 min-w-0">
      <!-- <p class="text-4xl px-2 py-3 font-bold text-slate-100">Grafik</p> -->
      <div
        class="min-w-0 w-2/3 rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] min-h-[380px]"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="mt-2 text-2xl font-extrabold text-slate-100">
              Realtime Motor Current (3 Phase)
            </h2>
          </div>

          <span
            class="rounded-full border border-lime-500/20 bg-lime-500/10 px-4 py-2 text-sm font-semibold text-lime-400"
          >
            Live
          </span>
        </div>

        <!-- AREA GRAFIK -->
        <div
          class="mt-6 h-[500px] w-full min-w-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
        >
          <!-- Placeholder -->
          <div
            class="h-full min-w-0 overflow-hidden rounded-2xl border border-dashed border-zinc-700 text-slate-500"
          >
            <ChartSlider />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4 w-1/3 h-full justify-between">
        <div class="flex gap-4">
          <!-- Energy Consumption -->
          <div
            class="relative overflow-hidden w-full h-fit rounded-3xl border border-lime-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-lime-400"
            ></div>
            <p
              class="text-sm font-bold text-lime-400 uppercase tracking-[0.3em]"
            >
              Energy Consumption
            </p>
            <div
              class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
            >
              <div class="flex w-full items-center justify-between gap-4">
                <div>
                  <p class="text-sm text-slate-400">Consumption Value</p>
                  <p class="mt-2 text-5xl font-semibold text-slate-100">
                    {{ energy.voltage }} <sub class="text-2xl">kWh</sub>
                  </p>
                </div>
                <!-- <span
                  class="rounded-full bg-lime-400 px-4 py-2 text-md font-bold text-zinc-900"
                  >Stabil</span
                > -->
              </div>
            </div>
          </div>
          <!-- VOLTASE CARD -->
          <div
            class="relative overflow-hidden w-full h-fit rounded-3xl border border-rose-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-rose-400"
            ></div>
            <p
              class="text-sm font-bold text-rose-400 uppercase tracking-[0.3em]"
            >
              Voltage
            </p>
            <div
              class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
            >
              <div class="flex w-full items-center justify-between gap-4">
                <div>
                  <p class="text-sm text-slate-400">System</p>
                  <p class="mt-2 text-5xl font-semibold text-slate-100">
                    {{ energy.voltage }} <sub class="text-2xl">V</sub>
                  </p>
                </div>
                <!-- <span
                  class="rounded-full bg-rose-400 px-4 py-2 text-md font-bold text-zinc-900"
                  >Stabil</span
                > -->
              </div>
            </div>
          </div>
        </div>

        <!-- Total Runtime  -->
        <div
          class="relative overflow-hidden rounded-3xl border border-orange-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-orange-400"
          ></div>
          <div class="flex flex-col gap-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300"
                >
                  Total Operating Time
                </p>
                <p
                  class="mt-3 text-5xl font-semibold leading-none text-slate-100"
                >
                  {{ energy.formattedRuntimeToday }}
                </p>
              </div>
              <div
                class="rounded-2xl border border-orange-400/15 bg-orange-400/10 px-3 py-2 text-right"
              >
                <span
                  class="block text-[11px] uppercase tracking-[0.18em] text-orange-200/80"
                >
                  Minute
                </span>
                <span class="block text-4xl font-semibold text-orange-300">
                  {{ energy.runtimeToday }}
                </span>
              </div>
            </div>
            <div>
              <div
                class="flex items-center justify-between text-xs text-slate-400"
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
              <p class="mt-1 text-sm text-slate-400">
                Total runtime of the machine since it was first turned on.
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-row w-full gap-4">
          <!-- Vibration -->
          <div
            class="relative overflow-hidden flex h-full min-w-0 w-full flex-col rounded-[2rem] border border-sky-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-sky-400"
            ></div>
            <p
              class="text-sm font-bold uppercase tracking-[0.3em] text-sky-500"
            >
              Vibration
            </p>
            <div
              class="mt-6 flex flex-1 items-center rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
            >
              <div class="flex flex-col w-full justify-between gap-4">
                <p class="text-sm text-slate-400">Sensor Value</p>
                <p class="text-4xl font-semibold text-slate-100">
                  100.2 <sub>Hz</sub>
                </p>
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
              class="font-bold text-sm uppercase tracking-[0.3em] text-red-500"
            >
              Alarm Status
            </p>
            <div
              class="mt-6 flex flex-1 flex-col justify-center gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
            >
              <div class="flex items-center gap-3">
                <span
                  class="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-400/30 bg-red-400/10 text-red-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path
                      d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    />
                  </svg>
                </span>
                <p class="text-lg font-semibold text-slate-100">
                  High Temperature
                </p>
              </div>
              <div class="flex items-center gap-3">
                <span
                  class="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-400/30 bg-red-400/10 text-red-400"
                >
                  <svg
                    viewBox="0 0 24 24"
                    class="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                    <path
                      d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                    />
                  </svg>
                </span>
                <p class="text-lg font-semibold text-slate-100">
                  Power Failure
                </p>
              </div>
            </div>
          </div>
        </div>
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

    <div class="col-span-full grid grid-cols-3 gap-6 min-w-0">
      <!-- BAR CHART RUNTIME HARIAN -->
      <div
        class="min-w-0 col-span-2 rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] min-h-[380px]"
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

        <div class="flex gap-6 mt-4">
          <div class="w-1/3 flex flex-col gap-2">
            <p class="font-medium text-2xl">Machine Runtime Today</p>
            <p class="font-bold text-6xl">08:20 h</p>
          </div>
          <div
            class="h-[300px] w-full min-w-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
          >
            <!-- Placeholder -->
            <div
              class="h-full min-w-0 overflow-hidden rounded-2xl border border-dashed border-zinc-700 text-slate-500"
            >
              <RuntimeChart />
            </div>
          </div>
        </div>

        <!-- AREA GRAFIK -->
      </div>

      <div
        class="relative overflow-hidden flex h-[380px] min-w-0 w-full flex-col rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
      >
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-amber-300"
        ></div>
        <p class="font-bold text-sm uppercase tracking-[0.3em] text-yellow-500">
          Activity Log
        </p>
        <div
          class="mt-6 flex flex-1 flex-col justify-start gap-3 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4 overflow-y-auto"
        >
          <div class="flex items-center gap-5" v-for="value in 6">
            <span
              class="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-400"
            >
              <svg
                viewBox="0 0 24 24"
                class="h-8 w-8"
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
            <p class="text-xl text-slate-100">
              <span class="font-bold">10:20 AM:</span> Mixer Started
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-full grid min-w-0">
      <div class="grid md:grid-cols-3 gap-4">
        <!-- ACTIVITY LOG -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useEnergyStore } from "../stores/useEnergyStore";
import ChartSlider from "./Chart/ChartSlider.vue";
import RuntimeChart from "./Chart/RuntimeChart.vue";

const energy = useEnergyStore();

const currentPhases = [
  { label: "Phase 1", key: "phase1" },
  { label: "Phase 2", key: "phase2" },
  { label: "Phase 3", key: "phase3" },
];

const currentWatt = [
  { label: "Watt 1", key: "phase1" },
  { label: "Watt 2", key: "phase2" },
  { label: "Watt 3", key: "phase3" },
];

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
</script>
