import React from 'react'
import { ConsoleNavigation, IConsolePivotConfig } from '../components/navigation/ConsoleNavigation'
import { resolveStaticImages } from '../configs/resources'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text, TextField, Button, PrimaryButton, Separator, MaskedTextField, Stack, Pivot, PivotItem } from "@fluentui/react";
import { UrprFull, UrprDetail, UrprZh, UrprAbbr } from '../configs/strings';
import { theme } from '../configs/theme';
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge } from '../configs/dimens';
import { StretchableGrid } from '../components/stretchableGrid/StreachableGrid';
import { NAVIGATION_LAYOUT } from '../components/navigation/_layout';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { StretchablePersonaGrid } from '../components/stretchableGrid/StrechablePersonaGrid';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { StretchableConsoleGrid } from '../components/stretchableGrid/StrechableConsoleGrid';
import { TeamEditor, TeamMemberEditor } from '../components/editors/TeamEditor';
import { useScrollTop } from '../utils/hooks/useScrollTop';
import { UrprConsoleLogo } from '../components/ConsoleLogo';
import { OpenDataEditor } from '../components/editors/OpenDataEditor';
import { PageEditor } from '../components/editors/PageEditor';

const navigatePlaceHolderStyle: React.CSSProperties = {
    width: "100%",
    height: NAVIGATION_LAYOUT.height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
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

interface IConsoleFragmentProps {
    username: string,
    password: string
}

export const ConsoleFragment: React.FC<IConsoleFragmentProps> = (props) => {
    const [editingKey, setEditingKey] = React.useState("research")
    return <div>

        <div style={navigatePlaceHolderStyle}>
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
                                {consolePivotConfigs.map(e => <PivotItem headerText={e.name} key={e.key} itemKey={e.key} />)}
                            </Pivot>

                        </Stack>
                    </ResponsiveDiv>
                </div>
                <div style={{
                    background: theme.palette.neutralLighter,
                    width: '100%',
                    height: NAVIGATION_LAYOUT.height,
                    borderBottom: `1px solid ${theme.palette.neutralLight}`
                }} />
            </header>
        </div>

        {
            editingKey == "team" && <ResponsiveDiv>
                <TeamMemberEditor manifestUrl="/personas.json" />
            </ResponsiveDiv>
        }
        {
            editingKey == "opendata" && <ResponsiveDiv>
                <OpenDataEditor manifestUrl="/opendata.json" />
            </ResponsiveDiv>
        }
        {
            editingKey == "research" && <ResponsiveDiv>
                <PageEditor manifestUrl="/pages.json" />
            </ResponsiveDiv>
        }
    </div>
}