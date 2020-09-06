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
import { Pivot, PivotItem } from "@fluentui/react";
import { UrprAbbr, UrprZh } from "../../configs/strings";
import { IManifestItem } from "../../interfaces/IManifestItem";

export interface IConsolePivotConfig {
    name: string,
    key: string
}

const consolePivotConfigs: IConsolePivotConfig[] = [
    {
        name: "Research Pages",
        key: "research"
    },
    {
        name: "Team Members",
        key: "team"
    },
    {
        name: "Open Data",
        key: "opendata"
    }
]

export interface IConsoleNavigationProps {
    isLogged?: boolean
    blocked?: boolean
}
export const ConsoleNavigation: React.FunctionComponent<IConsoleNavigationProps> = (props) => {

    const { width } = useViewport();
    const { scrollTop } = useScrollTop();
    const [editingKey, setEditingKey] = React.useState("research")
    return (
        <header>
            <div style={{
                background: theme.palette.neutralLighter,
                width: '100%',
                height: NAVIGATION_LAYOUT.height,
                position: 'fixed',
                zIndex: 80,
                borderBottom: `1px solid ${theme.palette.neutralLight}`
            }}>
                <ResponsiveDiv>
                    <Stack horizontal horizontalAlign="space-between" >
                        <div style={{ height: NAVIGATION_LAYOUT.height }}>
                            <UrprConsoleLogo />
                        </div>
                        <Pivot aria-label={`${UrprAbbr} - ${UrprZh}`}
                            styles={{
                                root: { height: NAVIGATION_LAYOUT.height },
                                link: { height: NAVIGATION_LAYOUT.height },
                                linkIsSelected: { height: NAVIGATION_LAYOUT.height },
                                linkContent: { minWidth: NAVIGATION_LAYOUT.linkMinWidth, fontSize: NAVIGATION_LAYOUT.linkTextSize, textRendering: "legibility" }
                            }}
                            selectedKey={editingKey}
                            onLinkClick={(item, ev) => { if (item?.props.itemKey != undefined) setEditingKey(item?.props.itemKey) }}>
                            {!props.isLogged ? [] : consolePivotConfigs.map(e => <PivotItem headerText={e.name} key={e.key} itemKey={e.key} />)}
                        </Pivot>

                    </Stack>
                </ResponsiveDiv>
            </div>
            {props.blocked && <div style={{
                background: theme.palette.neutralLighter,
                width: '100%',
                height: NAVIGATION_LAYOUT.height,
                borderBottom: `1px solid ${theme.palette.neutralLight}`
            }} />}
        </header>
    );

};
