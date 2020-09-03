import React from 'react'
import { DesktopNavigation } from '../components/navigation/desktopNavigation'
import { resolveStaticImages } from '../configs/resources'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text, TextField, Button, PrimaryButton, Separator, MaskedTextField } from "@fluentui/react";
import { UrprFull, UrprDetail } from '../configs/strings';
import { theme } from '../configs/theme';
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge } from '../configs/dimens';
import { StretchableGrid } from '../components/stretchableGrid/StreachableGrid';
import { NAVIGATION_LAYOUT } from '../components/navigation/_layout';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { StretchablePersonaGrid } from '../components/stretchableGrid/StrechablePersonaGrid';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { RoomForFootnot } from '../components/footnote/RoomForFootnote';
import { ConsoleNavigation } from '../components/navigation/ConsoleNavigation';

const navigatePlaceHolderStyle: React.CSSProperties = {
    width: "100%",
    height: NAVIGATION_LAYOUT.height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}


export const ConsoleLoginFragment: React.FC = () => {
    const { width } = useViewport();
    return <div>

        <div style={navigatePlaceHolderStyle}>
            <ConsoleNavigation isLogged />
        </div>

        <ResponsiveDiv>
            <div style={{ minHeight: "60vh", width: "100%", display: "table" }}>
                <div style={{ width: "100%", display: "table-cell", verticalAlign: "middle" }}>
                    <div style={{ maxWidth: 420 }}>
                        <Text variant="superLarge" style={{ lineHeight: "120px" }}>Log In</Text>

                        <TextField label={"Username"} />
                        <MaskedTextField label={"Password"} maskChar="/[a-zA-Z0-9]/" />
                        <Separator />
                        <PrimaryButton text="Log In" styles={{ root: { width: "100%" }, }} />
                    </div>
                </div>
            </div>
        </ResponsiveDiv>

        <RoomForFootnot />
    </div>
}