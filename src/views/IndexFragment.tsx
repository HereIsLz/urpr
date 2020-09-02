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
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';

const backgroundImageStyles: React.CSSProperties = {
    width: "100%",
    height: "680px",
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none'
}

export const IndexFragment: React.FC = () => {
    const { width } = useViewport();
    return <div>

        <div style={backgroundImageStyles}>
            <DesktopNavigation alwaysColored/>
            <div style={{ height: 0, width: "100%" }}><img src={resolveStaticImages("bg-origin.jpg")} style={backgroundImageStyles} /></div>
            <div style={{ marginTop: "calc(140px)" }}>
                <ResponsiveDiv>
                    <div style={{ width: width > breakpointMedium ? "100%" : "90%" }}>
                        <Text variant={width > breakpointLarge ? "mega" : "superLarge"}
                            style={{
                                color: theme.palette.themePrimary, lineHeight: width > breakpointMedium ? 2 : 1.5
                            }}>
                            {UrprFull}
                        </Text>
                    </div>
                    <div style={{ width: width > breakpointMedium ? "80%" : "100%", lineHeight: width > breakpointMedium ? 1.8 : 1.6, marginTop: 12 }}>
                        <Text variant="large">{UrprDetail}</Text>
                    </div>
                </ResponsiveDiv>
            </div>
        </div>


        <ResponsiveDiv centered>
            <div style={{ margin: '72px 0' }}>
                <Text variant="superLarge" style={{
                    lineHeight: 2, textAlign: 'center'
                }}>Our Research</Text>
            </div>

        </ResponsiveDiv>

        <StretchableGrid manifestUrl="pages/manifest.json" />
    </div>
}