import {getUserRequestMushrooms} from "@/services/rest/mushroomService.js";
import {defineStore} from "pinia";

export const useMushroomStore = defineStore('mushroom', {
  state: () => ({
    mushrooms: []
  }),
  actions: {
    setMushrooms(mushroomList) {
      if (!Array.isArray(mushroomList)) return
      const map = new Map(mushroomList.map(m => [m.mushroomId, m]))
      this.mushrooms = this.mushrooms.map(existing =>
          map.has(existing.mushroomId) ? map.get(existing.mushroomId) : existing
      )
      // add new ones
      mushroomList.forEach(m => {
        if (!this.mushrooms.find(x => x.mushroomId === m.mushroomId)) {
          this.mushrooms.push(m)
        }
      })
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
        const response = await getUserRequestMushrooms(requestId)
        this.setMushrooms(response.data)
      } catch (error) {
        console.error('[MushroomStore] Failed to fetch mushrooms:', error)
      }
    }
  }
})
  