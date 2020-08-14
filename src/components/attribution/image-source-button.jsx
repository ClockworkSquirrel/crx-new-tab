import React from "react"

import IconButton from "@material-ui/core/IconButton"
import makeStyles from "@material-ui/core/styles/makeStyles"

import ViewSourceIcon from "@material-ui/icons/OpenInBrowser"

const useStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.down("sm")]: {
            display: "none"
        }
    }
}))

const ImageSourceButton = props => {
    const classes = useStyles()

    return (
        <IconButton
            color="inherit"
            rel="noopener noreferrer"
            target="_blank"
            className={classes.root}
            {...props}
        >
            <ViewSourceIcon />
        </IconButton>
    )
}

export default ImageSourceButton
