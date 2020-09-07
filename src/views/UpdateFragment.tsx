import React from "react";
import { NAVIGATION_LAYOUT } from "../components/navigation/_layout";
import { UrprNavigation } from "../components/navigation/desktopNavigation";
import { ResponsiveDiv } from "../components/responsive/ResponisveDiv";
import { UpdatedBlockList } from "../components/UpdatedNewsBlocks/UpdatedBlocksList";
import { RoomForFootnot } from "../components/footnote/RoomForFootnote";
const navigatePlaceHolderStyle: React.CSSProperties = {
    width: "100%",
    height: NAVIGATION_LAYOUT.height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',

}

export const UpdateFragment: React.FC = () => {
    return <div>
        <div style={navigatePlaceHolderStyle}>
            <UrprNavigation alwaysColored blocked />
        </div>
        <div style={{ width: "100%", height: 24 }} />
        <ResponsiveDiv slimmed>
            <UpdatedBlockList manifestUrl="/updates.json" />
        </ResponsiveDiv>
        <RoomForFootnot />
    </div>
}