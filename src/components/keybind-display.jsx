import React from "react"
import clsx from "clsx"

import { makeStyles, lighten, darken } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    root: {
        fontFamily: [
            "'Fira Code Retina'",
            "'Fira Code'",
            "'Source Code Pro'",
            "Consolas",
            "Monaco",
            "monospace"
        ],
        fontFeatureSettings: "'liga' 1",
        fontVariantLigatures: "common-ligatures",
        alignItems: "center",
        background: theme.palette.background.default,
        borderColor: (theme.palette.type === "dark" ? lighten : darken)(theme.palette.background.default, .2),
        borderWidth: 1,
        borderStyle: "solid",
        borderBottomWidth: 2,
        borderRadius: theme.shape.borderRadius,
        color: (theme.palette.type === "dark" ? lighten : darken)(theme.palette.background.default, .4),
        display: "inline-flex",
        justifyContent: "center",
        padding: theme.spacing(1),
        minWidth: 36,
        cursor: "default"
    }
}))

const KeybindDisplay = ({ children, className, ...props }) => {
    const classes = useStyles()

    return (
        <span className={clsx(classes.root, className)} {...props}>
            {children}
        </span>
    )
}

export default KeybindDisplay
