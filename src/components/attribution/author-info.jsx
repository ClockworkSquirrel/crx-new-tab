import React from "react"

import { makeStyles, Typography } from "@material-ui/core"
import clsx from "clsx"

const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        margin: theme.spacing(0, 0, 0, 2),
        alignItems: "flex-start",
        justifyContent: "center",
        overflow: "hidden"
    },
    infoText: {
        fontSize: theme.typography.fontSize,
        margin: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: "100%"
    },
    name: {
        fontWeight: theme.typography.fontWeightBold
    },
    source: {
        fontWeight: theme.typography.fontWeightLight
    }
}))

const AuthorInfo = props => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <Typography variant="body1" className={clsx(classes.infoText, classes.name)}>
                {props?.name}
            </Typography>

            <Typography variant="body1" className={clsx(classes.infoText, classes.source)}>
                {
                    props?.source
                        ? `via ${props.source}`
                        : ""
                }
            </Typography>
        </div>
    )
}

export default AuthorInfo
