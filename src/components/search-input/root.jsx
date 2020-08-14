import React, { useRef, useEffect, useState } from "react"
import Config from "../../config.json"

import { view } from "@risingstack/react-easy-state"
import DefaultStore from "../../state/store"

import { InputBase, makeStyles, useTheme } from "@material-ui/core"

import WebstoreButton from "./webstore-button"

import GoogleColourIcon from "../icons/google-colour-icon"
import GoogleIcon from "../icons/google-icon"

const rootTransition = theme => `${theme.transitions.easing.easeOut} ${theme.transitions.duration.shortest}ms`
const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        width: "100%",
        padding: theme.spacing(1, 1, 1, 2),
        borderRadius: theme.shape.borderRadius * 2,
        alignItems: "center",
        cursor: "text",
        transition: `background-color ${rootTransition(theme)}, box-shadow ${rootTransition(theme)}, border ${rootTransition(theme)}`,
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.background.default}`,

        "&:focus-within": {
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper
        }
    },
    searchInput: {
        flexGrow: 1,
        margin: theme.spacing(0, 1, 0, 2),
        display: "block",
        height: "100%"
    }
}))

const SearchInputRoot = () => {
    const classes = useStyles()
    const theme = useTheme()

    const [searchText, setSearchText] = useState("")
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

    const onInputChanged = evt => {
        evt.preventDefault()
        setSearchText(evt.target.value)
    }

    useEffect(() => {
        DefaultStore.focusSearchEvent.addEventListener("focus", evt => {
            if (evt.detail)
                setSearchText(`${searchText}${evt.detail}`)

            searchInputRef.current.focus()
        })

        DefaultStore.focusSearchEvent.addEventListener("blur", () => {
            searchInputRef.current.blur()
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                value={searchText}
                onChange={onInputChanged}
            />

            <WebstoreButton />
        </div>
    )
}

export default view(SearchInputRoot)
