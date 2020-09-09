import React from 'react'
import { DesktopNavigation, UrprNavigation } from '../components/navigation/desktopNavigation'
import { resolveStaticImages } from '../configs/resources'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text, FontIcon } from "@fluentui/react";
import { UrprFull, UrprDetail } from '../configs/strings';
import { theme } from '../configs/theme';
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge } from '../configs/dimens';
import { StretchableGrid } from '../components/stretchableGrid/StreachableGrid';
import { NAVIGATION_LAYOUT } from '../components/navigation/_layout';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { StretchablePersonaGrid } from '../components/stretchableGrid/StrechablePersonaGrid';
import { RoomForFootnot } from '../components/footnote/RoomForFootnote';
import { fetchJsonWithProgress } from '../utils/fetchs/fetchWithProgress';
import { Markdown } from '../components/markdown/Markdown';

const navigatePlaceHolderStyle: React.CSSProperties = {
    width: "100%",
    height: NAVIGATION_LAYOUT.height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',

}

const principleInvestigatorPersona: IPersonaSharedProps = {
    imageUrl: resolveStaticImages("persona1.jpg"),
    imageInitials: 'LL',
    text: 'Lun Liu',
    secondaryText: 'Assistant Professor & Researcher, Peking University',
    tertiaryText: '<a>Official Page</a>(https://www.sg.pku.edu.cn/szdw/zzjs/csyqyglx1/1318197.htm)',
    //optionalText: 'Available at 4:00pm',
};

const Personas: IPersonaSharedProps[] = [{
    //imageUrl: resolveStaticImages("bg.png"),
    imageInitials: 'LL',
    text: 'Lun Liu',
    secondaryText: 'Assistant Professor & Researcher, Peking University',
    tertiaryText: '<a>Official Page</a>(https://www.sg.pku.edu.cn/szdw/zzjs/csyqyglx1/1318197.htm)',
    //optionalText: 'Available at 4:00pm',
},
{
    //imageUrl: resolveStaticImages("bg.png"),
    imageInitials: 'LL',
    text: 'Lun Liu',
    secondaryText: 'Assistant Professor & Researcher, Peking University',
    tertiaryText: '<a>Official Page</a>(https://www.sg.pku.edu.cn/szdw/zzjs/csyqyglx1/1318197.htm)',
    //optionalText: 'Available at 4:00pm',
},
]

interface ITeamGetInvolvedFragmentStates {
    markdownString: string
}

export class TeamGetInvolvedFragment extends React.Component<{}, ITeamGetInvolvedFragmentStates>{
    constructor() {
        super({})
        this.state = {
            markdownString: ""
        }
        fetchJsonWithProgress("/others.json").then(e => this.setState({ markdownString: e.getInvolvedMarkdown }))
    }
    render() {
        return <Markdown unparsedContentString={this.state.markdownString} />
    }
}

export const TeamFragment: React.FC = () => {
    const { width } = useViewport();
    return <div>

        <div style={navigatePlaceHolderStyle}>
            <UrprNavigation alwaysColored />
        </div>


        <ResponsiveDiv slimmed>
            <div style={{ margin: '72px 0 16px 0' }}>
                <Text variant="superLarge">Our Team</Text>
            </div>
            <StretchablePersonaGrid personaManifestUrl="/personas.json" />
            <div style={{ margin: '72px 0 16px 0' }}>
                <Text variant="superLarge" >Get Involved</Text>
            </div>
            <TeamGetInvolvedFragment />
        </ResponsiveDiv>
        <RoomForFootnot />
    </div>
}