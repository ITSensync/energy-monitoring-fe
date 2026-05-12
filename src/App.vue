<template>
  <main
    class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(20,20,20,1),_rgba(10,10,10,1))] text-slate-100 px-10 py-5"
  >
    <div class="mx-auto">
      <header
        class="mb-4 rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)]"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          
          <div>
            <p class="text-sm uppercase tracking-[0.3em] text-slate-500">
              Monitoring Mesin
            </p>
            <h1
              class="mt-2 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl"
            >
              Dashboard Kontrol Energi & Kinerja
            </h1>
            <p class="mt-3 max-w-2xl text-slate-400 sm:text-base">
              Ringkasan parameter pengawasan mesin: voltase, arus, dan runtime.
            </p>
          </div>

          <div
            class="flex flex-col gap-3 rounded-3xl bg-zinc-900/90 p-4 text-left shadow-inner shadow-zinc-950/40 sm:min-w-[260px]"
          >
            <span class="text-xs uppercase tracking-[0.3em] text-slate-500"
              >Unit</span
            >
            <select
              v-model="selectedUnitIndex"
              @change="selectUnit"
              class="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-slate-100 outline-none focus:border-lime-400"
            >
              <option
                v-for="(unit, index) in energy.units"
                :key="index"
                :value="index"
                class="bg-zinc-950 text-slate-100"
              >
                {{ unit.name }}
              </option>
            </select>
            <span
              class="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold"
              :class="energy.statusClasses"
            >
              {{ energy.status }}
            </span>
          </div>
        </div>
      </header>

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
          <div class="grid md:grid-cols-2 gap-4">
            <div
              class="rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
            >
              <p class="text-sm uppercase tracking-[0.3em] text-slate-500">
                Runtime Mesin
              </p>
              <div
                class="mt-6 flex items-end justify-between gap-4 sm:items-center"
              >
                <div>
                  <p class="text-5xl font-semibold text-slate-100">
                    {{ energy.formattedRuntime }}
                  </p>
                  <p class="mt-2 text-sm text-slate-400">
                    Waktu hidup sejak terakhir kali dinyalakan.
                  </p>
                </div>
                <div
                  class="rounded-2xl bg-zinc-900 p-4 text-center text-sm text-slate-300"
                >
                  <span class="block font-semibold text-slate-100">Durasi</span>
                  <span class="mt-1 block text-2xl text-lime-400">{{
                    energy.runtimeMinutes
                  }}</span>
                  <span class="text-slate-500">menit</span>
                </div>
              </div>
              <div class="mt-6 h-3 overflow-hidden rounded-full bg-zinc-900">
                <div
                  class="h-full rounded-full bg-lime-400"
                  :style="runtimeBarStyle"
                ></div>
              </div>
            </div>

            <div
              class="rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
            >
              <p class="text-sm uppercase tracking-[0.3em] text-slate-500">
                Voltase
              </p>
              <div
                class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
              >
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm text-slate-400">Sistem</p>
                    <p class="mt-2 text-5xl font-semibold text-slate-100">
                      {{ energy.voltage }} V
                    </p>
                  </div>
                  <span
                    class="rounded-full bg-lime-500 px-4 py-2 text-md font-bold text-zinc-900"
                    >Stabil</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] col-span-full"
        >
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Arus</p>
          <div class="mt-6 grid sm:grid-cols-3 gap-4">
            <template v-for="phase in currentPhases" :key="phase.key">
              <div
                class="rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <p class="text-sm text-slate-400">{{ phase.label }}</p>
                  <p class="text-4xl font-semibold text-slate-100">
                    {{ energy.currents[phase.key] }} A
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
        <div
          class="rounded-[2rem] border border-zinc-800 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] col-span-full"
        >
          <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Watt</p>
          <div class="mt-6 grid sm:grid-cols-3 gap-4">
            <template v-for="watt in currentWatt" :key="watt.key">
              <div
                class="rounded-3xl border border-zinc-800 bg-zinc-900/95 p-4"
              >
                <div class="flex items-center justify-between gap-4">
                  <p class="text-sm text-slate-400">{{ watt.label }}</p>
                  <p class="text-4xl font-semibold text-slate-100">
                    {{ energy.watts[watt.key] }} W
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <footer class="mt-4 text-center text-sm text-zinc-500">
        <p>&copy; {{ currentYear }} Sensync. All rights reserved.</p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useEnergyStore } from "./stores/useEnergyStore";
import LineChart from "./components/LineChart.vue";
import ChartSlider from "./components/ChartSlider.vue";

const energy = useEnergyStore();

const selectedUnitIndex = ref(energy.selectedUnit);

const currentYear = computed(() => new Date().getFullYear());

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
  const percent = Math.min((energy.runtimeMinutes / 720) * 100, 100);
  return {
    width: `${percent}%`,
  };
});

function selectUnit() {
  energy.selectUnit(selectedUnitIndex.value);
}
</script>
