import React, { useEffect } from "react"
import Config from "../config.json"

import { view } from "@risingstack/react-easy-state"
import DefaultStore from "../state/store"

import { ThemeProvider, CssBaseline, createMuiTheme, makeStyles } from "@material-ui/core"
import NTPView from "../views/ntp"

const { flags } = Config

const generateTheme = props => createMuiTheme({
    palette: {
        type: props?.dark ? "dark" : "light"
    },
    typography: {
        fontFamily: [
            "'Lexend Deca'",
            "Helvetica",
            "Arial",
            "sans-serif"
        ]
    }
})

const useStyles = makeStyles({
    root: {
        width: "100vw",
        height: "100vh",
        overflowX: "hidden"
    }
})

const App = () => {
    const classes = useStyles()
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    useEffect(() => {
        window.addEventListener("keydown", evt => {
            if (evt.target === document.body && evt.key === "/") {
                if (!Config.flags.enableSlashFocusSearch) return

                evt.preventDefault()
                DefaultStore.actions.focusSearch()
            } else if (evt.target !== document.body && evt.key === "Escape") {
                if (!Config.flags.enableEscapeUnfocusSearch) return

                evt.preventDefault()
                DefaultStore.actions.unfocusSearch()
            }
        }, false)
    }, [])

    return (
        <div className={classes.root}>
            <ThemeProvider theme={generateTheme({
                dark: process.env.NODE_ENV === "development"
                    ? flags.enableDarkModeDev && isDark
                    : flags.enableDarkMode && isDark
            })}>
                <CssBaseline />

                <NTPView />
            </ThemeProvider>
        </div>
    )
}

export default view(App)