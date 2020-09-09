import React from 'react'
import { IOpendataItem } from '../../interfaces/IOpendata'
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress'
import { Text, FontIcon, Separator } from "@fluentui/react";
import { formatTime } from '../../utils/FormatDate';
import { theme } from '../../configs/theme';
import { useViewport } from '../../utils/hooks/useViewport';
import { render } from '@testing-library/react';
import { breakpointTiny } from '../../configs/dimens';
interface ILinkBlockProps {
    linksJsonUrl: string
}


interface ILinkBlockState {
    links: IOpendataItem[]
}

interface ILinkBlockSingleProps {
    itm: IOpendataItem
}

export const LinkBlock: React.FC<ILinkBlockSingleProps> = (props) => {

    const { width } = useViewport();
    return <div style={{ margin: '36px 0' }}>
        <Text block variant={width > breakpointTiny ? "superLarge" : "xxLarge"} style={{ width: width > breakpointTiny ? "80%" : "95%" }}>{props.itm.name}</Text>
        {
            props.itm.displayedDate != undefined &&
            <Text block variant="large" style={{ paddingTop: 12, color: theme.palette.neutralTertiary, textAlign: "justify", lineHeight: 1.5 }}>
                {formatTime(props.itm.displayedDate)}
            </Text>
        }
        <Text block variant="large" style={{ paddingTop: 12, textAlign: "justify", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
            {props.itm.description}
        </Text>
        <Text block variant="large" style={{ paddingTop: 12 }}>
            <a href={props.itm.linkUrl} style={{ paddingBottom: 2 }} target="_blank">
                {props.itm.linkText}
                <FontIcon iconName="Download" style={{ verticalAlign: 'middle', paddingLeft: 8 }} />
            </a>
        </Text>
    </div>

}


export class LinkBlocks extends React.Component<ILinkBlockProps, ILinkBlockState>{
    constructor(props: ILinkBlockProps) {
        super(props)
        this.state = {
            links: []
        }
        this.fetchLinks(this.props.linksJsonUrl)
    }
    private fetchLinks(url: string) {
        fetchJsonWithProgress(this.props.linksJsonUrl).then(e => {
            this.setState({ links: e })
        })
    }
    private renderLinks(links: IOpendataItem[]) {
        let renderedLinks: JSX.Element[] = []
        if (links.length == 0) return renderedLinks
        renderedLinks.push(<LinkBlock itm={links[0]} />)
        for (let i = 1; i < links.length; i++) {
            renderedLinks.push(<Separator />)
            renderedLinks.push(<LinkBlock itm={links[i]} />)
        }
        return renderedLinks
    }


    render() {
        return <div style={{ width: "100%" }}>
            {this.renderLinks(this.state.links)}
        </div>
    }
}