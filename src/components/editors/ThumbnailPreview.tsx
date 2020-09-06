import React from "react"
import { IPageManifest } from "../../interfaces/IPageManifest";
import { Image } from "@fluentui/react";
import { theme } from "../../configs/theme";
import { PageThumbnailTitleBgStyle, PageThumbnailTitleStyle } from "../stretchableGrid/StreachableGrid";

interface IThumbnailPreviewProps {
    manifest: IPageManifest
}
const ThumbnailPreviewDisabled: React.CSSProperties = {
    //background: theme.palette.themeLight,
    width: '100%',
    height: "100%",
    position: "relative",
    overflow: "hidden",
    background: theme.palette.neutralLight
}
export const ThumbnailPreview: React.FC<IThumbnailPreviewProps> = (props) => {
    return <div style={ThumbnailPreviewDisabled}>
        {props.manifest.thumbnail ? <Image shouldFadeIn src={props.manifest.thumbnail}
            styles={{
                root: { width: '100%', height: "100%", position: "absolute" },
                image: { width: '100%', height: "100%" }
            }} /> : null}

        <div style={PageThumbnailTitleBgStyle} className="hover-card">
            <div style={PageThumbnailTitleStyle}>
                {props.manifest.displayName}
            </div>
        </div>
    </div>
}