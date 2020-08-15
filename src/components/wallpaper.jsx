import React, { useState, useEffect } from "react"

import { view } from "@risingstack/react-easy-state"
import DefaultStore from "../state/store"

import { makeStyles, Fade } from "@material-ui/core"
import AttributionContainer from "./attribution/root"

const useStyles = makeStyles(theme => ({
    root: {
        backgroundImage: ({ backgroundUrl }) => `url(${backgroundUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: theme.palette.background.paper,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end"
    }
}))

const InternalWallpaperDiv = ({ imageUrl, children }) => {
    const classes = useStyles({ backgroundUrl: imageUrl })
    const [showBackground, setShowBackground] = useState(false)

    useEffect(() => {
        if (!imageUrl || showBackground) return

        const image = new Image()
        image.loading = "eager"
        image.onload = () => setShowBackground(true)
        image.src = imageUrl
    }, [imageUrl, showBackground])

    return (
        <Fade in={showBackground}>
            <div className={classes.root}>
                {children}
            </div>
        </Fade>
    )
}

const Wallpaper = () => {
    const [wallpaperData, setWallpaperData] = useState([])

    useEffect(() => {
        DefaultStore.actions.fetchWallpaper()
            .then(data => setWallpaperData(data))
    }, [])

    return (
        <InternalWallpaperDiv imageUrl={wallpaperData?.imageUrl}>
            <AttributionContainer
                name={wallpaperData?.userName}
                source="Unsplash"
                url={wallpaperData?.imagePage}
                authorImage={wallpaperData?.userImageUrl}
            />
        </InternalWallpaperDiv>
    )
}

export default view(Wallpaper)
