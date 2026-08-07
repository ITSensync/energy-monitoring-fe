<script setup>
import { ref, onMounted } from "vue";
import * as XLSX from "xlsx";

const startDate = ref("");
const endDate = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const reports = ref([]);
const loading = ref(false);
const error = ref("");
const limit = 10;
const exportLimit = 100;

function formatDateToISO(date) {
  return date.toISOString().slice(0, 10);
}

function buildExportRow(row) {
  return {
    Waktu: formatWibTime(row.createdAt),
    "Energy (kWh)": row.kwatt,
    "Phase 1 (A)": row.arus1,
    "Phase 2 (A)": row.arus2,
    "Phase 3 (A)": row.arus3,
    "Voltage (V)": row.tegangan,
    "Vibration (Hz)": row.getaran,
    "Temperature (°C)": row.temp,
  };
}

async function fetchAllReports() {
  const allRows = [];
  let page = 1;
  let totalPagesFromApi;
  const endDateValue = endDate.value || startDate.value;

  while (true) {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(exportLimit),
    });

    if (startDate.value) {
      params.set("startDate", startDate.value);
    }

    if (endDateValue) {
      params.set("endDate", endDateValue);
    }

    const response = await fetch(`${apiBaseUrl}/records/paginated?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = await response.json();
    const recordList = body.records || body.data || body;
    const pageRows = Array.isArray(recordList) ? recordList : [];
    allRows.push(...pageRows);

    totalPagesFromApi = body.totalPages || body.total_pages;
    if (totalPagesFromApi != null) {
      if (page >= Number(totalPagesFromApi)) break;
    } else if (pageRows.length < exportLimit) {
      break;
    }

    page += 1;
    if (page > 500) break;
  }

  return allRows;
}

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8001";

const today = formatDateToISO(new Date());
startDate.value = today;
endDate.value = today;

onMounted(() => {
  fetchReports(1);
});

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
    const response = await fetch(
      `${apiBaseUrl}/records/paginated?${params.toString()}`,
    );
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

async function handleExport() {
  if (!startDate.value) {
    error.value = "Pilih tanggal mulai untuk melakukan export.";
    return;
  }

  loading.value = true;
  error.value = "";
  try {
    const allRows = await fetchAllReports();
    if (!allRows.length) {
      error.value = "Tidak ada data untuk diekspor.";
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(allRows.map(buildExportRow));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");

    const fileName = `report-${startDate.value}-${endDate.value || startDate.value}.xlsx`;
    XLSX.writeFile(workbook, fileName, { bookType: "xlsx", bookSST: false });
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    loading.value = false;
  }
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

function formatWibTime(value) {
  if (!value) return "--:--";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "Asia/Jakarta",
  })
    .format(date)
    .replaceAll(".", ":");
}
</script>

<template>
  <section
    class="rounded-[2rem] border border-zinc-800 bg-zinc-800 p-4 shadow-[0_28px_100px_-50px_rgba(0,0,0,0.6)] sm:p-6"
  >
    <div
      class="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <div>
        <h2 class="mt-2 text-3xl font-semibold tracking-tight text-slate-100 sm:text-5xl">
          Report Dashboard
        </h2>
        <p class="mt-1 max-w-5xl text-base text-slate-400 sm:text-2xl">
          Kosongkan end date untuk menampilkan data rentang satu hari
        </p>
      </div>
    </div>

    <div class="mb-6 flex w-full flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div class="flex w-full flex-col gap-4 sm:flex-row">
        <label class="block w-full sm:w-1/3">
          <span class="mb-2 block text-lg font-medium text-slate-400 sm:text-2xl"
            >Start Date</span
          >
          <input
            type="date"
            v-model="startDate"
            class="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-lg text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-lime-500 sm:text-2xl"
          />
        </label>

        <label class="block w-full sm:w-1/3">
          <span class="mb-2 block text-lg font-medium text-slate-400 sm:text-2xl"
            >End Date</span
          >
          <input
            type="date"
            v-model="endDate"
            class="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-lg text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-lime-500 sm:text-2xl"
          />
        </label>

        <div class="flex w-full items-end sm:w-1/3">
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
            class="w-full items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 sm:w-1/2"
          >
            <p class="text-lg sm:text-2xl">Submit</p>
          </button>
          <!-- <div class="ml-4 self-end text-right text-sm text-slate-400">
            <p v-if="loading">Loading...</p>
            <p v-else-if="error" class="text-rose-400">{{ error }}</p>
          </div> -->
        </div>
      </div>

      <div class="flex w-full items-end xl:w-auto">
        <button
          type="button"
          @click="handleExport"
          class="inline-flex w-full items-center justify-center rounded-3xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 xl:w-auto"
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
          <p class="text-lg sm:text-2xl">Export</p>
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
          <thead class="bg-zinc-900/95 text-slate-400 text-base sm:text-xl">
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
          <tbody class="divide-y divide-zinc-800 text-base sm:text-2xl">
            <tr
              v-for="(row, index) in reports"
              :key="index"
              class="transition hover:bg-zinc-900/80"
            >
              <td class="px-5 py-4 text-slate-100">
                {{ formatWibTime(row.createdAt) }}
              </td>
              <td class="px-5 py-4 text-slate-100">{{ row.kwatt }} kWh</td>
              <td class="px-5 py-4 text-slate-100">{{ row.arus1 }} A</td>
              <td class="px-5 py-4 text-slate-100">{{ row.arus2 }} A</td>
              <td class="px-5 py-4 text-slate-100">{{ row.arus3 }} A</td>
              <td class="px-5 py-4 text-slate-100">{{ row.tegangan }} v</td>
              <td class="px-5 py-4 text-slate-100">{{ row.getaran }} Hz</td>
              <td class="px-5 py-4 text-slate-100">{{ row.temp }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        class="border-t border-zinc-800 bg-zinc-900/90 px-3 py-4 text-base text-slate-500 sm:px-5 sm:text-2xl"
      >
        <div
          class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <span>Menampilkan {{ reports.length }} baris data.</span>
          <div class="flex items-center gap-2 rounded-3xl bg-zinc-950/90 p-2">
            <button
              type="button"
              @click="prevPage"
              class="rounded-2xl px-3 py-2 text-base font-medium text-slate-200 transition hover:bg-zinc-800 sm:text-xl"
            >
              Prev
            </button>
            <div
              class="flex items-center gap-2 px-3 py-2 text-base text-slate-300 sm:text-xl"
            >
              <span class="font-semibold text-slate-100">Page</span>
              <span class="font-semibold text-white">{{ currentPage }}</span>
              <span class="text-slate-400">/</span>
              <span class="text-slate-300">{{ totalPages }}</span>
            </div>
            <button
              type="button"
              @click="nextPage"
              class="rounded-2xl px-3 py-2 text-base font-medium text-slate-200 transition hover:bg-zinc-800 sm:text-xl"
            >
              Next
            </button>
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
      v-if="error"
      class="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-[550px] rounded-2xl border border-red-500/60 bg-zinc-900 shadow-2xl sm:bottom-6 sm:right-6"
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
          <p class="text-3xl font-bold text-red-400">Error</p>

          <p class="mt-1 text-2xl text-slate-300">
            {{ error }}
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
