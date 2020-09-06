import React from 'react'
import { DesktopNavigation } from '../components/navigation/desktopNavigation'
import { resolveStaticImages } from '../configs/resources'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text, Separator } from "@fluentui/react";
import { UrprFull, UrprDetail } from '../configs/strings';
import { theme } from '../configs/theme';
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge } from '../configs/dimens';
import { StretchableGrid } from '../components/stretchableGrid/StreachableGrid';
import { NAVIGATION_LAYOUT } from '../components/navigation/_layout';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { StretchablePersonaGrid } from '../components/stretchableGrid/StrechablePersonaGrid';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { LinkBlocks } from '../components/linkblock/LinkBlocks';
import { RoomForFootnot } from '../components/footnote/RoomForFootnote';
const navigatePlaceHolderStyle: React.CSSProperties = {
    width: "100%",
    height: NAVIGATION_LAYOUT.height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',

}


export const OpenDataFragment: React.FC = () => {
    const { width } = useViewport();
    return <div>

        <div style={navigatePlaceHolderStyle}>
            <DesktopNavigation alwaysColored blocked />
        </div>
        <div style={{ width: "100%", height: 24 }} />
        <ResponsiveDiv slimmed>
            <LinkBlocks linksJsonUrl="/opendata.json" />
        </ResponsiveDiv>
        <RoomForFootnot />
    </div>
}