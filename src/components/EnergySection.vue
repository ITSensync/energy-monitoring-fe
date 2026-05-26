<template>
  <section class="grid min-w-0 gap-6 overflow-hidden">
    <!-- GRAFIK BATCH -->
    <div class="col-span-full grid min-w-0">
      <p class="text-4xl px-2 py-3 font-bold text-slate-100">Grafik</p>
      <div
        class="col-span-full min-w-0 rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] min-h-[380px]"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="mt-2 text-2xl font-medium text-slate-100">
              Batch Proses: 10:30:00
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
    </div>

    <div class="col-span-full grid min-w-0">
      <p class="text-4xl px-2 py-3 font-bold text-slate-100">Statistik</p>
      <div class="grid md:grid-cols-3 gap-4">
        <div
          class="relative overflow-hidden rounded-3xl border border-cyan-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-cyan-400"
          ></div>
          <div class="flex min-h-[190px] flex-col justify-between gap-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300"
                >
                  Runtime Per Proses
                </p>
                <p
                  class="mt-3 text-4xl font-semibold leading-none text-slate-100"
                >
                  {{ energy.formattedRuntime }}
                </p>
              </div>
              <div
                class="rounded-2xl border border-cyan-400/15 bg-cyan-400/10 px-3 py-2 text-right"
              >
                <span
                  class="block text-[11px] uppercase tracking-[0.18em] text-cyan-200/80"
                >
                  Menit
                </span>
                <span class="block text-2xl font-semibold text-cyan-300">
                  {{ energy.runtimeMinutes }}
                </span>
              </div>
            </div>
            <div>
              <div
                class="flex items-center justify-between text-xs text-slate-400"
              >
                <span>Progress batch: 10:24</span>
                <span>Target 60 menit</span>
              </div>
              <div class="mt-3 h-2 overflow-hidden rounded-full bg-zinc-950">
                <div
                  class="h-full rounded-full bg-cyan-400"
                  :style="runtimeBarStyle"
                ></div>
              </div>
              <p class="mt-3 text-sm text-slate-400">
                Durasi berjalan untuk proses aktif saat ini.
              </p>
            </div>
          </div>
        </div>

        <div
          class="relative overflow-hidden rounded-3xl border border-orange-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-orange-400"
          ></div>
          <div class="flex min-h-[190px] flex-col justify-between gap-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p
                  class="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300"
                >
                  Total Runtime Harian
                </p>
                <p
                  class="mt-3 text-4xl font-semibold leading-none text-slate-100"
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
                  Menit
                </span>
                <span class="block text-2xl font-semibold text-orange-300">
                  {{ energy.runtimeToday }}
                </span>
              </div>
            </div>
            <div>
              <div
                class="flex items-center justify-between text-xs text-slate-400"
              >
                <span>Akumulasi hari ini</span>
                <span>Target 1440 menit</span>
              </div>
              <div class="mt-3 h-2 overflow-hidden rounded-full bg-zinc-950">
                <div
                  class="h-full rounded-full bg-orange-400"
                  :style="runtimeDailyBarStyle"
                ></div>
              </div>
              <p class="mt-3 text-sm text-slate-400">
                Total durasi mesin berjalan dalam periode harian.
              </p>
            </div>
          </div>
        </div>

        <div
          class="relative overflow-hidden rounded-3xl border border-rose-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-rose-400"
          ></div>
          <p class="text-sm text-rose-400 uppercase tracking-[0.3em]">
            Voltase
          </p>
          <div
            class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
          >
            <div class="flex w-full items-center justify-between gap-4">
              <div>
                <p class="text-sm text-slate-400">Sistem</p>
                <p class="mt-2 text-5xl font-semibold text-slate-100">
                  {{ energy.voltage }} V
                </p>
              </div>
              <span
                class="rounded-full bg-rose-400 px-4 py-2 text-md font-bold text-zinc-900"
                >Stabil</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-span-full grid min-w-0">
      <div class="grid md:grid-cols-3 gap-4">
        <div
          class="flex h-full min-w-0 flex-col rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500">
            Vibration
          </p>
          <div
            class="mt-6 flex flex-1 items-center rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
          >
            <div class="flex w-full items-center justify-between gap-4">
              <p class="text-sm text-slate-400">Sensor Mesin</p>
              <p class="text-3xl font-semibold text-slate-100">Normal</p>
            </div>
          </div>
        </div>
        <div
          class="flex h-full min-w-0 flex-col rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Arus</p>
          <div class="mt-6 grid flex-1 grid-cols-3 gap-3">
            <template v-for="phase in currentPhases" :key="phase.key">
              <div
                class="rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
              >
                <div class="flex flex-col items-center justify-between gap-4">
                  <p class="text-sm text-slate-400">{{ phase.label }}</p>
                  <p class="text-3xl font-semibold text-slate-100">
                    {{ energy.currents[phase.key] }} A
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div
          class="flex h-full min-w-0 flex-col rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Watt</p>
          <div class="mt-6 grid flex-1 grid-cols-3 gap-3">
            <template v-for="watt in currentWatt" :key="watt.key">
              <div
                class="rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
              >
                <div class="flex flex-col items-center justify-between gap-4">
                  <p class="text-sm text-slate-400">{{ watt.label }}</p>
                  <p class="text-3xl font-semibold text-slate-100">
                    {{ energy.watts[watt.key] }} W
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { useEnergyStore } from "../stores/useEnergyStore";
import ChartSlider from "./ChartSlider.vue";

const energy = useEnergyStore();

const currentPhases = [
  { label: "Current 1", key: "phase1" },
  { label: "Current 2", key: "phase2" },
  { label: "Current 3", key: "phase3" },
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
