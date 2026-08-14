import { defineStore } from "pinia";

export const useMenuStore = defineStore('menu', {
  state: () => ({
    selectedMenu: '0',
    menus: [
      {
        name: 'Dashboard',
        icon: 'mdi-view-dashboard',
      },
      {
        name: 'Report',
        icon: 'mdi-file-chart',
      },
      {
        name: 'Graph',
        icon: "",
      }
    ]
  }),
  getters: {
    currentMenu(state) {
      return state.menus[state.selectedMenu]
    },
  },
  actions: {
    selectMenu(index) {
      this.selectedMenu = index
    },
  }
});