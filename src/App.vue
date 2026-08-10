<template>
  <LoginPage v-if="!auth.isLoggedIn" />
  <main
    v-else
    class="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top,_rgba(20,20,20,1),_rgba(10,10,10,1))] px-4 py-4 text-slate-100 sm:px-6 lg:px-10 lg:py-5"
  >
    <div class="mx-auto max-w-8xl">
      <header
          class="mb-4 rounded-[2rem] border border-zinc-800 bg-zinc-800 p-4 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.7)] sm:p-6"
        >
        <div class="flex flex-col sm:flex-row justify-between gap-4">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p
                class="text-sm uppercase tracking-[0.3em] text-slate-500 sm:text-lg"
              >
                Sensync Technology
              </p>
              <h1
                class="mt-2 text-xl font-semibold tracking-tight text-slate-100 sm:text-2xl lg:text-4xl"
              >
                Bakery Machine Monitoring System
              </h1>
              <p class="mt-2 max-w-2xl text-sm text-slate-400 sm:text-base">
                Energy & Performance Control Dashboard
              </p>
            </div>

            <button
              type="button"
              class="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-900 text-slate-100 transition hover:border-slate-400 sm:hidden"
              @click="mobileMenuOpen = !mobileMenuOpen"
              :aria-expanded="mobileMenuOpen.toString()"
              aria-label="Toggle navigation menu"
            >
              <svg
                v-if="!mobileMenuOpen"
                viewBox="0 0 24 24"
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </svg>
              <svg
                v-else
                viewBox="0 0 24 24"
                class="h-6 w-6"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div class="hidden sm:flex flex-col gap-3 lg:flex-row">
            <div
              class="flex flex-col gap-3 rounded-3xl bg-zinc-900/90 p-4 text-left shadow-inner shadow-zinc-950/40 sm:min-w-[300px]"
            >
              <span
                class="text-sm uppercase tracking-[0.3em] text-slate-500 sm:text-lg"
                >Menu</span
              >
              <select
                v-model="selectedMenuIndex"
                @change="selectMenu"
                class="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-lg text-slate-100 outline-none transition focus:border-lime-400 sm:text-xl"
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
            </div>
            <HeaderConnectivity class="hidden sm:flex" />
          </div>

          <div
            v-if="mobileMenuOpen"
            class="space-y-4 rounded-3xl bg-zinc-900/90 p-4 shadow-inner shadow-zinc-950/40 sm:hidden"
          >
            <div class="flex flex-col gap-3">
              <span class="text-sm uppercase tracking-[0.3em] text-slate-500">
                Menu
              </span>
              <select
                v-model="selectedMenuIndex"
                @change="selectMenu"
                class="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-lg text-slate-100 outline-none transition focus:border-lime-400"
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
            </div>
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
import LoginPage from "./components/LoginPage.vue";
import { useMenuStore } from "./stores/useMenuStore.js";
import { useAuthStore } from "./stores/useAuthStore";
import ReportSection from "./components/ReportSection.vue";

const menus = useMenuStore();
const auth = useAuthStore();

auth.restoreSession();

const selectedMenuIndex = ref(menus.selectedMenu);
const mobileMenuOpen = ref(false);

const currentYear = computed(() => new Date().getFullYear());

function selectMenu() {
  menus.selectMenu(selectedMenuIndex.value);
}
</script>
