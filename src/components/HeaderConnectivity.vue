<template>
  <div
    class="flex flex-row items-center gap-3 rounded-3xl bg-zinc-900/90 p-4 text-left shadow-inner shadow-zinc-950/40"
  >
    <div>
      <p class="text-sm font-medium text-slate-300">{{ todayDate }}</p>
      <p class="mt-1 font-mono text-2xl font-semibold text-slate-100">
        {{ currentTime }}
      </p>
    </div>


    <div class="flex items-center justify-between gap-4">
      <span
        class="inline-flex h-14 w-14 items-center justify-center rounded-2xl border"
        :class="isConnected ? connectedClasses : disconnectedClasses"
        :title="connectionLabel"
        :aria-label="connectionLabel"
      >
        <svg
          v-if="isConnected"
          viewBox="0 0 24 24"
          class="h-8 w-8"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 8.5a14 14 0 0 1 19 0" />
          <path d="M5 13a10 10 0 0 1 14 0" />
          <path d="M8.5 16.5a5 5 0 0 1 7 0" />
          <path d="M12 20h.01" />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          class="h-8 w-8"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M2.5 8.5a14 14 0 0 1 19 0" />
          <path d="M5 13a10 10 0 0 1 14 0" />
          <path d="M8.5 16.5a5 5 0 0 1 7 0" />
          <path d="M12 20h.01" />
          <path d="M3 3l18 18" />
        </svg>
      </span>
    </div>

    <!-- <p
      class="text-xs font-semibold"
      :class="isConnected ? 'text-lime-400' : 'text-red-400'"
    >
      {{ connectionLabel }}
    </p> -->
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const CHECK_URL = "https://google.com";
const CHECK_INTERVAL = 30000;

const now = ref(new Date());
const isConnected = ref(navigator.onLine);

let clockTimer;
let connectionTimer;

const connectedClasses =
  "border-lime-400/40 bg-lime-400/10 text-lime-400 shadow-[0_0_24px_rgba(163,230,53,0.22)]";
const disconnectedClasses =
  "border-red-400/40 bg-red-400/10 text-red-400 shadow-[0_0_24px_rgba(248,113,113,0.2)]";

const todayDate = computed(() =>
  new Intl.DateTimeFormat("en-EN", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(now.value),
);

const currentTime = computed(() =>
  new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .format(now.value)
    .replaceAll(".", ":"),
);

const connectionLabel = computed(() =>
  isConnected.value ? "Connected" : "Disconnected",
);

async function checkInternetConnection() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    await fetch(CHECK_URL, {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-store",
      signal: controller.signal,
    });
    isConnected.value = true;
  } catch {
    isConnected.value = false;
  } finally {
    window.clearTimeout(timeout);
  }
}

function updateOnlineStatus() {
  isConnected.value = navigator.onLine;
  if (navigator.onLine) {
    checkInternetConnection();
  }
}

onMounted(() => {
  clockTimer = window.setInterval(() => {
    now.value = new Date();
  }, 1000);

  checkInternetConnection();
  connectionTimer = window.setInterval(checkInternetConnection, CHECK_INTERVAL);
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);
});

onBeforeUnmount(() => {
  window.clearInterval(clockTimer);
  window.clearInterval(connectionTimer);
  window.removeEventListener("online", updateOnlineStatus);
  window.removeEventListener("offline", updateOnlineStatus);
});
</script>
