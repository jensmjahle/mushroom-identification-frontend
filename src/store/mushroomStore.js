import { defineStore } from 'pinia'

export const useMushroomStore = defineStore('mushroom', {
  state: () => ({
    mushrooms: [],
  }),
  actions: {
    setMushrooms(mushroomList) {
      this.mushrooms = mushroomList
    },
    updateMushroom(updated) {
      const index = this.mushrooms.findIndex(m => m.mushroomId === updated.mushroomId)
      if (index !== -1) {
        this.mushrooms.splice(index, 1, updated) 
      }
    }
  }
})
