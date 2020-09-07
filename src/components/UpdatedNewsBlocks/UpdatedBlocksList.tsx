import React from "react"
import { IUpdatedNews } from "../../interfaces/IUpdatedNews"
import { Stack, Text, Image, Separator } from "@fluentui/react"
import { formatTime } from "../../utils/FormatDate"
import { theme } from "../../configs/theme"
import { fetchJsonWithProgress } from "../../utils/fetchs/fetchWithProgress"
import { UpdatedBlock } from "./updatedBlock"

interface IUpdatedBlockListProps {
    manifestUrl: string
}

interface IUpdatedBlockListStates {
    blocks: IUpdatedNews[]
}

export class UpdatedBlockList extends React.Component<IUpdatedBlockListProps, IUpdatedBlockListStates>{

    constructor(props: IUpdatedBlockListProps) {
        super(props)
        this.state = { blocks: [] }
        this.fetchUpdatedItems()
    }

    private fetchUpdatedItems() {
        fetchJsonWithProgress(this.props.manifestUrl).then(
            itms => { 
                console.log(itms)
                this.setState({ blocks: itms }) 
            }
        )
    }

    private renderblocks(blocks: IUpdatedNews[]) {
        let renderedBlocks: JSX.Element[] = []
        if (blocks.length == 0) return renderedBlocks
        renderedBlocks.push(<UpdatedBlock updatedNewsItem={blocks[0]} />)
        for (let i = 1; i < blocks.length; i++) {
            renderedBlocks.push(<Separator />)
            renderedBlocks.push(<UpdatedBlock updatedNewsItem={blocks[i]} />)
        }
        return renderedBlocks
    }

    render() {
        return <div style={{ width: "100%" }}>
            {this.renderblocks(this.state.blocks)}
        </div>
    }
}