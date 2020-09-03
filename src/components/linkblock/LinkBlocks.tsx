import React from 'react'
import { IOpendataItem } from '../../interfaces/IOpendata'
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress'
import { Text, FontIcon, Separator } from "@fluentui/react";
interface ILinkBlockProps {
    linksJsonUrl: string
}


interface ILinkBlockState {
    links: IOpendataItem[]
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
    private renderLink(link: IOpendataItem) {
        return <div style={{ margin: '36px 0' }}>
            <Text block variant="superLarge" >{link.name}</Text>
            <Text block variant="large" style={{ paddingTop: 12 }}>
                {link.description}
            </Text>
            <Text block variant="large" style={{ paddingTop: 12 }}>
                <a href={link.linkUrl} style={{ paddingBottom: 2 }}>
                    {link.linkText}
                    <FontIcon iconName="Download" style={{ verticalAlign: 'middle',paddingLeft:8 }} />
                </a>
            </Text>
        </div>
    }
    private renderLinks(links: IOpendataItem[]) {
        let renderedLinks: JSX.Element[] = []
        if (links.length == 0) return renderedLinks
        renderedLinks.push(this.renderLink(links[0]))
        for (let i = 1; i < links.length; i++) {
            renderedLinks.push(<Separator />)
            renderedLinks.push(this.renderLink(links[i]))
        }
        return renderedLinks
    }


    render() {
        console.log(this.state)
        return <div style={{width:"100%"}}>
            {this.renderLinks(this.state.links)}
        </div>
    }
}