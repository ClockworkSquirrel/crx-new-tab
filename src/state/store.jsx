import { store, autoEffect } from "@risingstack/react-easy-state"
import Config from "../config.json"

const localStorageKey = Config.localStorage
const savedState = JSON.parse(localStorage.getItem(localStorageKey))

const DefaultStore = store({
    focusSearchEvent: new EventTarget(),

    persist: {
        wallpaperTags: ["landscapes", "textures", "art", "life", "earth", "cityscapes", "geometric", "animals", "nature"],
        wallpaperData: {
            fetched: null,
            imageUrl: null,
            imagePage: null,
            userName: null,
            userImageUrl: null
        },

        ...savedState
    },

    actions: {
        fetchWallpaper: async () => {
            const date = new Date()
            const today = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, 0)}${String(date.getDate()).padStart(2, 0)}`

            if (DefaultStore.persist.wallpaperData?.fetched !== today) {
                try {
                    const unsplashUrl = new URL(Config.endpoints.unsplash)
                    unsplashUrl.searchParams.set("query", DefaultStore.persist.wallpaperTags.join(","))

                    const response = await fetch(unsplashUrl, {
                        method: "GET"
                    })

                    if (response.ok) {
                        const json = await response.json()

                        const imageUrl = new URL(json?.urls?.raw)
                        imageUrl.searchParams.set("crop", "focalpoint")
                        imageUrl.searchParams.set("fit", "crop")
                        imageUrl.searchParams.set("w", 512)
                        imageUrl.searchParams.set("h", 1080)

                        DefaultStore.persist.wallpaperData = {
                            fetched: today,
                            imageUrl: imageUrl.toString(),
                            imagePage: json?.links?.html,
                            userName: json?.user?.name,
                            userImageUrl: json?.user?.profile_image?.medium
                        }
                    }
                } catch (err) {
                    console.error(err?.message ?? err)
                }
            }

            return DefaultStore.persist.wallpaperData
        },

        focusSearch: async (focus = true) => {
            const searchEvent = new Event(focus ? "focus" : "blur")
            DefaultStore.focusSearchEvent.dispatchEvent(searchEvent)
        },

        unfocusSearch: async () => DefaultStore.actions.focusSearch(false)
    }
})

autoEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(DefaultStore.persist))
})

export default DefaultStore
