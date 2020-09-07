import React from "react"
import { IDesktopNavigationProps } from "./desktopNavigation";
import { Nav, INavLink, INavStyles, INavLinkGroup } from 'office-ui-fabric-react/lib/Nav';
import { IPivotConfig } from "./desktopNavigation";
import { theme } from "../../configs/theme";
import { NAVIGATION_LAYOUT } from "./_layout";
import { mergeStyles } from "@fluentui/react";
import { UrprAbbr } from "../../configs/strings";
import { useViewport } from "../../utils/hooks/useViewport";
interface IMobilePivotStates {
    defaultSelectedKey?: string,
    //revealed?: boolean
}
interface IMobilePivotProps {
    navLinkGroups: IPivotConfig[],
    revealed?: boolean
}
const containerMergedStyle = mergeStyles({
    width: "100%",
    background: theme.palette.neutralLighterAlt,
    position: "fixed",
    opacity: 0,
    top: NAVIGATION_LAYOUT.height,
    zIndex: 50,
    transition: "opacity .3s",
    display: "none"
})
const containerRevealedStyle: React.CSSProperties = {
    opacity: 1,
    display: "inherit"
}
const navStyles: Partial<INavStyles> = {
    root: {
        width: "100%",
        boxSizing: 'border-box',
        border: '1px solid #eee',
        paddingTop: 24,
        overflowY: 'auto',
        display: "inherit"
    },
};
const genNavLinkGroups = (pvt: IPivotConfig[]): INavLinkGroup[] => [
    {
        links: pvt.map(
            function (e: IPivotConfig) {
                return {
                    name: e.name,
                    url: e.route,
                    key: e.route
                }
            }
        ),
    },
];

export class MobilePivot extends React.Component<IMobilePivotProps, IMobilePivotStates>{
    constructor(props: IMobilePivotProps) {
        super(props)
        this.state = {
            defaultSelectedKey: "/" + window.location.pathname.split('/')[1], 
        }
    }
    render() {
        return <div
            style={this.props.revealed? containerRevealedStyle : undefined}
            className={containerMergedStyle}>
            <Nav selectedKey={this.state.defaultSelectedKey}
                ariaLabel={UrprAbbr}
                styles={navStyles}
                groups={genNavLinkGroups(this.props.navLinkGroups)}
            />
        </div>
    }
}