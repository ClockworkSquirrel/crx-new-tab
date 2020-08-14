import React, { useRef, useEffect } from "react"

import { view } from "@risingstack/react-easy-state"
import DefaultStore from "../../state/store"

import { InputBase, IconButton, makeStyles, useTheme } from "@material-ui/core"
import KeybindDisplay from "../keybind-display"

import Config from "../../config.json"

import GoogleColourIcon from "../icons/google-colour-icon"
import GoogleIcon from "../icons/google-icon"

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        width: "100%",
        padding: theme.spacing(1, 1, 1, 2),
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius * 2,
        alignItems: "center",
        cursor: "text",
        transition: `all ${theme.transitions.easing.easeOut} ${theme.transitions.duration.shortest}ms`,
        backgroundColor: theme.palette.background.default,

        "&:focus-within": {
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper
        }
    },
    searchInput: {
        flexGrow: 1,
        margin: theme.spacing(0, 1, 0, 2),
        display: "block",
        height: "100%"
    },
    keybindDisplay: {
        margin: theme.spacing(0, 1, 0, 0),

        [theme.breakpoints.only("xs")]: {
            display: "none"
        }
    }
}))

const SearchInputRoot = () => {
    const classes = useStyles()
    const theme = useTheme()

    const searchInputRef = useRef(null)
    const submitQuery = evt => {
        if (evt.which === 13) {
            evt.preventDefault()

            try {
                const typedUrl = new URL(evt.target.value)
                window.location.assign(typedUrl.toString())
            } catch (err) {
                const searchUrl = new URL(Config.endpoints.search)
                searchUrl.searchParams.set("q", evt.target.value)

                window.location.assign(searchUrl.toString())
            }
        }
    }

    useEffect(() => {
        DefaultStore.focusSearchEvent.addEventListener("focus", () => {
            searchInputRef.current.focus()
        })

        DefaultStore.focusSearchEvent.addEventListener("blur", () => {
            searchInputRef.current.blur()
        })
    }, [])

    return (
        <div className={classes.root} onClickCapture={DefaultStore.actions.focusSearch}>
            {
                theme.palette.type === "dark"
                    ? <GoogleIcon />
                    : <GoogleColourIcon />
            }

            <InputBase
                className={classes.searchInput}
                placeholder={"Search Google or type a URL"}
                name="q"
                style={{ width: "100%", display: "flex", height: "100%" }}
                autoComplete="off"
                inputRef={searchInputRef}
                onKeyPress={submitQuery}
                id="search"
            />

            {
                Config.flags.enableSlashFocusSearch
                    ? (
                        <KeybindDisplay className={classes.keybindDisplay}>
                            {"/"}
                        </KeybindDisplay>
                    )
                    : ""
            }

            <IconButton href={Config.webstore.url} rel="noopener noreferrer">
                <img src={"/assets/webstore.png"} alt={Config.webstore.name} width={24} height={24} />
            </IconButton>
        </div>
    )
}

export default view(SearchInputRoot)
