import React from 'react'
import { ConsoleNavigation } from '../components/navigation/ConsoleNavigation'
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
import { StretchableConsoleGrid } from '../components/stretchableGrid/StrechableConsoleGrid';

const navigatePlaceHolderStyle: React.CSSProperties = {
    width: "100%",
    height: NAVIGATION_LAYOUT.height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}


export const ConsoleFragment: React.FC = () => {
    const { width } = useViewport();
    return <div>

        <div style={navigatePlaceHolderStyle}>
            <ConsoleNavigation isLogged/>
        </div>

        <ResponsiveDiv>
            <div style={{ minHeight: "90vh", width: "100%", display: "table" }}>
                <div style={{ width: "100%", display: "table-cell", verticalAlign: "middle" }}>
                    <StretchableConsoleGrid manifestUrl="/console.json" />
                </div>
            </div>
        </ResponsiveDiv>

    </div>
}