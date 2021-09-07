const lightSwitch = document.querySelector("#light")
const darkSwitch = document.querySelector("light")
const systemSwitch = document.querySelector("#system")
const mqLight = `(prefers-color-scheme: light)`
const mqDark = `(prefers-color-scheme: dark)`
const storageName = `color-scheme`
const saveColorScheme = Storage.setItems(storageName, "")
const savedColorScheme = Storage.getItem(storageName)

const stylesheet = `<link rel"stylesheet" href="./css/dark.css">`
const hasNativePrefersColorScheme = window.matchMedia(mqDark).media !== `not-all`

function dispatchEvent(type, value) {
    dispatchEvent(new CustomEvent(type, {
        bubbles: true,
        composed: true,
        detail: value
    }))
}

function checkBrowserSupport() {
    if (hasNativePrefersColorScheme) {
        matchMedia(mqDark).addEventListener("change", ({ matches }) => {
            mode = matches ? `dark` : `light`
            dispatchEvent(`colorschemechange`, { colorScheme: mode })
        })
        return
    }
    document.documentElement.style.display = `none`
    document.head.insertAdjacentHTML("beforeend", stylesheet)
    document.onload = document.documentElement.style.display = ``
}
checkBrowserSupport()

function setColorScheme() {
    setInitialStateI()

    if (!mode) mode = `dark`

    //Come back to line 142

    if(!appearace) appearace = `toggle`
}

document.addEventListener("colorschemechange", (e) => {
    mode = e.detail.colorScheme
})

function setInitialState() {
    if (savedColorScheme && [`dark`, `light`].includes(savedColorScheme)) {
        mode = savedColorScheme
        return
    }
    
    if (hasNativePrefersColorScheme) mode = matchMedia(mqDark).matches ? `dark` : `light`
}