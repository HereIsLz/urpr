import React from 'react'
import ReactDOM from 'react-dom'
import { Link, IGroup, Stack, PrimaryButton, DefaultButton, Modal, IconButton, Separator, Button, Dropdown, MessageBar, MessageBarType } from '@fluentui/react';
import { DetailsList, Selection, IColumn, buildColumns, IColumnReorderOptions, IDragDropEvents, IDragDropContext } from '@fluentui/react';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { Toggle, IToggleStyles } from 'office-ui-fabric-react/lib/Toggle';
import { getTheme, mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { IPersonaCustomedProps, IMergedPersonaCustomedProps } from '../../interfaces/IPersonas';
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress';
import { count } from 'console';
import { theme } from '../../configs/theme';
import { uploadPersona, uploadPersonasManifest, uploadManifest } from '../../utils/apis/apis';
import { IOpendataItem } from '../../interfaces/IOpendata';
import { NavigateShimmer } from '../navigateShimmer';
import { revealShimmer, hideShimmer } from '../../utils/fetchs/shimmerStatus';



const margin = '0 30px 20px 0';
const controlWrapperClass = mergeStyles({
    display: 'flex',
    flexWrap: 'wrap',
});
const textFieldStyles: Partial<ITextFieldStyles> = {
    root: { margin: margin },
    fieldGroup: { maxWidth: '100px' },
};
const togglesStyles: Partial<IToggleStyles> = { root: { margin } };

export interface IOpenDataEditorStates {
    opendata: IOpendataItem[];
    columns: IColumn[];
    isAddingOpenDataItem: boolean,
    editingOpenDataItem: IOpendataItem,
    selectedCount: number,
    canSave: boolean,

    displayMessageBar: boolean,
    isUploadSuccess: boolean
}

export interface IOpenDataEditorProps {
    manifestUrl: string
}


const contentStyles = mergeStyleSets({
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
        minWidth: 480,
        selectors: {
            p: { margin: '14px 0' },
            'p:first-child': { marginTop: 0 },
            'p:last-child': { marginBottom: 0 },
        },
    },
});
const toggleStyles = { root: { marginBottom: '20px' } };
const iconButtonStyles = {
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

const popupContainerStyles = {
    minWidth: 600,
    minHeight: 480
};


export class OpenDataEditor extends React.Component<IOpenDataEditorProps, IOpenDataEditorStates>{
    private _selection: Selection;

    constructor(props: IOpenDataEditorProps) {
        super(props)
        this.state = {
            opendata: [],
            columns: buildColumns([{ name: "", linkText: "", linkUrl: "", description: "" }]),
            isAddingOpenDataItem: false,
            canSave: false,
            selectedCount: 0,
            editingOpenDataItem: { name: "", linkText: "", linkUrl: "", description: "" },
            displayMessageBar: false,
            isUploadSuccess: true
        }
        this._selection = new Selection({ onSelectionChanged: () => { this._onSelectionChanged(); } });
        this.generateListItems()
    }

    private generateListItems() {
        fetchJsonWithProgress(this.props.manifestUrl).then(
            e => this.setState({ opendata: e })
        )
    }
    private _onSelectionChanged() {
        this.setState({ selectedCount: this._selection.count })
    }

    render() {
        return <div style={{ height: "calc(100vh - 120px)", position: "relative" }}>
            <div style={{ width: "100%", overflowX: "hidden", height: "100%", overflowY: "auto" }}>
                <DetailsList
                    onRenderItemColumn={this._onRenderItemColumn}
                    setKey="name"
                    items={this.state.opendata}
                    columns={buildColumns(this.state.opendata)}
                    selection={this._selection}
                    styles={{ root: { width: "100%", overflowX: "hidden", height: "100%" } }} />

            </div>
            <div style={{ position: 'absolute', bottom: 0, background: '#fff', width: "calc(100% - 24px)", borderTop: `1px solid ${theme.palette.neutralLight}` }}>
                <NavigateShimmer />
                <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 12 }} styles={{ root: { padding: 12 } }}>
                    {
                        this.state.displayMessageBar &&
                        <MessageBar
                            styles={{ root: { width: "inherit" } }}
                            messageBarType={this.state.isUploadSuccess ? MessageBarType.success : MessageBarType.error}
                            onDismiss={() => this.setState({ displayMessageBar: false })}>
                            {this.state.isUploadSuccess ?
                                <span>Updated successfully.<Link href="/opendata" target="_blank">Visit website</Link></span>
                                : "Error occured."}
                        </MessageBar>
                    }
                    <DefaultButton text="Add" iconProps={{ iconName: "Add" }}
                        onClick={() => this._popupOpenDataItemEditor()} />
                    <DefaultButton text="Delete" iconProps={{ iconName: "Delete" }} disabled={this.state.selectedCount != 1} onClick={() => this._deleteOpenDataItem()} />
                    <PrimaryButton text="Save" iconProps={{ iconName: "Save" }} disabled={!this.state.canSave} onClick={() => this._saveOpenData()} />
                </Stack>
            </div>

            <Modal
                isOpen={this.state.isAddingOpenDataItem}
                onDismiss={() => this.setState({ isAddingOpenDataItem: false })} isBlocking={true}>
                <div className={contentStyles.header}>
                    <span>Add Open Data</span>
                    <IconButton styles={iconButtonStyles}
                        iconProps={{ iconName: "Cancel" }}
                        onClick={() => this.setState({ isAddingOpenDataItem: false })} />
                </div>
                <div className={contentStyles.body}>
                    <Separator />
                    <Stack tokens={{ childrenGap: 12 }}>
                        <TextField label="name" required
                            iconProps={{ iconName: "NumberSymbol" }}
                            onChange={
                                (e, str) => this.setState({ editingOpenDataItem: Object.assign(this.state.editingOpenDataItem, { name: str }) })
                            } />
                        <TextField label="description" required
                            multiline
                            rows={6}
                            resizable={false}
                            onChange={
                                (e, str) => this.setState({ editingOpenDataItem: Object.assign(this.state.editingOpenDataItem, { description: str }) })
                            } />
                        <TextField label="Link Text" required
                            iconProps={{ iconName: "TouchPointer" }}
                            onChange={
                                (e, str) => this.setState({ editingOpenDataItem: Object.assign(this.state.editingOpenDataItem, { linkText: str }) })
                            } />
                        <TextField label="Link Url" required
                            iconProps={{ iconName: "Link" }}
                            onChange={
                                (e, str) => this.setState({ editingOpenDataItem: Object.assign(this.state.editingOpenDataItem, { linkUrl: str }) })
                            } />
                    </Stack>
                    <Separator />
                    <PrimaryButton text="Confirm" onClick={() => this._addOpenDataItem()} styles={{ root: { width: "100%" } }} />
                </div>
            </Modal>
        </div>
    }

    private _popupOpenDataItemEditor() {
        this.setState({
            isAddingOpenDataItem: true,
            editingOpenDataItem: { name: "", linkText: "", linkUrl: "", description: "" }
        })
    }

    private _onRenderItemColumn = (item: IOpendataItem, index?: number, column?: IColumn): JSX.Element | string => {
        const key = column!.key as keyof IOpendataItem;
        if (key === 'name') {
            return <span style={{ color: theme.palette.themeDark, fontWeight: 600 }}>{item[key]}</span>;
        }
        if (item[key] == undefined) {
            return <span style={{ color: theme.palette.neutralQuaternaryAlt }}>undefined</span>;
        }
        return String(item[key]);
    };

    private _addOpenDataItem() {
        //document.getElementById('navigate-shimmer')?.classList.add('shimmering');
        if (this.state.editingOpenDataItem.name.length <= 1
            || this.state.editingOpenDataItem.description.length <= 1
            || this.state.editingOpenDataItem.linkText.length <= 1
            || this.state.editingOpenDataItem.linkUrl.length <= 1) {
            alert("All fields must contain more than 1 character.")
            return;
        }
        if (!this.state.editingOpenDataItem.linkUrl.startsWith("http")
            && !this.state.editingOpenDataItem.linkUrl.startsWith("/")) {
            alert("Link Url must start with \"http\" or \"/\".")
            return;
        }
        this.setState({
            opendata: this.state.opendata.concat([this.state.editingOpenDataItem]),
            canSave: true,
            isAddingOpenDataItem: false
        })
    }

    private _deleteOpenDataItem() {
        let selectedItem = this.state.opendata[this._selection.getSelectedIndices()[0]]

        this.setState({ canSave: true, opendata: this.state.opendata.filter(e => e.name != selectedItem.name) })
    }

    private _saveOpenData() {
        this.setState({ canSave: false });
        revealShimmer();
        uploadManifest("opendata", this.state.opendata,
            () => {
                hideShimmer();
                this.setState({ displayMessageBar: true, isUploadSuccess: true });
                setTimeout(() => {
                    this.setState({ displayMessageBar: false });
                }, 2000);
            },
            () => {
                hideShimmer();
                this.setState({ canSave: true, displayMessageBar: true, isUploadSuccess: false });
            }
        )
    }
}