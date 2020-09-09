import React, { Component } from 'react'
import { DesktopNavigation, UrprNavigation } from '../components/navigation/desktopNavigation'
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
import { fetchJsonWithProgress } from '../utils/fetchs/fetchWithProgress';

const backgroundImageStyles: React.CSSProperties = {
    width: "100%",
    height: "80vh",
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
    backgroundColor: theme.palette.neutralLight
}


export interface IIndexFragmentStaticProps {
    heroText: string,
    heroText2: string,
    description: string,
    bgImageName?: string,
    color?: string
}

export const IndexFragmentStatic: React.FC<IIndexFragmentStaticProps> = (props) => {
    const { width } = useViewport();
    return <div>
        <UrprNavigation alwaysColored blocked />
        <div style={backgroundImageStyles}>
            <div style={{ height: 0, width: "100%", backgroundColor: theme.palette.neutralPrimary }}>
                <Image src={props.bgImageName ? resolveStaticImages(props.bgImageName) : undefined} style={backgroundImageStyles} />
            </div>

            <div style={{ display: "table", height: "100%", width: "100%", position: "relative" }}>
                <div style={{ display: "table-cell", verticalAlign: "middle", paddingBottom: 80 }}>
                    <ResponsiveDiv>
                        <div style={{ width: width > breakpointMedium ? "64%" : "90%", paddingLeft: width > breakpointMedium ? 60 : 0 }}>
                            <Text block variant={width > breakpointTiny ? "superLarge" : "xxLargePlus"}
                                style={{
                                    color: props.color ? props.color : theme.palette.neutralDark, lineHeight: 1.2,
                                }}>
                                {props.heroText}
                            </Text>
                            <Text block variant={width > breakpointTiny ? "superLarge" : "xxLargePlus"}
                                style={{
                                    color: props.color ? props.color : theme.palette.neutralDark, lineHeight: 1.2
                                }}>
                                {props.heroText2}
                            </Text>
                        </div>
                        <div style={{
                            width: width > breakpointMedium ? "64%" : "100%",
                            lineHeight: width > breakpointTiny ? 1.8 : 1.5,
                            marginTop: 12,
                            paddingLeft: width > breakpointMedium ? 60 : 0
                        }}>
                            <Text variant={width > breakpointTiny ? "xLarge" : "large"} styles={{ root: { fontWeight: 400, whiteSpace: "pre-wrap", color: props.color ? props.color : theme.palette.neutralDark } }}>
                                {props.description}
                            </Text>
                        </div>
                    </ResponsiveDiv>
                </div>
            </div>
        </div>


        <ResponsiveDiv centered>
            <div style={{ margin: '72px 0' }}>
                <Text variant={width > breakpointTiny ? "superLarge" : "xxLargePlus"} style={{
                    lineHeight: 2, textAlign: 'center', //fontFamily:"Product Sans"
                }}>OUR RESEARCH</Text>
            </div>

        </ResponsiveDiv>

        <StretchableGrid manifestUrl="pages.json" />
        <RoomForFootnot />
    </div>
}
interface IIndexFragmentStates {
    bannerConfig: IIndexFragmentStaticProps
}

export class IndexFragment extends React.Component<{}, IIndexFragmentStates>{
    constructor() {
        super({})
        this.state = {
            bannerConfig: {
                heroText: UrprFull.toUpperCase(),
                heroText2: UrprZh,
                description: UrprDetail
            }
        }
        fetchJsonWithProgress("/banner.json").then(st => this.setState({ bannerConfig: st }))
    }

    render() { return <IndexFragmentStatic {...this.state.bannerConfig} /> }
}