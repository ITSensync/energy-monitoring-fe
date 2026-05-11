import { defineStore } from 'pinia'

export const useEnergyStore = defineStore('energy', {
  state: () => ({
    selectedUnit: 0,
    units: [
      {
        name: 'Unit Produksi 7',
        status: 'Running',
        runtimeMinutes: 348,
        voltage: 231.2,
        currents: { phase1: 12.4, phase2: 11.9, phase3: 12.2 },
        watts: { phase1: 1720, phase2: 1700, phase3: 1715 },
      },
      {
        name: 'Unit Produksi 8',
        status: 'Running',
        runtimeMinutes: 412,
        voltage: 229.8,
        currents: { phase1: 13.1, phase2: 12.7, phase3: 13.0 },
        watts: { phase1: 1870, phase2: 1845, phase3: 1860 },
      },
      {
        name: 'Unit Produksi 9',
        status: 'Stopped',
        runtimeMinutes: 156,
        voltage: 230.5,
        currents: { phase1: 0.0, phase2: 0.0, phase3: 0.0 },
        watts: { phase1: 0.0, phase2: 0.0, phase3: 0.0 },
      },
      {
        name: 'Unit Produksi 10',
        status: 'Running',
        runtimeMinutes: 289,
        voltage: 232.1,
        currents: { phase1: 11.8, phase2: 12.2, phase3: 11.5 },
        watts: { phase1: 1685, phase2: 1710, phase3: 1690 },
      },
    ],
  }),
  getters: {
    currentUnit(state) {
      return state.units[state.selectedUnit]
    },
    machineName(state) {
      return state.currentUnit.name
    },
    status(state) {
      return state.currentUnit.status
    },
    runtimeMinutes(state) {
      return state.currentUnit.runtimeMinutes
    },
    voltage(state) {
      return state.currentUnit.voltage
    },
    currents(state) {
      return state.currentUnit.currents
    },
    watts(state) {
      return state.currentUnit.watts
    },
    formattedRuntime(state) {
      const hours = Math.floor(state.runtimeMinutes / 60)
      const minutes = state.runtimeMinutes % 60
      return `${hours}h ${minutes.toString().padStart(2, '0')}m`
    },
    statusClasses(state) {
      return state.status === 'Running'
        ? 'bg-lime-500 text-slate-950'
        : 'bg-amber-500 text-slate-950'
    },
  },
  actions: {
    selectUnit(index) {
      this.selectedUnit = index
    },
    toggleStatus() {
      this.currentUnit.status = this.currentUnit.status === 'Running' ? 'Stopped' : 'Running'
    },
    updateVoltage(value) {
      this.currentUnit.voltage = Number(value)
    },
    updateCurrent(phase, value) {
      this.currentUnit.currents[phase] = Number(value)
    },
    updateWatt(phase, value) {
      this.currentUnit.watts[phase] = Number(value)
    },
    incrementRuntime(minutes = 1) {
      this.currentUnit.runtimeMinutes += minutes
    },
  },
})
