import React from "react"
import { theme } from "../../configs/theme"
import { FOOTNOTE_LAYOUT } from "./_layout"
import { ResponsiveDiv } from "../responsive/ResponisveDiv"
import { Text } from '@fluentui/react'
import { UrprAbbr } from "../../configs/strings"

const footnoteContainerStyle: React.CSSProperties = {
    width: '100%',
    height: FOOTNOTE_LAYOUT.height,
    position: 'absolute',
    bottom: 0,
    borderTop: `1px solid ${theme.palette.neutralLight}`,
    background: theme.palette.neutralLighterAlt
}

export const Footnote: React.FC = () => {
    return <div style={footnoteContainerStyle}>
        <ResponsiveDiv>
            <Text variant="medium" styles={{ root: { lineHeight: FOOTNOTE_LAYOUT.height, color: theme.palette.neutralTertiary } }}>
                Copyright © {UrprAbbr}. All rights reserved.</Text>
        </ResponsiveDiv>
    </div >
}