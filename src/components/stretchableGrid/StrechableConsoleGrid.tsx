import React from 'react'
import { IPageManifest } from '../../interfaces/IPageManifest';
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress';
import { GRID_LAYOUT } from './_layout';
import { useViewport } from '../../utils/hooks/useViewport';
import { IManifestItem } from '../../interfaces/IManifestItem';

import { theme } from '../../configs/theme';
import { resolveStaticImages } from '../../configs/resources';
import { Image, Text } from "@fluentui/react";
import { IConsoleItemManifest } from '../../interfaces/IConsoleItemManifest';

export interface IStretchableConsoleGridProps {
    manifestUrl: string
}

export interface IStretchableConsoleGridStates {
    manifest: IConsoleItemManifest[]
}

const gridWrapperStyle = (width: number): React.CSSProperties => {
    const __style: React.CSSProperties = {
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_LAYOUT.getGridNum(width)}, 1fr)`,
        gridGap: 1,
        gridAutoRows: `${GRID_LAYOUT.gridHeight}`
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

interface IConsoleEditorEntryGridProps {
    manifest: IConsoleItemManifest
}

export const ConsoleEditorEntryGrid: React.FC<IConsoleEditorEntryGridProps> = (props) => {
    return <div style={{ backgroundColor: theme.palette.themeDark, padding: 24, cursor: "pointer", transition: 'all .2s' }} className="console-entry" onClick={() => window.location.href = props.manifest.route}>
        <Text variant="superLarge" style={{ color: theme.palette.white }}>{props.manifest.name}</Text>
    </div>
}

export class StretchableConsoleGrid extends React.Component<IStretchableConsoleGridProps, IStretchableConsoleGridStates>{
    constructor(props: IStretchableConsoleGridProps) {
        super(props)
        this.state = { manifest: [] }
        this.fetchManifest()
    }

    private fetchManifest() {
        fetchJsonWithProgress(this.props.manifestUrl).then(e => { console.log(e); this.setState({ manifest: e }) })
    }

    private getGrids(manifest: IConsoleItemManifest[]): JSX.Element[] {
        return manifest.map(
            e => <ConsoleEditorEntryGrid manifest={e} />
        )
    }

    render() {
        return <GridWrapper>{this.getGrids(this.state.manifest)}</GridWrapper>
    }
}