import { defineStore } from 'pinia'

export const useEnergyStore = defineStore('energy', {
  state: () => ({
    selectedUnit: 0,
    units: [
      {
        name: 'Unit Produksi Mixer',
        status: 'Running',
        runtimeMinutes: 30,
        runtimeToday: 0,
        voltage: 231.2,
        flow: 0,
        currents: { phase1: 12.4, phase2: 11.9, phase3: 12.2 },
        watts: { phase1: 1720, phase2: 1700, phase3: 1715 },
      },
      {
        name: 'Unit Produksi Oven',
        status: 'Running',
        runtimeMinutes: 50,
        runtimeToday: 1022,
        voltage: 231.2,
        flow: 2400,
        currents: { phase1: 12.4, phase2: 11.9, phase3: 12.2 },
        watts: { phase1: 1720, phase2: 1700, phase3: 1715 },
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
    runtimeToday(state) {
      return state.currentUnit.runtimeToday
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
    flow(state) {
      return state.currentUnit.flow
    },
    formattedRuntime(state) {
      const hours = Math.floor(state.runtimeMinutes / 60)
      const minutes = state.runtimeMinutes % 60
      return `${hours}h ${minutes.toString().padStart(2, '0')}m`
    },
    formattedRuntimeToday(state) {
      const hours = Math.floor(state.runtimeToday / 60)
      const minutes = state.runtimeToday % 60
      return `${hours}h ${minutes.toString().padStart(2, '0')}m`
    },
    statusClasses(state) {
      return state.status === 'Running'
        ? 'border border-lime-500/20 bg-lime-500/10 text-lime-400'
        : 'border border-amber-500/20 bg-amber-500/10 text-amber-400'
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
    updateFlow(value) {
      this.currentUnit.flow = Number(value)
    },
    incrementRuntime(minutes = 1) {
      this.currentUnit.runtimeMinutes += minutes
    },
  },
})

