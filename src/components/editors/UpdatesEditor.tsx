import React from "react"
import ReactDOM from "react-dom";
import { IUpdatedNews } from "../../interfaces/IUpdatedNews"
import { IColumn, IDragDropEvents, buildColumns, IDragDropContext, MessageBar, Stack, MessageBarType, DefaultButton, PrimaryButton, Modal, mergeStyleSets, Separator, IconButton, DatePicker } from "@fluentui/react";
import { DetailsList, Selection, IColumnReorderOptions, Text, Image, TextField, Link } from '@fluentui/react';
import { dragEnterClass } from "./OpenDataEditor";
import { fetchJsonWithProgress } from "../../utils/fetchs/fetchWithProgress";
import { theme } from "../../configs/theme";
import { NavigateShimmer } from "../navigateShimmer";
import { revealShimmer, hideShimmer } from "../../utils/fetchs/shimmerStatus";
import { uploadPageThumbnail, uploadManifest } from "../../utils/apis/apis";

const emptyUpdatedNews: IUpdatedNews = {
    title: "",
    description: "",
    updatedTimestamp: undefined,
    imageUrl: undefined
}

interface IUpdateEditorProps {

}

const imageUnuploadedHint = "Upload an image"

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

interface IUpdateEditorStates {
    updateList: IUpdatedNews[],

    columns: IColumn[];
    isAddingItem: boolean,
    editingItem: IUpdatedNews,
    selectedCount: number,
    canSave: boolean,

    imageButtonHint: string,

    displayMessageBar: boolean,
    isUploadSuccess: boolean,
    messageText: string | JSX.Element | JSX.Element[]
}

export class UpdateEditor extends React.Component<IUpdateEditorProps, IUpdateEditorStates>{

    private _selection: Selection;
    private _dragDropEvents: IDragDropEvents;
    private _draggedItem: IUpdatedNews | undefined;
    private _draggedIndex: number;
    private _selectedFile?: File;

    constructor(props: IUpdateEditorProps) {
        super(props);
        this.state = {
            updateList: [],
            columns: buildColumns([emptyUpdatedNews]),
            isAddingItem: false,
            canSave: false,
            selectedCount: 0,
            editingItem: emptyUpdatedNews,
            displayMessageBar: false,
            isUploadSuccess: true,
            messageText: "",
            imageButtonHint: imageUnuploadedHint
        }

        this._dragDropEvents = this._getDragDropEvents();
        this._draggedIndex = -1;
        this._selection = new Selection({ onSelectionChanged: () => { this._onSelectionChanged(); } });
        this._fetchManifest()
    }

    private _fetchManifest() {
        fetchJsonWithProgress("/updates.json").then(
            e => this.setState({ updateList: e })
        )
    }
    private _onSelectionChanged() {
        this.setState({ selectedCount: this._selection.count })
    }

    private _insertBeforeItem(item: IUpdatedNews): void {
        const draggedItems = this._selection.isIndexSelected(this._draggedIndex)
            ? (this._selection.getSelection() as IUpdatedNews[])
            : [this._draggedItem!];

        const insertIndex = this.state.updateList.indexOf(item);
        const items = this.state.updateList.filter(itm => draggedItems.indexOf(itm) === -1);

        items.splice(insertIndex, 0, ...draggedItems);

        this.setState({ updateList: items, canSave: true });
    }

    private _getDragDropEvents(): IDragDropEvents {
        return {
            canDrop: (dropContext?: IDragDropContext, dragContext?: IDragDropContext) => {
                return true;
            },
            canDrag: (item?: any) => {
                return true;
            },
            onDragEnter: (item?: any, event?: DragEvent) => {
                // return string is the css classes that will be added to the entering element.
                return dragEnterClass;
            },
            onDragLeave: (item?: any, event?: DragEvent) => {
                return;
            },
            onDrop: (item?: any, event?: DragEvent) => {
                if (this._draggedItem) {
                    this._insertBeforeItem(item);
                }
            },
            onDragStart: (item?: any, itemIndex?: number, selectedItems?: any[], event?: MouseEvent) => {
                this._draggedItem = item;
                this._draggedIndex = itemIndex!;
            },
            onDragEnd: (item?: any, event?: DragEvent) => {
                this._draggedItem = undefined;
                this._draggedIndex = -1;
            },
        };
    }

    private _onRenderItemColumn = (item: IUpdatedNews, index?: number, column?: IColumn): JSX.Element | string => {
        const key = column!.key as keyof IUpdatedNews;
        if (key === 'title') {
            return <span style={{ color: theme.palette.themeDark, fontWeight: 600 }}>{item[key]}</span>;
        }
        if (item[key] == undefined) {
            return <span style={{ color: theme.palette.neutralQuaternaryAlt }}>undefined</span>;
        }
        return String(item[key]);
    };

    private _uploadUpdateImages(e: React.ChangeEvent<HTMLInputElement>) {
        var reader = new FileReader();
        if (e.currentTarget.files != null && e.currentTarget.files.length > 0) {
            let resourceToUpload = e.currentTarget.files[0]
            this._selectedFile = resourceToUpload
            this.setState({ imageButtonHint: resourceToUpload.name + " selected" })
        }
    }

    private _onClickUploadImageButton() {
        let trueInput = ReactDOM.findDOMNode(this.refs["upload-updates-image"]) as HTMLInputElement;
        trueInput.click();
    }

    private _popupNewItemEditor() {
        this._selectedFile = undefined
        this.setState({
            isAddingItem: true,
            editingItem: { ...emptyUpdatedNews },
            imageButtonHint: imageUnuploadedHint
        })
    }

    render() {
        return <div style={{ height: "calc(100vh - 120px)", position: "relative" }}>
            <div style={{ width: "100%", overflowX: "hidden", height: "100%", overflowY: "auto" }}>
                <DetailsList
                    onRenderItemColumn={this._onRenderItemColumn}
                    setKey="name"
                    items={this.state.updateList}
                    selection={this._selection}
                    dragDropEvents={this._dragDropEvents}
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
                            {this.state.messageText}
                        </MessageBar>
                    }

                    <DefaultButton text="Add" iconProps={{ iconName: "Add" }}
                        onClick={() => this._popupNewItemEditor()} />
                    <DefaultButton text="Delete" iconProps={{ iconName: "Delete" }} disabled={this.state.selectedCount != 1} onClick={() => this._deleteItem()} />
                    <PrimaryButton text="Save" iconProps={{ iconName: "Save" }} disabled={!this.state.canSave} onClick={() => this._saveManifest()} />
                </Stack>
            </div>

            <Modal
                isOpen={this.state.isAddingItem}
                onDismiss={() => this.setState({ isAddingItem: false })} isBlocking={true}>
                <div className={contentStyles.header}>
                    <span>Add <i>Updates</i></span>
                    <IconButton styles={iconButtonStyles}
                        iconProps={{ iconName: "Cancel" }}
                        onClick={() => this.setState({ isAddingItem: false })} />
                </div>
                <div className={contentStyles.body}>
                    <Separator />
                    <Stack tokens={{ childrenGap: 12 }}>
                        <TextField label="Title" required
                            iconProps={{ iconName: "NumberSymbol" }}
                            onChange={
                                (e, str) => this.setState({ editingItem: Object.assign(this.state.editingItem, { title: str }) })
                            } />
                        <DatePicker label={"Date"}
                            value={this.state.editingItem.updatedTimestamp == undefined ? undefined :
                                new Date(this.state.editingItem.updatedTimestamp)}
                            onSelectDate={(dt) =>
                                this.setState({
                                    editingItem: Object.assign(
                                        this.state.editingItem, { updatedTimestamp: dt?.getTime() })
                                })} />
                        <input
                            ref="upload-updates-image"
                            type='file'
                            accept='image/*'
                            style={{ display: 'none' }}
                            onChange={(e) => this._uploadUpdateImages(e)}
                        />
                        <DefaultButton
                            iconProps={this.state.imageButtonHint == imageUnuploadedHint ? { iconName: "PictureFill" } : { iconName: "CheckMark" }} styles={{ root: { width: "100%" } }}
                            onClick={() => this._onClickUploadImageButton()}>
                            {this.state.imageButtonHint}
                        </DefaultButton>
                        <NavigateShimmer specifiedId="update-image-upload-shimmer" blocked/>

                        <TextField label="Description" required
                            multiline
                            rows={6}
                            resizable={false}
                            onChange={
                                (e, str) => this.setState({ editingItem: Object.assign(this.state.editingItem, { description: str }) })
                            } />

                    </Stack>
                    <Separator />
                    <PrimaryButton
                        disabled={!(this.state.editingItem.title.length > 0 &&
                            this.state.editingItem.description.length > 0)}
                        text="Confirm" onClick={() => this._addItem()} styles={{ root: { width: "100%" } }} />
                </div>
            </Modal>
        </div>
    }


    private _addItem() {
        if (this.state.editingItem.title.length <= 0
            || this.state.editingItem.description.length <= 0) {
            alert("TITLE and DESCRIPTION are not nullable.")
            return;
        }

        if (this._selectedFile) {
            revealShimmer("update-image-upload-shimmer");
            this.setState({ imageButtonHint: "Uploading Image" })
            uploadPageThumbnail(this._selectedFile,
                () => {
                    hideShimmer("update-image-upload-shimmer");
                    this.setState({
                        displayMessageBar: true,
                        isUploadSuccess: true,
                        messageText: "Image uploaded successfully.",
                        updateList: this.state.updateList.concat([Object.assign(
                            this.state.editingItem,
                            { imageUrl: `/images/${this._selectedFile?.name}` }
                        )]),
                        canSave: true,
                        isAddingItem: false,
                        imageButtonHint: imageUnuploadedHint
                    });
                    setTimeout(() => {
                        this.setState({ displayMessageBar: false });
                    }, 2000);
                },
                () => {
                    hideShimmer("update-image-upload-shimmer");
                    this.setState({
                        displayMessageBar: true,
                        isUploadSuccess: false,
                        messageText: "Error occured uploading image. The new item is not added."
                    });
                })
        }
        else {
            this.setState({
                updateList: this.state.updateList.concat([Object.assign(
                    this.state.editingItem)]),
                canSave: true,
                isAddingItem: false,
                imageButtonHint: imageUnuploadedHint
            });
        }
    }

    private _deleteItem() {
        let selectedItem = this.state.updateList[this._selection.getSelectedIndices()[0]]
        this.setState({ canSave: true, updateList: this.state.updateList.filter(e => e.title != selectedItem.title) })
    }

    private _saveManifest() {
        this.setState({ canSave: false });
        revealShimmer();
        uploadManifest("updates", this.state.updateList,
            () => {
                hideShimmer();
                this.setState({ displayMessageBar: true, isUploadSuccess: true, messageText: <span>Updated successfully.<Link href="/update" target="_blank">Visit website</Link></span> });
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