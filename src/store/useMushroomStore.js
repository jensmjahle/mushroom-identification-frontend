import {getUserRequestMushrooms} from "@/services/rest/mushroomService.js";
import {defineStore} from "pinia";

export const useMushroomStore = defineStore('mushroom', {
  state: () => ({
    mushrooms: []
  }),
  actions: {
    setMushrooms(mushroomList) {
      if (Array.isArray(mushroomList)) {
        this.mushrooms = mushroomList
      } else {
        this.mushrooms = []
      }
    },
    updateMushroom(updated) {
      if (!Array.isArray(this.mushrooms)) {
        this.mushrooms = []
      }
      const index = this.mushrooms.findIndex(m => m.mushroomId === updated.mushroomId)
      if (index !== -1) {
        this.mushrooms.splice(index, 1, updated)
      }
    },
    async fetchMushrooms(requestId) {
      try {
        const data = await getUserRequestMushrooms(requestId)
        console.log('[MushroomStore] Fetched mushrooms:', data)
        this.setMushrooms(data)
      } catch (error) {
        console.error('[MushroomStore] Failed to fetch mushrooms:', error)
      }
    }
  }
})
  