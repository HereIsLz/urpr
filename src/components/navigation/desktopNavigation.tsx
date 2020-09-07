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
import { UrprConsoleLogo } from "../ConsoleLogo";
import { RESPONSIVE_LAYOUT } from "../responsive/_layout";
import { fetchJsonWithProgress } from "../../utils/fetchs/fetchWithProgress";

export interface IPivotConfig {
    name: string,
    route: string
}
export const defaultPivotConfigs: IPivotConfig[] = [
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
        route: "/update",

    },
    {
        name: "Open Data",
        route: "/opendata"
    }
]


export interface IDesktopNavigationProps {
    alwaysColored?: boolean
    blocked?: boolean,
    pivotConfigs: IPivotConfig[]
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
                transition: 'background .5s',
                borderBottom: `1px solid ${theme.palette.neutralLight}`
            }}>
                <ResponsiveDiv>
                    <Stack horizontal horizontalAlign="space-between" >
                        <div style={{ height: NAVIGATION_LAYOUT.height }}>
                            <UrprLogo />
                        </div>
                        {width > breakpointMedium ? <DesktopPivot manifest={props.pivotConfigs} defaultSelectedPivotKey={"/" + window.location.pathname.split('/')[1]} />
                            :
                            <IconButton
                                iconProps={{ iconName: isOpen ? "Clear" : "GlobalNavButton" }}
                                title={UrprFull} ariaLabel={UrprFull}
                                styles={{
                                    root: { verticalAlign: 'center', height: NAVIGATION_LAYOUT.height, width: NAVIGATION_LAYOUT.height, marginRight: (24 - NAVIGATION_LAYOUT.height) / 2 },
                                    icon: { fontSize: 24 }
                                }}
                                onClick={() => {
                                    setIsOpen(!isOpen)
                                }}
                            />
                        }
                    </Stack>
                </ResponsiveDiv>
                <NavigateShimmer />
            </div>
            {props.blocked && <div style={{
                background: theme.palette.neutralLighter,
                width: '100%',
                height: NAVIGATION_LAYOUT.height,
            }} />}
            <MobilePivot navLinkGroups={props.pivotConfigs} revealed={isOpen && (width <= breakpointMedium)} />
        </header>
    );

};
export interface IUrprNavigationProps {
    alwaysColored?: boolean
    blocked?: boolean,
}
export interface IUrprNavigationStates {
    pivotConfigs: IPivotConfig[]
}
export class UrprNavigation extends React.Component<IUrprNavigationProps, IUrprNavigationStates>{
    constructor(props: IUrprNavigationProps) {
        super(props)
        this.state = { pivotConfigs: [] }
        this.updatePivotConfigs()
    }

    private updatePivotConfigs() {
        fetchJsonWithProgress("/pivot.json").then(itm => this.setState({ pivotConfigs: itm }))
    }

    render() {
        return <DesktopNavigation alwaysColored={this.props.alwaysColored} blocked={this.props.blocked} pivotConfigs={this.state.pivotConfigs} />
    }
}
