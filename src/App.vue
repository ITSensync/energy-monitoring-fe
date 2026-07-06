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
              Sensync Technology
            </p>
            <h1
              class="mt-2 text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl"
            >
              Bakery Machine Monitoring System
            </h1>
            <p class="mt-3 max-w-2xl text-slate-400 sm:text-base">
              Energy & Performance Control Dashboard
            </p>
          </div>

          <div class="flex flex-col gap-3 lg:flex-row">
            <div
              class="flex flex-col gap-3 rounded-3xl bg-zinc-900/90 p-4 text-left shadow-inner shadow-zinc-950/40 sm:min-w-[260px]"
            >
              <span class="text-xs uppercase tracking-[0.3em] text-slate-500"
                >Menu</span
              >
              <select
                v-model="selectedMenuIndex"
                @change="selectMenu"
                class="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-slate-100 outline-none focus:border-lime-400"
              >
                <option
                  v-for="(menu, index) in menus.menus"
                  :key="index"
                  :value="index"
                  class="bg-zinc-950 text-slate-100"
                >
                  {{ menu.name }}
                </option>
              </select>
              <!-- <span
                class="inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold"
                :class="energy.statusClasses"
              >
                {{ energy.status }}
              </span> -->
            </div>
            <HeaderConnectivity />
          </div>
        </div>
      </header>

      <div v-if="selectedMenuIndex == 0">
        <EnergySection />
      </div>
      <div v-else-if="selectedMenuIndex == 1">
        <!-- <GasSection /> -->
        <ReportSection />
      </div>
      <div v-else>
        <p class="text-center text-xl text-slate-500">
          Menu tidak ditemukan. Silakan pilih menu yang valid.
        </p>
      </div>
      <footer class="mt-4 text-center text-sm text-zinc-500">
        <p>&copy; {{ currentYear }} Sensync. All rights reserved.</p>
      </footer>
    </div>
  </main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useEnergyStore } from "./stores/useEnergyStore";
import EnergySection from "./components/EnergySection.vue";
import GasSection from "./components/GasSection.vue";
import HeaderConnectivity from "./components/HeaderConnectivity.vue";
import { useMenuStore } from "./stores/useMenuStore.js";
import ReportSection from "./components/ReportSection.vue";

const menus = useMenuStore();

const selectedMenuIndex = ref(menus.selectedMenu);

const currentYear = computed(() => new Date().getFullYear());

function selectMenu() {
  menus.selectMenu(selectedMenuIndex.value);
}
</script>
