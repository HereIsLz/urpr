import React from 'react'
import { DesktopNavigation } from '../components/navigation/desktopNavigation'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text } from "@fluentui/react";
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge } from '../configs/dimens';
import { NAVIGATION_LAYOUT } from '../components/navigation/_layout';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { IPageManifest } from '../configs/defs';
import { fetchJsonWithProgress, fetchTextWithProgress } from '../utils/fetchs/fetchWithProgress';
import { Markdown } from '../components/markdown/Markdown';
import { UrprAbbr } from '../configs/strings';

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
        fetchJsonWithProgress("/pages/manifest.json")
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
                <DesktopNavigation alwaysColored />
            </div>

            <ResponsiveDiv>
                <div style={{ margin: '72px 0 8px 0' }}>
                    <Text variant="superLarge" >{this.state.pageManifest?.displayName}</Text>
                </div>
                <div>
                    <Markdown unparsedContentString={this.state.markdownString} />
                </div>
            </ResponsiveDiv>
        </div>
    }
}