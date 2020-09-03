import React from "react"
import { theme } from "../../configs/theme"
import { FOOTNOTE_LAYOUT } from "./_layout"

const roomStyle: React.CSSProperties = {
    width: '100%',
    paddingTop: FOOTNOTE_LAYOUT.topPadding * 2,
    height: FOOTNOTE_LAYOUT.height,
}

export const RoomForFootnot: React.FC = () => {
    return <div style={roomStyle}>
    </div>
}