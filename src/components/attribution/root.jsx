import React from "react"

import AuthorInfo from "./author-info"
import AuthorImageAvatar from "./author-image-avatar"
import ImageSourceButton from "./image-source-button"

import { makeStyles } from "@material-ui/core"

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        height: 64,
        backgroundColor: "rgba(0, 0, 0, .38)",
        color: "rgba(255, 255, 255, .87)",
        backdropFilter: "blur(32px)",
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "default"
    }
}))

const AttributionContainer = props => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <AuthorImageAvatar name={props.name} src={props.authorImage} />
            <AuthorInfo name={props.name} source={props.source} />
            <ImageSourceButton href={props.url} />
        </div>
    )
}

export default AttributionContainer
