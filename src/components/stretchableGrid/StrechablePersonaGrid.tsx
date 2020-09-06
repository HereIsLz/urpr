import React from 'react'
import { IPageManifest } from '../../interfaces/IPageManifest';
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress';
import { GRID_LAYOUT } from './_layout';
import { useViewport } from '../../utils/hooks/useViewport';
import { IManifestItem } from '../../interfaces/IManifestItem';
import { IPage } from '@fluentui/react';
import { theme } from '../../configs/theme';
import { FontIcon, mergeStyles, Text, Image } from "@fluentui/react";
import { PersonaInitialsColor } from 'office-ui-fabric-react/lib/Persona';
import { resolveStaticImages, resolvePersonaImages } from '../../configs/resources';
import { IPersonaCustomedProps, IMergedPersonaCustomedProps } from '../../interfaces/IPersonas';

export interface IStretchablePersonaGridProps {
    personaManifestUrl: string
}

export interface IStretchablePersonaGridStates {
    personas: IMergedPersonaCustomedProps[]
}
const gridWrapperStyle = (width: number): React.CSSProperties => {
    const __style: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_LAYOUT.getGridNum(width)}, 1fr)`,
        gridGap: 48,
    }
    return __style
}

interface IGridWrapperProps {
    children?: JSX.Element | JSX.Element[]
}

const GridWrapper: React.FC<IGridWrapperProps> = (props) => {
    const { width } = useViewport()
    return <div style={gridWrapperStyle(width)}>{props.children}</div>
}

const coinClass = mergeStyles({
    borderRadius: 0,
    display: 'block',
});




export class StretchablePersonaGrid extends React.Component<IStretchablePersonaGridProps, IStretchablePersonaGridStates>{
    constructor(props: IStretchablePersonaGridProps) {
        super(props)
        this.state = { personas: [] }
        this.fetchManifest()
    }

    private fetchManifest() {
        fetchJsonWithProgress(this.props.personaManifestUrl).then(e => { this.setState({ personas: e }) })
    }


    private getGroupedGrids(mergedManifests: IMergedPersonaCustomedProps[]): JSX.Element[] {
        return mergedManifests.map(
            e => <div>
                <div style={{ margin: '32px 0 16px 0' }}>
                    <Text variant="xLarge" style={{ lineHeight: 2, color: theme.palette.neutralPrimary }}>
                        {e.role} </Text>
                </div>
                <GridWrapper>{
                    e.personas.map(
                        st => <RenderPersonaFromPersonaManifest_portrait e={st} />
                    )}
                </GridWrapper>
            </div>
        )
    }

    render() {
        return <div>
            {this.getGroupedGrids(this.state.personas)}
        </div>
    }
}

export const textHash = (text: string) => {
    let hash = 1315423911, i, ch;
    for (i = text.length - 1; i >= 0; i--) {
        ch = text.charCodeAt(i);
        hash ^= ((hash << 5) + ch + (hash >> 2));
    }

    return (hash & 0x7FFFFFFF);
}

// export const renderPersonaFromPersonaManifest = (e: IPersonaCustomedProps) => {
//     const nameAbbr = e.name.split(" ").map(i => i[0]).join("").substr(0, 2)
//     return <div style={{ height: 180 }} >
//         <div style={{ float: 'left', width: 120, height: "100%", display: "table", textAlign: "center", background: personaInitialsColorToHexCode((textHash(nameAbbr) + 2) % 25) }} >
//             {e.thumbnail ? <Image src={resolveStaticImages(e.thumbnail)} styles={{ root: { width: "100%", height: 180 }, image: { width: "100%", height: "100%" } }} />
//                 : <Text variant="xxLarge" style={{ color: '#fff', display: 'table-cell', verticalAlign: 'middle' }}>{nameAbbr}</Text>}
//         </div>
//         <div style={{ height: 180, display: "inline-block", width: "calc(100% - 138px)", marginLeft: 18 }} >
//             <Text variant="large" block >{e.name}</Text>
//             <Text variant="medium" block style={{ marginTop: 8 }}>{e.role}</Text>
//             {e.linkText && <Text variant="medium" block style={{ marginTop: 8 }}>
//                 <a href={e.linkUrl} target={e.linkUrl!.startsWith("http") ? "_blank" : undefined}>
//                     <FontIcon iconName={e.linkUrl!.startsWith("mailto") ? "Mail" : "Link"} style={{ verticalAlign: 'middle', marginRight: 4 }} />{e.linkText}</a>
//             </Text>}
//             {e.link2Text && <Text variant="medium" block style={{ marginTop: 8 }}>
//                 <a href={e.link2Url} target={e.link2Url!.startsWith("http") ? "_blank" : undefined}>
//                     <FontIcon iconName={e.link2Url!.startsWith("mailto") ? "Mail" : "Link"} style={{ verticalAlign: 'middle', marginRight: 4 }} />{e.link2Text}</a>
//             </Text>}
//         </div>
//     </div>
// }
export interface IPortraitGridProps {
    e: IPersonaCustomedProps
    isBase64Style?: boolean
}
export const RenderPersonaFromPersonaManifest_portrait: React.FC<IPortraitGridProps> = (props) => {
    const { e } = props
    const nameAbbr = e.name.split(" ").map(i => i[0]).join("").substr(0, 2)
    return <div>
        <div style={{ width: "100%", height: 320, display: "table", textAlign: "center", background: personaInitialsColorToHexCode((textHash(nameAbbr) + 2) % 25) }} >
            {e.thumbnail ? <Image src={props.isBase64Style ? e.thumbnail : resolvePersonaImages(e.thumbnail)} styles={{ root: { width: "100%", height: 320 }, image: { width: "100%", height: "100%" } }} />
                : <Text variant="superLarge" style={{ color: '#fff', display: 'table-cell', verticalAlign: 'middle' }}>{nameAbbr}</Text>}
        </div>
        <div>
            <Text variant="large" block style={{ marginTop: 8 }}>{e.name}</Text>
            <Text variant="medium" block style={{ marginTop: 8 }}>{e.role}</Text>
            {(e.linkText != undefined && e.linkUrl != undefined) && <Text variant="medium" block style={{ marginTop: 8 }}>
                <a href={e.linkUrl} target={e.linkUrl.startsWith("http") ? "_blank" : undefined}>
                    <FontIcon iconName={e.linkUrl.startsWith("mailto") ? "Mail" : "Link"} style={{ verticalAlign: 'middle', marginRight: 4 }} />{e.linkText}</a>
            </Text>}
            {(e.link2Text != undefined && e.link2Url != undefined) && <Text variant="medium" block style={{ marginTop: 8 }}>
                <a href={e.link2Url} target={e.link2Url.startsWith("http") ? "_blank" : undefined}>
                    <FontIcon iconName={e.link2Url.startsWith("mailto") ? "Mail" : "Link"} style={{ verticalAlign: 'middle', marginRight: 4 }} />{e.link2Text}</a>
            </Text>}
        </div>
    </div>
}

function personaInitialsColorToHexCode(personaInitialsColor: PersonaInitialsColor): string {
    switch (personaInitialsColor) {
        case PersonaInitialsColor.lightBlue:
            return '#4F6BED';
        case PersonaInitialsColor.blue:
            return '#0078D4';
        case PersonaInitialsColor.darkBlue:
            return '#004E8C';
        case PersonaInitialsColor.teal:
            return '#038387';
        case PersonaInitialsColor.lightGreen:
        case PersonaInitialsColor.green:
            return '#498205';
        case PersonaInitialsColor.darkGreen:
            return '#0B6A0B';
        case PersonaInitialsColor.lightPink:
            return '#C239B3';
        case PersonaInitialsColor.pink:
            return '#E3008C';
        case PersonaInitialsColor.magenta:
            return '#881798';
        case PersonaInitialsColor.purple:
            return '#5C2E91';
        case PersonaInitialsColor.orange:
            return '#CA5010';
        // tslint:disable-next-line:deprecation
        case PersonaInitialsColor.red:
            return '#3C3E8a';
        case PersonaInitialsColor.lightRed:
            return '#D13438';
        case PersonaInitialsColor.darkRed:
            return '#A4262C';
        case PersonaInitialsColor.transparent:
            return '#da3b01';
        case PersonaInitialsColor.violet:
            return '#8764B8';
        case PersonaInitialsColor.gold:
            return '#986F0B';
        case PersonaInitialsColor.burgundy:
            return '#750B1C';
        case PersonaInitialsColor.warmGray:
            return '#7A7574';
        case PersonaInitialsColor.cyan:
            return '#005B70';
        case PersonaInitialsColor.rust:
            return '#8E562E';
        case PersonaInitialsColor.coolGray:
            return '#69797E';
        // tslint:disable-next-line:deprecation
        case PersonaInitialsColor.black:
            return '#1D1D1D';
        case PersonaInitialsColor.gray:
            return '#393939';
    }
}