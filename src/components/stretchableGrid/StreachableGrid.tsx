import React from 'react'
import { IPageManifest } from '../../configs/defs';
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress';
import { GRID_LAYOUT } from './_layout';
import { useViewport } from '../../utils/hooks/useViewport';
import { IManifestItem } from '../../interfaces/IManifestItem';

import { theme } from '../../configs/theme';
import { resolveStaticImages } from '../../configs/resources';
import { Image } from "@fluentui/react";

export interface IStretchableGridProps {
    manifestUrl: string
}

export interface IStretchableGridStates {
    manifest: IPageManifest[]
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

interface IPageThumbnailUnitGridProps {
    manifest: IPageManifest
}

const PageThumbnailUnitGridStyle: React.CSSProperties = {
    background: theme.palette.themeLight,
    width: '100%',
    height: "100%",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer"
}
const PageThumbnailUnitGridBackgroundStyle: React.CSSProperties = {
    width: '100%',
    height: "0"
}
const PageThumbnailTitleBgStyle: React.CSSProperties = {
    background: theme.palette.themePrimary,
    color: '#fff',
    width: "100%",
    height: "100%",
    position: 'absolute',

}
const PageThumbnailTitleStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: 24,
    padding: 24,
    position: 'absolute',
    bottom: 0,
    lineHeight: 1.5,
    opacity: 1
}
export const PageThumbnailUnitGrid: React.FC<IPageThumbnailUnitGridProps> = (props) => {
    return <div style={PageThumbnailUnitGridStyle} onClick={() => window.location.href = `research/${props.manifest.fileName}`}>
        {props.manifest.thumbnail ? <Image shouldFadeIn src={resolveStaticImages(props.manifest.thumbnail)} styles={{ root: { width: '100%', height: "100%", position: "absolute" }, image: { width: '100%', height: "100%" } }} /> : null}
        <div style={PageThumbnailTitleBgStyle} className="hover-card">
            <div style={PageThumbnailTitleStyle}>
                {props.manifest.displayName}
            </div>
        </div>

        <div></div>
    </div>
}

export class StretchableGrid extends React.Component<IStretchableGridProps, IStretchableGridStates>{
    constructor(props: IStretchableGridProps) {
        super(props)
        this.state = { manifest: [] }
        this.fetchManifest()
    }

    private fetchManifest() {
        fetchJsonWithProgress(this.props.manifestUrl).then(e => { console.log(e); this.setState({ manifest: e }) })
    }

    private getGrids(manifest: IPageManifest[]): JSX.Element[] {
        return manifest.map(
            e => <PageThumbnailUnitGrid manifest={e} />
        )
    }

    render() {
        return <GridWrapper>{this.getGrids(this.state.manifest)}</GridWrapper>
    }
}