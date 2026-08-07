import { defineStore } from 'pinia';

export const useGasStore = defineStore('gas', {
  state: () => ({
    history: [],
    latest: {
      flow: 0,
      todayTotal: 0,
      allTimeTotal: 0,
      lastUpdate: '',
    },
  }),
  actions: {
    pushData(payload) {
      const timestamp = payload.timestamp || new Date().toISOString();
      const flowValue = Number(payload.flow ?? payload.value ?? payload.gasFlow ?? 0);
      const totalValue = Number(payload.totalflow ?? payload.totalFlow ?? payload.todayTotal ?? payload.allTimeTotal ?? 0);

      const entry = {
        id: `${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
        timestamp,
        flow: Number.isFinite(flowValue) ? flowValue : 0,
        totalflow: Number.isFinite(totalValue) ? totalValue : 0,
      };

      this.history.push(entry);

      if (this.history.length > 120) {
        this.history = this.history.slice(-120);
      }

      const lastUpdate = payload.lastUpdate || timestamp;

      this.latest = {
        flow: entry.flow,
        todayTotal: Number(payload.todayTotal ?? payload.totalflow ?? payload.totalFlow ?? this.latest.todayTotal ?? totalValue),
        allTimeTotal: Number(payload.allTimeTotal ?? payload.totalflow ?? payload.totalFlow ?? this.latest.allTimeTotal ?? totalValue),
        lastUpdate,
      };
    },
  },
});
