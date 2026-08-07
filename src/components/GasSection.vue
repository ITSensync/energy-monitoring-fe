<template>
  <section class="grid min-w-0 gap-6 overflow-hidden">
    <div class="col-span-full grid gap-4 min-w-0 xl:grid-cols-[2fr_1fr]">
      <div
        class="min-w-0 rounded-[2rem] border border-zinc-800 bg-zinc-800 p-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)] min-h-[320px] sm:p-6"
      >
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="mt-2 text-2xl font-medium text-slate-100">
              Realtime Gas Flow
            </h2>
          </div>

          <span
            class="rounded-full border border-lime-500/20 bg-lime-500/10 px-4 py-2 text-sm font-semibold text-lime-400"
          >
            Running
          </span>
        </div>

        <div
          class="mt-6 h-[320px] w-full min-w-0 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/95 p-2 sm:h-[420px] lg:h-[560px]"
        >
          <div
            class="h-full min-w-0 overflow-hidden rounded-2xl border border-dashed border-zinc-700 text-slate-500"
          >
            <GasChart :history="gasStore.history" />
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-4">
        <div
          class="relative overflow-hidden rounded-3xl border border-rose-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-rose-400"
          ></div>
          <p class="text-sm uppercase tracking-[0.3em] text-rose-400">
            Gas Flow Rate
          </p>
          <div
            class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex flex-col gap-4">
                <p class="text-sm text-slate-400">Gas Keluar Saat ini</p>
                <p class="text-3xl font-semibold text-slate-100 sm:text-5xl">
                  {{ gasStore.latest.flow }} l/min
                </p>
                <div class="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-xl">
                  <p>Last Update</p>
                  <p class="font-medium">{{ gasStore.latest.lastUpdate || '—' }}</p>
                </div>
              </div>

              <span
                class="rounded-full bg-rose-400 px-4 py-2 text-sm font-bold text-zinc-900"
                >Stabil</span
              >
            </div>
          </div>
        </div>
        <div
          class="relative overflow-hidden rounded-3xl border border-rose-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-orange-400"
          ></div>
          <p class="text-sm uppercase tracking-[0.3em] text-orange-400">
            Today Gas Flow
          </p>
          <div
            class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex flex-col gap-4">
                <p class="text-sm text-slate-400">Total Gas Keluar hari ini</p>
                <p class="text-3xl font-semibold text-slate-100 sm:text-5xl">
                  {{ gasStore.latest.todayTotal }} m³
                </p>
                <div class="flex flex-col gap-1 text-base sm:flex-row sm:justify-between sm:text-xl">
                  <p>Last Update</p>
                  <p class="font-medium">{{ gasStore.latest.lastUpdate || '—' }}</p>
                </div>
              </div>

              <span
                class="rounded-full bg-orange-400 px-4 py-2 text-sm font-bold text-zinc-900"
                >Stabil</span
              >
            </div>
          </div>
        </div>
        <div
          class="relative overflow-hidden rounded-3xl border border-rose-400/15 bg-zinc-800 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.7)]"
        >
          <div
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-sky-400"
          ></div>
          <p class="text-sm uppercase tracking-[0.3em] text-sky-400">
            Alltime Gas Flow
          </p>
          <div
            class="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900/95 p-6"
          >
            <div class="flex items-center justify-between gap-4">
              <div class="flex flex-col gap-4">
                <p class="text-sm text-slate-400">
                  Total Gas Keluar sejak mesin dinyalakan
                </p>
                <p class="text-3xl font-semibold text-slate-100 sm:text-5xl">
                  {{ gasStore.latest.allTimeTotal }} m³
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import mqtt from 'mqtt';
import { useGasStore } from '../stores/useGasStore';
import GasChart from './Chart/GasChart.vue';

const gasStore = useGasStore();

let client = null;

function handleIncomingPayload(payload) {
  if (!payload) return;

  if (typeof payload === 'string') {
    try {
      const parsed = JSON.parse(payload);
      gasStore.pushData(parsed);
      return;
    } catch {
      gasStore.pushData({ flow: Number(payload) });
      return;
    }
  }

  if (payload.type === 'gas' || payload.sensor || payload.flow != null || payload.totalflow != null || payload.timestamp) {
    gasStore.pushData(payload);
  }
}

function connectToMqtt() {
  const brokerUrl = import.meta.env.VITE_MQTT_BROKER_URL || 'wss://broker.emqx.io:8084/mqtt';
  const topic = import.meta.env.VITE_MQTT_TOPIC || 'mqtt/orangepi/gasflowsensor/+';

  try {
    client = mqtt.connect(brokerUrl, {
      clientId: `gas-ui-${Math.random().toString(16).slice(2)}`,
      protocol: 'wss',
      reconnectPeriod: 5000,
    });

    client.on('connect', () => {
      client.subscribe(topic, (err) => {
        if (!err) {
          console.log('MQTT connected to topic:', topic);
        }
      });
    });

    client.on('message', (topicName, message) => {
      const text = message.toString();
      console.log('[MQTT]', topicName, text);
      handleIncomingPayload(text);
    });

    client.on('error', (err) => {
      console.error('MQTT connection error:', err);
    });
  } catch (error) {
    console.error('MQTT setup failed:', error);
  }
}

onMounted(() => {
  connectToMqtt();
});

onBeforeUnmount(() => {
  client?.end(true);
});
</script>
