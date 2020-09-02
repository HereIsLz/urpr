import React from "react"
import { Stack, Text } from "@fluentui/react"
import { useViewport } from "../../utils/hooks/useViewport";
import { breakpointLarge } from "../../configs/dimens";
import { RESPONSIVE_LAYOUT } from "./_layout";

export interface IResponsiveDivProps {
    children?: JSX.Element | JSX.Element[],
    centered?: boolean
}


export const ResponsiveDiv: React.FunctionComponent<IResponsiveDivProps> = (props: IResponsiveDivProps) => {
    const { width } = useViewport();
    return width > breakpointLarge ?
        <div style={{
            textAlign: props.centered ? "center" : "inherit",
            width: width > breakpointLarge + RESPONSIVE_LAYOUT.collapsedMargin * 2 ?
                RESPONSIVE_LAYOUT.pageWidth : width - RESPONSIVE_LAYOUT.collapsedMargin * 2,
            marginLeft: width > breakpointLarge ?
                `calc(50% - ${RESPONSIVE_LAYOUT.pageWidth / 2}px` : RESPONSIVE_LAYOUT.collapsedMargin

        }} className="static-card-expanded">
            {props.children}
        </div> :
        <div style={{ textAlign: props.centered ? "center" : "inherit", margin: `0 ${RESPONSIVE_LAYOUT.collapsedMargin}px` }}>
            {props.children}
        </div>
}