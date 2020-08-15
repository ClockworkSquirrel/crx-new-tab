import React, { useRef, useEffect, useState } from "react"
import clsx from "clsx"

import Config from "../../config.json"

import URLs from "my-name-is-url"
import throttle from "lodash.throttle"

import { view } from "@risingstack/react-easy-state"
import DefaultStore from "../../state/store"

import { InputBase, makeStyles, useTheme, Collapse, Typography } from "@material-ui/core"

import WebstoreButton from "./webstore-button"

import GoogleColourIcon from "../icons/google-colour-icon"
import GoogleIcon from "../icons/google-icon"

const rootTransition = theme => `${theme.transitions.easing.easeOut} ${theme.transitions.duration.shortest}ms`
const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        padding: 0,
        borderRadius: theme.shape.borderRadius * 2,
        transition: [
            `background-color ${rootTransition(theme)}`,
            `box-shadow ${rootTransition(theme)}`,
            `border ${rootTransition(theme)}`,
            `height ${rootTransition(theme)}`
        ],
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.background.default}`,

        "&:focus-within": {
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: theme.shadows[3],
            backgroundColor: theme.palette.background.paper
        }
    },
    searchRoot: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        cursor: "text",
        alignItems: "center",
        padding: theme.spacing(1, 1, 1, 2)
    },
    searchInput: {
        flexGrow: 1,
        margin: theme.spacing(0, 1, 0, 2),
        display: "block",
        height: "100%"
    },
    suggestRoot: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: theme.spacing(0, 1, 1)
    },
    suggestItem: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        color: theme.palette.text.secondary,
        padding: theme.spacing(1),
        borderRadius: theme.shape.borderRadius,
        transition: [
            `background-color ${rootTransition(theme)}`,
            `padding ${rootTransition(theme)}`,
            `color ${rootTransition(theme)}`
        ],
        cursor: "pointer",

        "&:hover": {
            color: theme.palette.text.primary
        }
    },
    suggestItemSelected: {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.divider
    }
}))

const suggestNavKeys = [
    "ArrowUp",
    "ArrowDown"
]

function NavigateOrSearch(query = "") {
    try {
        const detectedUrl = URLs(query).get()?.[0]

        if (!detectedUrl)
            throw new Error("No URLs matched")

        if (query.trim() !== detectedUrl)
            throw new Error("Search input contained more than just a URL")

        if (detectedUrl.match(/^(?:[a-z]+:)?\/\//i)) {
            window.location.assign(detectedUrl)
        } else {
            window.location.assign(`http://${detectedUrl}`)
        }
    } catch (err) {
        const searchUrl = new URL(Config.endpoints.search)
        searchUrl.searchParams.set("q", query)

        window.location.assign(searchUrl.toString())
    }
}

const SearchInputRoot = () => {
    const classes = useStyles()
    const theme = useTheme()

    const [searchFocused, setSearchFocused] = useState(false)

    const [searchText, setSearchText] = useState("")
    const searchInputRef = useRef(null)

    const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
    const [searchSuggestions, setSearchSuggestions] = useState([])
    const throttleSuggest = useRef(throttle((query = searchText) => {
        /*
            Search suggestions endpoint, used by Chromium:
            https://github.com/chromium/chromium/blob/2ca8c5037021c9d2ecc00b787d58a31ed8fc8bcb/chrome/test/data/firefox_searchplugins/default/google.xml
        */

        const autocompleteUrl = new URL(`${Config.endpoints.autocomplete}`)
        autocompleteUrl.searchParams.set("hl", navigator.language ?? "en-GB")
        autocompleteUrl.searchParams.set("q", query)

        return fetch(autocompleteUrl.toString())
            .then(res => res.json())
            .then(res => res?.[1] ?? [])
            .catch(err => console.error(err))
    }, 250, { trailing: true }))

    const submitQuery = evt => {
        if (evt.key === "Enter") {
            evt.preventDefault()

            NavigateOrSearch(evt.target.value)
        } else if (suggestNavKeys.includes(evt.key)) {
            evt.preventDefault()

            if (evt.key === "ArrowUp") {
                if (selectedSuggestion <= 0) {
                    setSelectedSuggestion(searchSuggestions.length - 1)
                } else {
                    setSelectedSuggestion(selectedSuggestion - 1)
                }
            } else {
                if (selectedSuggestion === searchSuggestions.length - 1) {
                    setSelectedSuggestion(0)
                } else {
                    setSelectedSuggestion(selectedSuggestion + 1)
                }
            }

            return false
        }
    }

    const onInputChanged = evt => {
        evt.preventDefault()
        setSearchText(evt.target.value)

        if (!evt.target.value.trim().length)
            return setSearchSuggestions([])

        throttleSuggest.current(evt.target.value)
            .then(suggestions => setSearchSuggestions(suggestions))
            .catch(err => console.error(err))
    }

    useEffect(() => {
        DefaultStore.focusSearchEvent.addEventListener("focus", () => searchInputRef.current.focus())
        DefaultStore.focusSearchEvent.addEventListener("blur", () => searchInputRef.current.blur())
    }, [])

    useEffect(() => setSelectedSuggestion(-1), [searchSuggestions])
    useEffect(() => {
        if (selectedSuggestion > -1)
            setSearchText(searchSuggestions[selectedSuggestion])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSuggestion])

    return (
        <div className={classes.root}>
            <div className={classes.searchRoot} onClickCapture={DefaultStore.actions.focusSearch}>
                {
                    theme.palette.type === "dark"
                        ? <GoogleIcon />
                        : <GoogleColourIcon />
                }

                <InputBase
                    className={classes.searchInput}
                    placeholder={"Search Google or type a URL"}
                    autoComplete="off"
                    inputRef={searchInputRef}
                    onKeyDown={submitQuery}
                    value={searchText}
                    onChange={onInputChanged}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                />

                <WebstoreButton />
            </div>

            <Collapse in={searchFocused && searchSuggestions.length}>
                <div className={classes.suggestRoot}>
                    {
                        searchSuggestions?.map((suggestion, index) =>
                            <div
                                key={suggestion}
                                className={clsx(classes.suggestItem, {
                                    [classes.suggestItemSelected]: index === selectedSuggestion
                                })}
                                onClick={() => {
                                    setSearchText(suggestion)
                                    NavigateOrSearch(suggestion)
                                }}
                            >
                                <Typography variant="body1" className={classes.suggestItemText}>
                                    {suggestion}
                                </Typography>
                            </div>
                        )
                    }
                </div>
            </Collapse>
        </div>
    )
}

export default view(SearchInputRoot)
