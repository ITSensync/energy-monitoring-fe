<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import * as XLSX from "xlsx";
import ReportChart from "./Chart/ReportChart.vue";

const startDate = ref("");
const endDate = ref("");
const parameter = ref("arus1");
const submittedParameter = ref("arus1");
const graphData = ref([]);
const reportChartRef = ref(null);
const loading = ref(false);
const submitLoading = ref(false);
const exportLoading = ref(false);
const error = ref("");

function formatDateToWIB(date) {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
    .format(date)
    // .replace(" ", "T");
}

// async function fetchAllReports() {
//   const allRows = [];
//   let page = 1;
//   let totalPagesFromApi;
//   const endDateValue = endDate.value || startDate.value;

//   while (true) {
//     const params = new URLSearchParams({
//       page: String(page),
//       limit: String(exportLimit),
//     });

//     if (startDate.value) {
//       params.set("startDate", startDate.value);
//     }

//     if (endDateValue) {
//       params.set("endDate", endDateValue);
//     }

//     const response = await fetch(
//       `${apiBaseUrl}/records/paginated?${params.toString()}`,
//     );
//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}`);
//     }

//     const body = await response.json();
//     const recordList = body.records || body.data || body;
//     const pageRows = Array.isArray(recordList) ? recordList : [];
//     allRows.push(...pageRows);

//     totalPagesFromApi = body.totalPages || body.total_pages;
//     if (totalPagesFromApi != null) {
//       if (page >= Number(totalPagesFromApi)) break;
//     } else if (pageRows.length < exportLimit) {
//       break;
//     }

//     page += 1;
//     if (page > 500) break;
//   }

//   return allRows;
// }

const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:8001";

const today = formatDateToWIB(new Date());
startDate.value = today;
endDate.value = today;

/* onMounted(() => {
  fetchGraphData();
}); */

async function fetchGraphData() {
  if (loading.value) return;

  loading.value = true;
  error.value = "";

  const endDateValue = endDate.value || startDate.value;
  const params = new URLSearchParams({});

  if (startDate.value) {
    params.set("startDate", startDate.value.replace("T", " "));
  }

  if (endDateValue) {
    params.set("endDate", endDateValue.replace("T", " "));
  }

  const activeParameter = submittedParameter.value || parameter.value;

  if (activeParameter) {
    params.set("parameter", activeParameter);
  }

  console.log(params.toString());

  try {
    const response = await fetch(`${apiBaseUrl}/records?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const body = await response.json();
    const recordList = Array.isArray(body)
      ? body
      : Array.isArray(body.records)
        ? body.records
        : Array.isArray(body.data)
          ? body.data
          : [];

    graphData.value = recordList;
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    graphData.value = [];
  } finally {
    loading.value = false;
  }
}

// watch(currentPage, (value) => {
//   pageInput.value = String(value);
// });

async function handleSubmit() {
  if (submitLoading.value || loading.value) return;

  submitLoading.value = true;
  error.value = "";

  try {
    submittedParameter.value = parameter.value || "arus1";
    await fetchGraphData();
  } finally {
    submitLoading.value = false;
  }
}

async function handleExport() {
  if (exportLoading.value || loading.value) return;

  exportLoading.value = true;
  error.value = "";

  try {
    await nextTick();
    reportChartRef.value?.exportChartAsPng?.();
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  } finally {
    exportLoading.value = false;
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
        <h2
          class="mt-2 text-3xl font-semibold tracking-tight text-slate-100 sm:text-5xl"
        >
          Graph Dashboard
        </h2>
        <p class="mt-1 max-w-5xl text-base text-slate-400 sm:text-2xl">
          <!-- Kosongkan end date untuk menampilkan data rentang satu hari -->
        </p>
      </div>
    </div>

    <div class="mb-6 flex w-full flex-col gap-4 xl:flex-row xl:items-end">
      <!-- Start Date -->
      <label class="block w-full xl:flex-1">
        <span class="mb-2 block text-lg font-medium text-slate-400 sm:text-2xl">
          Start Date
        </span>

        <input
          type="datetime-local"
          v-model="startDate"
          class="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-lg text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-lime-500 sm:text-2xl"
        />
      </label>

      <!-- End Date -->
      <label class="block w-full xl:flex-1">
        <span class="mb-2 block text-lg font-medium text-slate-400 sm:text-2xl">
          End Date
        </span>

        <input
          type="datetime-local"
          v-model="endDate"
          class="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-lg text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-lime-500 sm:text-2xl"
        />
      </label>

      <label class="block w-full xl:flex-1">
        <span class="mb-2 block text-lg font-medium text-slate-400 sm:text-2xl">
          Parameter
        </span>

        <select
          v-model="parameter"
          required
          class="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-lg text-slate-100 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-lime-500 sm:text-2xl"
        >
          <option value="" disabled selected>Pilih parameter</option>
          <option value="arus1">Arus 1</option>
          <option value="arus2">Arus 2</option>
          <option value="arus3">Arus 3</option>
          <option value="tegangan">Tegangan</option>
          <option value="kwatt">Energy (kWh)</option>
          <option value="temp">Suhu (Celcius)</option>
          <option value="getaran">Getaran</option>
        </select>
      </label>

      <!-- Submit -->
      <div class="w-full xl:flex-1">
        <button
          type="button"
          :disabled="submitLoading || loading"
          @click="handleSubmit"
          class="flex w-full items-center justify-center gap-3 rounded-2xl bg-sky-500 px-5 py-3 text-lg font-semibold text-white transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-70 sm:text-2xl"
        >
          <svg
            v-if="submitLoading"
            class="h-5 w-5 animate-spin sm:h-6 sm:w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-opacity="0.35"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          {{ submitLoading ? "Loading..." : "Submit" }}
        </button>
      </div>

      <!-- Export -->
      <div class="w-full xl:w-auto xl:shrink-0">
        <button
          type="button"
          :disabled="exportLoading || loading"
          @click="handleExport"
          class="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-900 px-5 py-3 text-lg font-semibold text-white transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-70 sm:text-2xl xl:w-auto"
        >
          <svg
            v-if="exportLoading"
            class="h-5 w-5 animate-spin sm:h-6 sm:w-6"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-opacity="0.35"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="28"
            height="28"
            class="shrink-0"
            aria-hidden="true"
          >
            <rect
              x="70"
              y="96"
              width="372"
              height="320"
              rx="32"
              fill="#1E293B"
            />
            <rect
              x="94"
              y="120"
              width="324"
              height="272"
              rx="20"
              fill="#0F172A"
              stroke="#38BDF8"
              stroke-width="8"
            />
            <path
              d="M142 284l52-62 44 52 74-100 86 110H142z"
              fill="#38BDF8"
              opacity="0.9"
            />
            <circle cx="182" cy="186" r="26" fill="#F8FAFC" />
            <rect
              x="312"
              y="328"
              width="96"
              height="36"
              rx="8"
              fill="#22C55E"
            />
            <text
              x="360"
              y="353"
              text-anchor="middle"
              font-size="18"
              font-weight="700"
              fill="#ffffff"
              font-family="Arial, sans-serif"
            >
              PNG
            </text>
            <path
              d="M196 382h120"
              stroke="#94A3B8"
              stroke-width="10"
              stroke-linecap="round"
              opacity="0.7"
            />
          </svg>

          {{ exportLoading ? "Exporting..." : "Export PNG" }}
        </button>
      </div>
    </div>

    <div
      v-if="graphData.length !== 0"
      class="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950/90"
    >
      <div class="overflow-x-auto h-[50svh]">
        <!-- GRAPH -->
        <ReportChart ref="reportChartRef" :chart-data="graphData" :parameter="submittedParameter" />
      </div>
    </div>
    <div v-else class="flex items-center justify-center p-4 w-full">
      <p class="font-semibold">Tidak ada grafik untuk ditampilkan...</p>
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
