import React from "react"
import { Stack, Text } from "@fluentui/react"
import { useViewport } from "../../utils/hooks/useViewport";
import { breakpointLarge } from "../../configs/dimens";
import { RESPONSIVE_LAYOUT } from "./_layout";

export interface IResponsiveDivProps {
    children?: JSX.Element | JSX.Element[],
    centered?: boolean
    disableOverflowX?: boolean,
    slimmed?: boolean
}


export const ResponsiveDiv: React.FunctionComponent<IResponsiveDivProps> = (props: IResponsiveDivProps) => {
    const { width } = useViewport();
    const desiredPageWidth = props.slimmed ? RESPONSIVE_LAYOUT.pageWidthSlimmed : RESPONSIVE_LAYOUT.pageWidth
    return width > desiredPageWidth + RESPONSIVE_LAYOUT.collapsedMargin * 2 ?
        <div className="static-card-expanded"
            style={{
                overflowX: props.disableOverflowX ? "hidden" : "inherit",
                textAlign: props.centered ? "center" : "inherit",
                width: desiredPageWidth,
                marginLeft: `calc(50% - ${desiredPageWidth / 2}px`
            }}>
            {props.children}
        </div>
        :
        <div style={{
            overflowX: props.disableOverflowX ? "hidden" : "inherit",
            textAlign: props.centered ? "center" : "inherit",
            margin: `0 ${RESPONSIVE_LAYOUT.collapsedMargin}px`
        }}>
            {props.children}
        </div>
}