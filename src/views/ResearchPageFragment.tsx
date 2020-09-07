import React from 'react'
import { DesktopNavigation, UrprNavigation } from '../components/navigation/desktopNavigation'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text } from "@fluentui/react";
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge } from '../configs/dimens';
import { NAVIGATION_LAYOUT } from '../components/navigation/_layout';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { IPageManifest } from '../interfaces/IPageManifest';
import { fetchJsonWithProgress, fetchTextWithProgress } from '../utils/fetchs/fetchWithProgress';
import { Markdown } from '../components/markdown/Markdown';
import { UrprAbbr } from '../configs/strings';
import { theme } from '../configs/theme';
import { formatTime } from '../utils/FormatDate';
import { RoomForFootnot } from '../components/footnote/RoomForFootnote';

const navigatePlaceHolderStyle: React.CSSProperties = {
    width: "100%",
    height: NAVIGATION_LAYOUT.height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}

export interface IResearchPageFragmentProps {
}

export interface IResearchPageFragmentStates {
    markdownString?: string,
    pageManifest: IPageManifest
}

export interface IAutoAlignedTitleDivProps {
    text: string
}

export interface IAutoAlignedMetaDivProps {
    author?: string,
    publishedTimestamp?: number
}

export const AutoAlignedTitleDiv: React.FC<IAutoAlignedTitleDivProps> = (props) => {
    const { width } = useViewport()
    return <div style={width > breakpointMedium ?
        { margin: '72px 0 24px 0', width: "80%" }
        :
        { margin: '72px 0 24px 0' }
    }>
        <Text variant={width <= breakpointMedium ? "xxLargePlus" : "superLarge"} >{props.text}</Text>
    </div>
}

export const AutoAlignedMetaDiv: React.FC<IAutoAlignedMetaDivProps> = (props) => {
    const { width } = useViewport()
    return <div style={width > breakpointMedium ?
        { padding: '4px 0 12px 0'}
        :
        { padding: '4px 0 12px 0' }
    }>
        {props.publishedTimestamp != undefined &&
            <Text variant="medium" style={{ color: theme.palette.neutralTertiary }}>
                {formatTime(props.publishedTimestamp)}
            </Text> }
        {(props.author != undefined && props.publishedTimestamp != undefined) &&
            <Text variant="medium" style={{ color: theme.palette.neutralQuaternary }}>&nbsp;·&nbsp;</Text>}
        <Text variant="medium" style={{ color: theme.palette.themePrimary }}>
            {props.author}
        </Text>
    </div>
}

export class ResearchPageFragment extends React.Component<IResearchPageFragmentProps, IResearchPageFragmentStates>{
    private pagepath = window.location.pathname.split('/')[2];
    constructor(props: IResearchPageFragmentProps) {
        super(props)

        this.fetchPageContent();
        this.fetchPageManifest();
        this.state = {
            pageManifest: { fileName: this.pagepath, displayName: "" }
        }
    }

    private fetchPageManifest() {
        fetchJsonWithProgress("/pages.json")
            .then(
                (mani: IPageManifest[]) => {
                    //console.log(mani)
                    //console.log(mani.filter(t => t.fileName == this.pagepath)[0])
                    let _mani = mani.filter(t => t.fileName == this.pagepath)[0]
                    document.title = `${UrprAbbr} - ${_mani.displayName}`
                    this.setState({
                        pageManifest: _mani
                    })
                }
            )
    }
    private fetchPageContent() {
        fetchTextWithProgress(`/pages/${this.pagepath}.md`).then(
            str => {
                //console.log(str)
                this.setState({ markdownString: str })
            }
        )
    }
    render() {
        return <div>

            <div style={navigatePlaceHolderStyle}>
                <UrprNavigation alwaysColored blocked />
            </div>

            <ResponsiveDiv slimmed>
                <AutoAlignedTitleDiv text={this.state.pageManifest?.displayName} />
                <AutoAlignedMetaDiv author={this.state.pageManifest.author} publishedTimestamp={this.state.pageManifest.publishedTimestamp} />
                <div>
                    <Markdown unparsedContentString={this.state.markdownString} />
                </div>
            </ResponsiveDiv>

            <RoomForFootnot/>
        </div>
    }
}