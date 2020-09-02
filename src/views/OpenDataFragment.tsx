import React from 'react'
import { DesktopNavigation } from '../components/navigation/desktopNavigation'
import { resolveStaticImages } from '../configs/resources'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text } from "@fluentui/react";
import { UrprFull, UrprDetail } from '../configs/strings';
import { theme } from '../configs/theme';
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge } from '../configs/dimens';
import { StretchableGrid } from '../components/stretchableGrid/StreachableGrid';
import { NAVIGATION_LAYOUT } from '../components/navigation/_layout';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { StretchablePersonaGrid } from '../components/stretchableGrid/StrechablePersonaGrid';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
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
            <DesktopNavigation alwaysColored />
        </div>

        <ResponsiveDiv>
            <div style={{ margin: '72px 0 8px 0' }}>
                <Text variant="superLarge" >Covid-19 State/Provincial Policy Tracker</Text>
            </div>
            <div>
                <Text variant="large">
                    <a href="research/Covid-19-State-Provincial-Policy-Tracker" style={{paddingBottom:2}}>
                        <FontIcon iconName="Download" style={{verticalAlign:'middle'}}/>
                        Download
                    </a>
                </Text>
            </div>
            <div style={{ margin: '72px 0 8px 0' }}>
                <Text variant="superLarge" >Mobile phone data-extracted daily activities of rural residents in Chengdu, China</Text>
            </div>
            <div>
                <Text variant="large" >
                    <a href="https://data.mendeley.com/datasets/w82ygwjy9c" target="_blank" style={{paddingBottom:2}}>
                        <FontIcon iconName="Download" style={{verticalAlign:'middle'}}/>
                        Download from Mendeley Data
                    </a>
                </Text>
            </div>
        </ResponsiveDiv>
    </div>
}