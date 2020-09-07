import React from 'react'
import { IPageManifest } from '../../interfaces/IPageManifest';
import { IColumn, mergeStyleSets } from '@fluentui/react';
import { theme } from '../../configs/theme';

export interface IPageEditorProps {
    manifestUrl: string,

}

export interface IPageEditorStates {
    pageManifest: IPageManifest[],
    columns: IColumn[],
    isEditingNewPage: boolean,
    editingNewPage: IPageManifest,
    canSave: boolean,
    selectedCount: number,
    markdownPreviewString: string,
    isNewPageRouteNailed: boolean,
    displayMessageBar: boolean,
    isUploadSuccess: boolean,
    messageBarText: string
}

export const PageEditorContainerStyles = mergeStyleSets({
    container: {
        display: 'flex',
        flexFlow: 'column nowrap',
        alignItems: 'stretch',
    },
    header: [
        theme.fonts.xLargePlus,
        {
            flex: '1 1 auto',
            borderTop: `4px solid ${theme.palette.themeDark}`,
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            padding: '12px 12px 14px 24px',
        },
    ],
    body: {
        flex: '4 4 auto',
        padding: '0 24px 24px 24px',
        overflowY: 'hidden',
        maxWidth: `calc(100vw - 24px)`,
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});

export const pageEditorIconButtonStyles = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '4px',
        marginRight: '2px',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};


export const emptyPageManifestItem: IPageManifest = {
    displayName: "",
    fileName: "",
    thumbnail: "",
    author: undefined,
    publishedTimestamp: undefined
}
