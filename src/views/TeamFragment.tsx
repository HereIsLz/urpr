import React from 'react'
import { DesktopNavigation } from '../components/navigation/desktopNavigation'
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
import { StretchablePersonaGrid, renderPersonaFromPersonaManifest } from '../components/stretchableGrid/StrechablePersonaGrid';

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

export const TeamFragment: React.FC = () => {
    const { width } = useViewport();
    return <div>

        <div style={navigatePlaceHolderStyle}>
            <DesktopNavigation alwaysColored />
        </div>


        <ResponsiveDiv>
            <div style={{ margin: '72px 0 16px 0' }}>
                <Text variant="superLarge">Our Team</Text>
            </div>
            <div style={{ margin: '0 0 8px 0' }}>
                <Text variant="xLarge" style={{ lineHeight: 2, color: theme.palette.neutralPrimary }}>
                    Principal Investigator
                </Text>
            </div>
            {renderPersonaFromPersonaManifest({
                thumbnail: "persona1.jpg",
                imageInitials: 'LL',
                name: 'Lun Liu',
                role: 'Assistant Professor & Researcher, Peking University',
                linkText: 'Official Page',
                linkUrl: 'https://www.sg.pku.edu.cn/szdw/zzjs/csyqyglx1/1318197.htm',
                link2Text: 'Mail: liu.lun@pku.edu.cn',
                link2Url: 'mailto:liu.lun@pku.edu.cn',
            })}
            <StretchablePersonaGrid personaManifestUrl="personas.json" textTitle="Graduate Students"/>
        </ResponsiveDiv>

        <ResponsiveDiv>
            <div style={{ margin: '72px 0 16px 0' }}>
                <Text variant="superLarge" >Get Involved</Text>
            </div>
            <div>
                <Text variant="large" >
                    We are open for PhD applications from the globe. Applicants please email Dr Liu. (<a href="mailto:liu.lun@pku.edu.cn">liu.lun@pku.edu.cn</a>)
                </Text>
            </div>
        </ResponsiveDiv>
    </div>
}