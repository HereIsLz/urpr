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
import { MobilePivot } from "./MobilePivot";

export interface IPivotConfig {
    name: string,
    route: string
}
export const pivotConfigs: IPivotConfig[] = [
    {
        name: "Research",
        route: "/research"
    },
    {
        name: "Team",
        route: "/team"
    },
    {
        name: "Updates",
        route: "/update"
    },
    {
        name: "Open Data",
        route: "/opendata"
    },
    {
        name: "Covid-19",
        route: "/research/Covid-19-Policy-Tracker"
    }
]
export interface IDesktopNavigationProps {
    alwaysColored?: boolean
}
export const DesktopNavigation: React.FunctionComponent<IDesktopNavigationProps> = (props) => {

    const { width } = useViewport();
    const { scrollTop } = useScrollTop();
    const [isOpen, setIsOpen] = React.useState(false)
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
                        {width > breakpointMedium ? <DesktopPivot manifest={pivotConfigs} defaultSelectedPivotKey={"/" + window.location.pathname.split('/')[1]} />
                            :
                            <IconButton
                                iconProps={{ iconName: isOpen ? "Clear" : "GlobalNavButton" }}
                                title={UrprFull} ariaLabel={UrprFull}
                                styles={{
                                    root: { verticalAlign: 'center', height: NAVIGATION_LAYOUT.height, width: NAVIGATION_LAYOUT.height, marginRight: -24 },
                                    icon: { fontSize: 24 }
                                }}
                                onClick={() => setIsOpen(!isOpen)}
                            />
                        }
                    </Stack>

                    {/* <NavigateShimmer /> */}
                </ResponsiveDiv>
                <NavigateShimmer />
            </div>
            <MobilePivot navLinkGroups={pivotConfigs} revealed={!isOpen} />
        </header>
    );

};
