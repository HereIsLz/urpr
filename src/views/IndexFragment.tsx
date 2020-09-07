import React, { Component } from 'react'
import { DesktopNavigation } from '../components/navigation/desktopNavigation'
import { resolveStaticImages } from '../configs/resources'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text, Image, ImageCoverStyle, ImageFit } from "@fluentui/react";
import { UrprFull, UrprDetail, UrprZh } from '../configs/strings';
import { theme } from '../configs/theme';
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge, breakpointTiny } from '../configs/dimens';
import { StretchableGrid } from '../components/stretchableGrid/StreachableGrid';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { Footnote } from '../components/footnote/Footnote';
import { RoomForFootnot } from '../components/footnote/RoomForFootnote';

const backgroundImageStyles: React.CSSProperties = {
    width: "100%",
    height: "80vh",
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    backgroundColor: theme.palette.neutralLight
}

export const IndexFragment: React.FC = () => {
    const { width } = useViewport();
    return <div>

        <DesktopNavigation alwaysColored blocked />
        <div style={backgroundImageStyles}>
            <div style={{ height: 0, width: "100%", backgroundColor: theme.palette.neutralPrimary }}>
                <Image src={resolveStaticImages("bg.jpg")} style={backgroundImageStyles} />
            </div>

            <div style={{ display: "table", height: "100%", width: "100%", position: "relative" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle", paddingBottom: 80 }}>
                    <ResponsiveDiv>
                        <div style={{ width: width > breakpointTiny ? "64%" : "90%", paddingLeft: width > breakpointTiny ? 60 : 0 }}>
                            <Text block variant={width > breakpointLarge ? "superLarge" : "xxLargePlus"}
                                style={{
                                    color: theme.palette.neutralDark, lineHeight: 1.2,
                                    //fontFamily: "Product Sans"
                                }}>
                                {UrprFull.toUpperCase()}
                            </Text>
                            <Text block variant={width > breakpointLarge ? "superLarge" : "xxLargePlus"}
                                style={{
                                    color: theme.palette.neutralDark, lineHeight: 1.2
                                }}>
                                {UrprZh}
                            </Text>
                        </div>
                        <div style={{
                            width: width > breakpointTiny ? "64%" : "100%",
                            lineHeight: width > breakpointTiny ? 1.8 : 1.5,
                            marginTop: 12,
                            paddingLeft: width > breakpointTiny ? 60 : 0
                        }}>
                            <Text variant={width > breakpointLarge ? "xLarge" : "large"} style={{ fontWeight: 400 }}>{UrprDetail}</Text>
                        </div>
                    </ResponsiveDiv>
                </div>
            </div>
        </div>


        <ResponsiveDiv centered>
            <div style={{ margin: '72px 0' }}>
                <Text variant="superLarge" style={{
                    lineHeight: 2, textAlign: 'center', //fontFamily:"Product Sans"
                }}>Our Research</Text>
            </div>

        </ResponsiveDiv>

        <StretchableGrid manifestUrl="pages.json" />
        <RoomForFootnot />
    </div>
}