<script setup>
import { ref, onMounted } from "vue";

const startDate = ref("");
const endDate = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const reports = ref([]);
const loading = ref(false);
const error = ref("");
const limit = 10;

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001";

async function fetchReports(page = 1) {
  loading.value = true;
  error.value = "";

  const endDateValue = endDate.value || startDate.value;
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (startDate.value) {
    params.set("startDate", startDate.value);
  }

  if (endDateValue) {
    params.set("endDate", endDateValue);
  }

  try {
    const response = await fetch(`${apiBaseUrl}/records/paginated?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = await response.json();
    const recordList = body.records || body.data || body;

    reports.value = Array.isArray(recordList) ? recordList : [];
    currentPage.value = page;

    if (body.totalPages || body.total_pages) {
      totalPages.value = body.totalPages || body.total_pages;
    } else if (body.total && Array.isArray(recordList)) {
      totalPages.value = Math.max(1, Math.ceil(body.total / limit));
    } else {
      totalPages.value = Math.max(1, page);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    reports.value = [];
  } finally {
    loading.value = false;
  }
}

function handleSubmit() {
  currentPage.value = 1;
  fetchReports(1);
}

function handleExport() {
  // Nanti tambahkan logika export ke Excel
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchReports(page);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    const next = currentPage.value - 1;
    currentPage.value = next;
    fetchReports(next);
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    const next = currentPage.value + 1;
    currentPage.value = next;
    fetchReports(next);
  }
}
</script>

<template>
  <section
    class="rounded-[2rem] border border-zinc-800 bg-zinc-800 p-6 shadow-[0_28px_100px_-50px_rgba(0,0,0,0.6)]"
  >
    <div
      class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h2 class="mt-2 text-5xl font-semibold tracking-tight text-slate-100">
          Report Dashboard
        </h2>
        <p class="mt-1 max-w-5xl text-2xl text-slate-400">
          Kosongkan end date untuk menampilkan data rentang satu hari
        </p>
      </div>
    </div>

    <div class="mb-6 gap-4 flex flex-row w-full justify-between">
      <div class="flex gap-4 w-2/3">
        <label class="block w-1/3">
          <span class="mb-2 block text-2xl font-medium text-slate-400"
            >Start Date</span
          >
          <input
            type="date"
            v-model="startDate"
            class="text-2xl w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-lime-500"
          />
        </label>

        <label class="block w-1/3">
          <span class="mb-2 block text-2xl font-medium text-slate-400"
            >End Date</span
          >
          <input
            type="date"
            v-model="endDate"
            class="text-2xl w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-lime-500"
          />
        </label>

        <div class="flex items-end w-1/3">
          <!-- <button
            type="button"
            @click="handleSubmit"
            class="w-full rounded-3xl bg-slate-700 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-slate-600"
          >
            Submit
          </button> -->
          <button
            type="button"
            @click="handleSubmit"
            class="w-1/2 items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
          >
            <p class="text-2xl">Submit</p>
          </button>
          <div class="ml-4 self-end text-right text-sm text-slate-400">
            <p v-if="loading">Loading...</p>
            <p v-else-if="error" class="text-rose-400">{{ error }}</p>
          </div>
        </div>
      </div>

      <div class="flex items-end">
        <button
          type="button"
          @click="handleExport"
          class="inline-flex items-center justify-center rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="30px"
            height="30px"
            class="mr-2"
          >
            <!-- Background Shield -->
            <path
              fill="#107C41"
              d="M64 32h256l128 128v288a64 64 0 0 1-64 64H64a64 64 0 0 1-64-64V96a64 64 0 0 1 64-64z"
            />
            <!-- Folded Corner Effect -->
            <path fill="#0E6533" d="M320 32v128h128L320 32z" />
            <!-- Grid Squares -->
            <rect fill="#1F8A4E" x="128" y="210" width="64" height="64" />
            <rect fill="#1F8A4E" x="208" y="210" width="64" height="64" />
            <rect fill="#1F8A4E" x="288" y="210" width="64" height="64" />
            <rect fill="#1F8A4E" x="128" y="290" width="64" height="64" />
            <rect fill="#28A154" x="208" y="290" width="64" height="64" />
            <rect fill="#28A154" x="288" y="290" width="64" height="64" />
            <rect fill="#1F8A4E" x="128" y="370" width="64" height="64" />
            <rect fill="#28A154" x="208" y="370" width="64" height="64" />
            <rect fill="#33B360" x="288" y="370" width="64" height="64" />
            <!-- White "X" Emblem -->
            <path
              fill="#FFFFFF"
              d="M72 170h58l46 72 46-72h58l-74 112 76 112h-58l-48-74-48 74H72l76-112L72 170z"
            />
          </svg>
          <p class="text-2xl">Export</p>
        </button>
      </div>
    </div>

    <div
      class="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/90"
    >
      <div class="overflow-x-auto">
        <table
          class="min-w-full border-separate border-spacing-0 text-left text-sm"
        >
          <thead class="bg-zinc-900/95 text-slate-400 text-xl">
            <tr>
              <th
                class="px-5 py-4 uppercase tracking-[0.18em] text-indigo-400-400"
              >
                Waktu
              </th>
              <th class="px-5 py-4 uppercase tracking-[0.18em] text-lime-400">
                Energy
              </th>
              <th class="px-5 py-4 uppercase tracking-[0.18em] text-amber-400">
                Phase (I)
              </th>
              <th class="px-5 py-4 uppercase tracking-[0.18em] text-amber-400">
                Phase (II)
              </th>
              <th class="px-5 py-4 uppercase tracking-[0.18em] text-amber-400">
                Phase (III)
              </th>
              <th class="px-5 py-4 uppercase tracking-[0.18em] text-rose-400">
                Voltage
              </th>
              <th class="px-5 py-4 uppercase tracking-[0.18em] text-sky-400">
                Vibration
              </th>
              <th class="px-5 py-4 uppercase tracking-[0.18em] text-violet-400">
                Temp
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-zinc-800 text-2xl">
            <tr
              v-for="(row, index) in reports"
              :key="index"
              class="transition hover:bg-zinc-900/80"
            >
              <td class="px-5 py-4 text-slate-100">{{ row.timestamp }}</td>
              <td class="px-5 py-4 text-slate-100">{{ row.energy }} kWh</td>
              <td class="px-5 py-4 text-slate-100">{{ row.phase1 }} A</td>
              <td class="px-5 py-4 text-slate-100">{{ row.phase2 }} A</td>
              <td class="px-5 py-4 text-slate-100">{{ row.phase3 }} A</td>
              <td class="px-5 py-4 text-slate-100">{{ row.voltage }} v</td>
              <td class="px-5 py-4 text-slate-100">{{ row.vibration }} Hz</td>
              <td class="px-5 py-4 text-slate-100">{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="border-t border-zinc-800 bg-zinc-900/90 px-5 py-4 text-2xl text-slate-500"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Menampilkan {{ reports.length }} baris data.</span>
          <div class="flex items-center gap-2 rounded-3xl bg-zinc-950/90 p-2">
            <button
              type="button"
              @click="prevPage"
              class="rounded-2xl px-3 py-2 text-xl font-medium text-slate-200 transition hover:bg-zinc-800"
            >
              Prev
            </button>
            <div
              class="flex items-center gap-2 px-3 py-2 text-xl text-slate-300"
            >
              <span class="font-semibold text-slate-100">Page</span>
              <span class="font-semibold text-white">{{ currentPage }}</span>
              <span class="text-slate-400">/</span>
              <span class="text-slate-300">{{ totalPages }}</span>
            </div>
            <button
              type="button"
              @click="nextPage"
              class="rounded-2xl px-3 py-2 text-xl font-medium text-slate-200 transition hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
