import React from "react"

import Config from "../../config.json"
import { isFirefox, isEdge } from "react-device-detect"

import IconButton from "@material-ui/core/IconButton"
import ExtensionIcon from "@material-ui/icons/Extension"
import { Tooltip } from "@material-ui/core"

const WebstoreButton = () => {
    const platform = isFirefox ? "firefox" : isEdge ? "edge" : "chrome"

    return (
        <Tooltip title={Config.webstore[platform].name} placement="left">
            <IconButton href={Config.webstore[platform].url} rel="noopener noreferrer">
                <ExtensionIcon />
            </IconButton>
        </Tooltip>
    )
}

export default WebstoreButton
