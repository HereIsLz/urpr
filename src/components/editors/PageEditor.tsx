import React from 'react'
import ReactDOM from "react-dom";
import { IPageEditorProps, IPageEditorStates, emptyPageManifestItem, PageEditorContainerStyles, pageEditorIconButtonStyles } from "./PagesEditorConfigs";
import { buildColumns, DetailsList, IColumn, Selection, Stack, DefaultButton, PrimaryButton, Modal, IconButton, Separator, TextField, Text, DatePicker, MessageBar, MessageBarType, IDragDropEvents, IDragDropContext } from '@fluentui/react';
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress';
import { IPageManifest } from '../../interfaces/IPageManifest';
import { theme } from '../../configs/theme';
import { Markdown } from '../markdown/Markdown';
import { ThumbnailPreview } from './ThumbnailPreview';
import { uploadPageResources, uploadManifest, uploadPageThumbnail, uploadPageMarkdown } from '../../utils/apis/apis';
import { revealShimmer, hideShimmer } from '../../utils/fetchs/shimmerStatus';
import { NavigateShimmer } from '../navigateShimmer';
import { Link } from "@fluentui/react";
import { dragEnterClass } from "./OpenDataEditor";
import { formatTime } from '../../utils/FormatDate';

var uploadQueue: File[] = [];


export class PageEditor extends React.Component<IPageEditorProps, IPageEditorStates>{
    private _selection: Selection;
    private _dragDropEvents: IDragDropEvents;
    private _draggedItem: IPageManifest | undefined;
    private _draggedIndex: number;
    constructor(props: IPageEditorProps) {
        super(props)
        this.state = {
            pageManifest: [],
            columns: buildColumns([emptyPageManifestItem]),
            canSave: false,
            selectedCount: 0,
            markdownPreviewString: "",

            isEditingNewPage: false,
            editingNewPage: Object.assign({}, emptyPageManifestItem),
            isNewPageRouteNailed: false,
            messageBarText: "",
            isUploadSuccess: true,
            displayMessageBar: false
        }
        this._selection = new Selection(
            { onSelectionChanged: () => this._onSelectionChanged() }
        )
        this._dragDropEvents = this._getDragDropEvents();
        this._draggedIndex = -1;
        //this._fetchManifest(this.props.manifestUrl)
    }

    componentDidMount() {
        this._fetchManifest(this.props.manifestUrl)
    }


    private _onSelectionChanged() {
        this.setState({ selectedCount: this._selection.count })
    }

    private _fetchManifest(manifestUrl: string) {
        fetchJsonWithProgress(manifestUrl).then(
            _json => this.setState({ pageManifest: _json })
        )
    }

    private _onRenderItemColumn(item: IPageManifest, index?: number, column?: IColumn) {
        const key = column!.key as keyof IPageManifest;
        if (item[key] == undefined) {
            return <span style={{ color: theme.palette.neutralQuaternaryAlt }}>undefined</span>;
        }
        if (key === 'displayName') {
            return <span style={{ color: theme.palette.themeDark, fontWeight: 600 }}>{item[key]}</span>;
        }
        else if (key === 'publishedTimestamp') {
            return <span style={{ color: theme.palette.themeDark, fontWeight: 600 }}>{formatTime(item[key]!)}</span>;
        }

        return String(item[key]);
    }

    private _popupPageManifestItemEditor() {
        this.setState({ isEditingNewPage: true, markdownPreviewString: "" })
    }

    private _deletePageManifestItem() {
        let selectedItem = this.state.pageManifest[this._selection.getSelectedIndices()[0]]
        this.setState({ canSave: true, pageManifest: this.state.pageManifest.filter(e => e.displayName != selectedItem.displayName) })
    }

    private _savePageManifest() {
        this.setState({ canSave: false })
        revealShimmer();
        uploadManifest("pages", this.state.pageManifest,
            () => {
                hideShimmer();
                this.setState({ displayMessageBar: true, isUploadSuccess: true, messageBarText: "Page manifest updated successfully." });
                setTimeout(() => {
                    this.setState({ displayMessageBar: false });
                }, 2000);
            },
            () => {
                this.setState({ canSave: true, displayMessageBar: true, isUploadSuccess: false, messageBarText: "Error occured saving manifest." });
                hideShimmer();
            }
        )
    }

    private _insertBeforeItem(item: IPageManifest): void {
        const draggedItems = this._selection.isIndexSelected(this._draggedIndex)
            ? (this._selection.getSelection() as IPageManifest[])
            : [this._draggedItem!];

        const insertIndex = this.state.pageManifest.indexOf(item);
        const items = this.state.pageManifest.filter(itm => draggedItems.indexOf(itm) === -1);

        items.splice(insertIndex, 0, ...draggedItems);

        this.setState({ pageManifest: items, canSave: true });
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

    private _addPageItem() {
        if (!/^[A-Za-z0-9\-]*$/g.test(this.state.editingNewPage.fileName)) {
            alert("FileName invalid.")
            return;
        }
        let newPageManifests = this.state.pageManifest.map(a => a)
        //let trueInput = ReactDOM.findDOMNode(this.refs["add-page-thumbnail"]) as HTMLInputElement;
        if (uploadQueue.length > 0) {
            newPageManifests.push(
                Object.assign(
                    this.state.editingNewPage,
                    {
                        thumbnail: uploadQueue[0].name
                    }
                )
            )
            revealShimmer("upload-page-thumb-shimmer");

            uploadPageThumbnail(uploadQueue[0],
                () => {
                    // path specified
                    if (this.state.editingNewPage.fileName.length > 0)
                        uploadPageMarkdown(
                            this.state.markdownPreviewString,
                            this.state.editingNewPage.fileName,
                            () => {
                                uploadQueue = []
                                this.setState({
                                    canSave: true,
                                    isEditingNewPage: false,
                                    editingNewPage: Object.assign<{}, IPageManifest>({}, emptyPageManifestItem),
                                    isNewPageRouteNailed: false,

                                    pageManifest: newPageManifests,
                                    displayMessageBar: true,
                                    isUploadSuccess: true,
                                    messageBarText: "New page content uploaded successfully."
                                })

                                hideShimmer("upload-page-thumb-shimmer");

                                setTimeout(() => {
                                    this.setState({ displayMessageBar: false });
                                }, 2000);
                            },
                            () => {
                                uploadQueue = []
                                hideShimmer("upload-page-thumb-shimmer");
                                this.setState({
                                    isEditingNewPage: false,
                                    editingNewPage: Object.assign<{}, IPageManifest>({}, emptyPageManifestItem),
                                    isNewPageRouteNailed: false,

                                    displayMessageBar: true,
                                    isUploadSuccess: false,
                                    messageBarText: "Error occured uploading new page content."
                                });
                            }
                        )
                    //path not specified
                    else {
                        uploadQueue = []
                        this.setState({
                            canSave: true,
                            isEditingNewPage: false,
                            editingNewPage: Object.assign<{}, IPageManifest>({}, emptyPageManifestItem),
                            isNewPageRouteNailed: false,
                            pageManifest: newPageManifests
                        })
                        hideShimmer();
                    }
                },
                () => {
                    uploadQueue = []
                    this.setState({
                        canSave: true,
                        isEditingNewPage: false,
                        editingNewPage: Object.assign<{}, IPageManifest>({}, emptyPageManifestItem),
                        isNewPageRouteNailed: false
                    })
                    hideShimmer();
                    alert("Upload failed.")
                }
            )

        }
        else{
            alert("Thumbnail required.")
        }
    }

    render() {
        return <div style={{ height: "calc(100vh - 120px)", position: "relative" }}>
            <div style={{ width: "100%", overflowX: "hidden", height: "100%", overflowY: "auto" }}>
                <DetailsList
                    onRenderItemColumn={this._onRenderItemColumn}
                    setKey="name"
                    items={this.state.pageManifest}
                    columns={buildColumns([emptyPageManifestItem])}
                    selection={this._selection}
                    dragDropEvents={this._dragDropEvents}
                    styles={{ root: { width: "100%", overflowX: "hidden", height: "100%" } }} />

            </div>
            <div style={{ position: 'absolute', bottom: 0, padding: 12, background: '#fff', width: "calc(100% - 24px)", borderTop: `1px solid ${theme.palette.neutralLight}` }}>
                <NavigateShimmer />
                <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 12 }}>
                    {
                        this.state.displayMessageBar &&
                        <MessageBar
                            styles={{ root: { width: "inherit" } }}
                            messageBarType={this.state.isUploadSuccess ? MessageBarType.success : MessageBarType.error}
                            onDismiss={() => this.setState({ displayMessageBar: false })}>
                            {this.state.isUploadSuccess ?
                                <span>{this.state.messageBarText}<Link href="/" target="_blank">Visit research page</Link></span>
                                : this.state.messageBarText}
                        </MessageBar>
                    }
                    <DefaultButton text="Add" iconProps={{ iconName: "Add" }}
                        onClick={() => this._popupPageManifestItemEditor()} />
                    <DefaultButton text="Delete" iconProps={{ iconName: "Delete" }} disabled={this.state.selectedCount != 1} onClick={() => this._deletePageManifestItem()} />
                    <PrimaryButton text="Save" iconProps={{ iconName: "Save" }} disabled={!this.state.canSave} onClick={() => this._savePageManifest()} />
                </Stack>
            </div>

            <Modal
                isOpen={this.state.isEditingNewPage}
                onDismiss={() => this._onDismissEditingPopupsWithoutSaving()}
                isBlocking={true}
                allowTouchBodyScroll={true} >
                <div className={PageEditorContainerStyles.header}>
                    <span>Add New Research Post</span>
                    <IconButton styles={pageEditorIconButtonStyles}
                        iconProps={{ iconName: "Cancel" }}
                        onClick={() => this._onDismissEditingPopupsWithoutSaving()} />
                </div>
                <div className={PageEditorContainerStyles.body}>
                    <Separator />
                    <Stack horizontal tokens={{ childrenGap: 12 }}>
                        <Stack tokens={{ childrenGap: 12 }} styles={{ root: { width: 720 } }}>
                            <Stack horizontal>
                                <div style={{ width: 300 }}>
                                    <TextField label="FileName"
                                        iconProps={{ iconName: "Rename" }}
                                        required
                                        disabled={this.state.isNewPageRouteNailed}
                                        placeholder={'A-Z, a-z, 0-9, "-"'}
                                        onChange={(e, v) => this.setState({
                                            editingNewPage: Object.assign(
                                                this.state.editingNewPage,
                                                { fileName: v }
                                            )
                                        })} />
                                    <TextField label="DisplayName(Title)" required
                                        iconProps={{ iconName: "NumberSymbol" }}
                                        onChange={(e, v) => this.setState({
                                            editingNewPage: Object.assign(
                                                this.state.editingNewPage,
                                                { displayName: v }
                                            )
                                        })} />
                                    <TextField label="Author"
                                        iconProps={{ iconName: "Contact" }}
                                        onChange={(e, v) => {
                                            if (v != undefined && v?.length > 0) {
                                                this.setState({
                                                    editingNewPage: Object.assign(
                                                        this.state.editingNewPage,
                                                        { author: v }
                                                    )
                                                })
                                            }
                                        }
                                        } />
                                    <DatePicker
                                        placeholder={"Select a Date..."}
                                        styles={{ root: { marginTop: 6 } }}
                                        onSelectDate={(date) => {
                                            if (date != undefined && date != null)
                                                this.setState({
                                                    editingNewPage: Object.assign(
                                                        this.state.editingNewPage,
                                                        { publishedTimestamp: date.getTime() }
                                                    )
                                                })
                                        }}
                                    />
                                    <DefaultButton
                                        text="Upload Thumbnail"
                                        iconProps={{ iconName: "ThumbnailView" }}
                                        styles={{ root: { width: "100%", marginTop: 6 } }}
                                        onClick={() => this._onClickUploadThumbnailButton()}
                                    />
                                    <NavigateShimmer blocked specifiedId="upload-page-thumb-shimmer" />
                                </div>
                                <div style={{ width: 408, marginLeft: 12 }}>
                                    {
                                        (this.state.isEditingNewPage == false) ?
                                            <div style={{ height: "calc(100% - 2px)", width: "calc(100% - 2px)", textAlign: "center", verticalAlign: "middle", color: theme.palette.neutralTertiary, border: `1px solid ${theme.palette.neutralLight}`, backgroundColor: theme.palette.neutralLighter }}>Thumbnail Preview</div>
                                            : <ThumbnailPreview manifest={this.state.editingNewPage} />
                                    }
                                </div>
                            </Stack>
                            <div style={{ height: "calc(100% - 312px)" }}>
                                <TextField label={"Content"}

                                    disabled={
                                        !(this.state.editingNewPage.fileName.length > 0 &&
                                            /^[A-Za-z0-9\-]*$/g.test(this.state.editingNewPage.fileName)
                                            && this.state.editingNewPage.displayName.length > 0)
                                    }
                                    placeholder={"**Markdown** supported"}
                                    multiline resizable={false}
                                    styles={{
                                        root: { height: "100%", fontFamily: "Roboto Mono" },
                                        field: { height: "100%" }, wrapper: { height: "100%" }, fieldGroup: { height: "calc(100% - 27px);" }
                                    }}
                                    onChange={(e, v) => { if (v != undefined && v.length > 0) this.setState({ markdownPreviewString: v }) }} />
                            </div>
                            <DefaultButton
                                disabled={
                                    !(this.state.editingNewPage.fileName.length > 0 &&
                                        /^[A-Za-z0-9\-]*$/g.test(this.state.editingNewPage.fileName)
                                        && this.state.editingNewPage.displayName.length > 0)
                                }
                                text="Upload Images"
                                iconProps={{ iconName: "PictureFill" }}
                                styles={{ root: { width: "100%" } }} onClick={() => this._onClickUploadImageButton()} />
                            <div style={{ position: "relative", marginTop: 0 }}>
                                <NavigateShimmer specifiedId="upload-page-resource-shimmer" />
                            </div>
                        </Stack>
                        <Separator vertical />
                        <div style={{ width: 960 }}>
                            <div style={{ width: '100%', height: "72vh", overflow: "auto", WebkitOverflowScrolling: "touch", border: `1px solid ${theme.palette.neutralLight}` }}>
                                {
                                    this.state.markdownPreviewString.length > 0 ?
                                        <div style={{ padding: 24 }}>
                                            <Markdown unparsedContentString={this.state.markdownPreviewString} />
                                        </div>
                                        :
                                        <div style={{ height: "100%", width: "100%", textAlign: "center", color: theme.palette.neutralTertiary, backgroundColor: theme.palette.neutralLighter }}>Markdown Preview</div>
                                }
                            </div>
                        </div>

                        <input
                            ref="add-page-thumbnail"
                            type='file'
                            accept='image/*'
                            style={{ display: 'none' }}
                            onChange={(e) => this._thumbnailInputChanged(e)}
                        />
                        <input
                            ref="add-page-resource-image"
                            type='file'
                            accept='image/*'
                            style={{ display: 'none' }}
                            onChange={(e) => this._onPageResourceImageInputChanged(e)}
                        />
                    </Stack>
                    <Separator />
                    <PrimaryButton
                        disabled={
                            !((this.state.editingNewPage.fileName.length == 0 ||
                                /^[A-Za-z0-9\-]*$/g.test(this.state.editingNewPage.fileName))
                                && this.state.editingNewPage.displayName.length > 0)
                        }
                        text="Confirm" onClick={() => this._addPageItem()} styles={{ root: { width: "100%" } }} />
                </div>
            </Modal>
        </div>
    }

    private _onPageResourceImageInputChanged(ev: React.ChangeEvent<HTMLInputElement>) {
        if (!/^[A-Za-z0-9\-]*$/g.test(this.state.editingNewPage.fileName)) {
            alert("FileName invalid.")
            return;
        }
        this.setState({ isNewPageRouteNailed: true })
        revealShimmer("upload-page-resource-shimmer");
        if (ev.currentTarget.files != null && ev.currentTarget.files.length > 0) {
            let selectedImage = ev.currentTarget.files[0]
            uploadPageResources(selectedImage,
                this.state.editingNewPage.fileName,
                () => {
                    hideShimmer("upload-page-resource-shimmer");
                },
                () => { hideShimmer("upload-page-resource-shimmer"); alert("Error occured uploading image."); }
            )
        }
    }

    private _onClickUploadImageButton() {
        let trueInput = ReactDOM.findDOMNode(this.refs["add-page-resource-image"]) as HTMLInputElement;
        trueInput.click();
    }

    private _onClickUploadThumbnailButton() {
        let trueInput = ReactDOM.findDOMNode(this.refs["add-page-thumbnail"]) as HTMLInputElement;
        trueInput.click();
    }

    private _thumbnailInputChanged(ev: React.ChangeEvent<HTMLInputElement>) {
        var reader = new FileReader();
        if (ev.currentTarget.files != null && ev.currentTarget.files.length > 0) {
            let selectedImage = ev.currentTarget.files[0]
            uploadQueue = [selectedImage]
            reader.readAsDataURL(selectedImage)
            reader.onload = (e) => this.setState({
                editingNewPage: Object.assign(
                    this.state.editingNewPage,
                    { thumbnail: reader.result as string }
                )
            })
        }
    }

    private _onDismissEditingPopupsWithoutSaving() {
        this.setState({
            editingNewPage: Object.assign<{}, IPageManifest>({}, emptyPageManifestItem),
            isNewPageRouteNailed: false,
            isEditingNewPage: false
        })
    }



}