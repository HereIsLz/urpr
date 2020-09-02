import React from "react";
import { NAVIGATION_LAYOUT } from "./_layout";
import { Stack, FontIcon, IconButton } from "@fluentui/react";
import { UrprLogo } from "../logo";
import { DesktopPivot } from "./desktopPivot";
import { useViewport } from "../../utils/hooks/useViewport";
import { breakpointMedium } from "../../configs/dimens";
import { ResponsiveDiv } from "../responsive/ResponisveDiv";
import { NavigateShimmer } from "../navigateShimmer";
import { useScrollTop } from "../../utils/hooks/useScrollTop";
import { theme } from "../../configs/theme";
import { UrprFull } from "../../configs/strings";

const pivotConfigs = [
    {
        name: "Research",
        route: "research"
    },
    {
        name: "Team",
        route: "team"
    },
    {
        name: "Updates",
        route: "update"
    },
    {
        name: "Open Data",
        route: "opendata"
    },
    {
        name: "Covid-19",
        route: "covid19"
    }
]
export interface IDesktopNavigationProps {
    alwaysColored?: boolean
}
export const DesktopNavigation: React.FunctionComponent<IDesktopNavigationProps> = (props) => {

    const { width } = useViewport();
    const { scrollTop } = useScrollTop();
    return (
        <header>
            <div style={{
                background: props.alwaysColored || (scrollTop > NAVIGATION_LAYOUT.height) ? theme.palette.neutralLighter : 'transparent',
                width: '100%',
                height: NAVIGATION_LAYOUT.height,
                position: 'fixed',
                zIndex: 80,
                transition: 'background .5s'
            }}>
                <ResponsiveDiv>
                    <Stack horizontal horizontalAlign="space-between" >
                        <div style={{ height: NAVIGATION_LAYOUT.height }}><UrprLogo /></div>
                        {width > breakpointMedium ? <DesktopPivot manifest={pivotConfigs} defaultSelectedPivotKey={window.location.pathname.split('/')[1]} />
                            : <IconButton iconProps={{ iconName: "GlobalNavButton" }} title={UrprFull} ariaLabel={UrprFull}
                                styles={{ root: { verticalAlign: 'center', height: NAVIGATION_LAYOUT.height, width: NAVIGATION_LAYOUT.height, marginRight:-24 }, icon: { fontSize: 24} }} />}
                    </Stack>

                    {/* <NavigateShimmer /> */}
                </ResponsiveDiv>
                <NavigateShimmer />
            </div>
        </header>
    );

};
