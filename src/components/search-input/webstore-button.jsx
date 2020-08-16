import React, { useEffect, useState } from "react"

import { view } from "@risingstack/react-easy-state"
import DefaultStore from "../../state/store"

import Config from "../../config.json"
import { isFirefox, isEdge, isOpera } from "react-device-detect"

import IconButton from "@material-ui/core/IconButton"
import ExtensionIcon from "@material-ui/icons/Extension"
import { Tooltip, Fade } from "@material-ui/core"

const WebstoreButton = () => {
    const platform = isFirefox ? "firefox" : isEdge ? "edge" : isOpera ? "opera" : "chrome"
    const webstoreIcon = DefaultStore.persist.webstoreIcon

    const [showIcon, setShowIcon] = useState(webstoreIcon)

    useEffect(() => {
        if (!DefaultStore.persist.webstoreIcon) {
            DefaultStore.actions.fetchFavicon(Config.webstore[platform].url)
                .then(icon => DefaultStore.persist.webstoreIcon = icon)
                .catch(console.error)
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Tooltip title={Config.webstore[platform].name} placement="left">
            <IconButton href={Config.webstore[platform].url} rel="noopener noreferrer">
                <Fade in={showIcon} unmountOnExit mountOnEnter>
                    <img src={webstoreIcon} width={24} height={24} alt={Config.webstore[platform].name} />
                </Fade>

                <Fade
                    in={!webstoreIcon}
                    unmountOnExit
                    mountOnEnter
                    onExited={() => setShowIcon(true)}
                >
                    <ExtensionIcon />
                </Fade>
            </IconButton>
        </Tooltip>
    )
}

export default view(WebstoreButton)
