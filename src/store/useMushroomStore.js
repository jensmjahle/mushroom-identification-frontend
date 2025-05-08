import { defineStore } from 'pinia'
import {getUserRequestMushrooms} from "@/services/rest/mushroomService.js";


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
    },
    async fetchMushrooms(requestId) {
      try {
        const response = await getUserRequestMushrooms(requestId)
        this.setMushrooms(response.data)
      } catch (error) {
        console.error('[MushroomStore] Failed to fetch mushrooms:', error)
      }
    }
  }
})
