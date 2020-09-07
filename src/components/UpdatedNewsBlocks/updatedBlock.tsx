import React from "react"
import { IUpdatedNews } from "../../interfaces/IUpdatedNews"
import { Stack, Text, Image, ImageFit } from "@fluentui/react"
import { formatTime } from "../../utils/FormatDate"
import { theme } from "../../configs/theme"

interface IUpdatedBlockProps {
    updatedNewsItem: IUpdatedNews
}

export const UpdatedBlock: React.FC<IUpdatedBlockProps> = (props) => {
    return <div style={{ margin: '36px 0' }}>
        <Text block variant="superLarge" style={{ width: "80%" }}>{props.updatedNewsItem.title}</Text>
        {
            props.updatedNewsItem.updatedTimestamp != undefined &&
            <Text block variant="medium" style={{ paddingTop: 8, color: theme.palette.neutralTertiary, textAlign: "justify", lineHeight: 1.5 }}>
                {formatTime(props.updatedNewsItem.updatedTimestamp)}
            </Text>
        }
        <Text block variant="large" style={{ paddingTop: 8, textAlign: "justify", lineHeight: 1.5 }}>
            {props.updatedNewsItem.description}
        </Text>
        {
            props.updatedNewsItem.imageUrl != undefined &&
            <Image imageFit={ImageFit.cover} src={props.updatedNewsItem.imageUrl} styles={{ root: { width: "100%", minHeight: "32vh", maxHeight: "50vh", marginTop: 12 } }} />
        }
    </div>
}