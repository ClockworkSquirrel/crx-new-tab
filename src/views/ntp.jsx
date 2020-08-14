import React from "react"

import { makeStyles } from "@material-ui/core"

import Wallpaper from "../components/wallpaper"
import MainContent from "../components/main-content"

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        width: "100%",
        height: "100%"
    },
    wallpaperItem: {
        maxWidth: 512,
        flexGrow: 1,
        flexShrink: 1,
        overflow: "hidden",

        [theme.breakpoints.only("xs")]: {
            display: "none"
        }
    },
    contentItem: {
        flexGrow: 1,
        flexShrink: 0,
        minWidth: theme.breakpoints.values.sm,
        padding: theme.spacing(3),

        [theme.breakpoints.only("xs")]: {
            minWidth: "100%"
        }
    }
}))

const NTPView = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <div className={classes.wallpaperItem}>
                <Wallpaper />
            </div>

            <div className={classes.contentItem}>
                <MainContent />
            </div>
        </div>
    )
}

export default NTPView
