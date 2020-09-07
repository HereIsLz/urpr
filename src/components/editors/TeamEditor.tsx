import React from 'react'
import ReactDOM from 'react-dom'
import { Link, IGroup, Stack, PrimaryButton, DefaultButton, Modal, IconButton, Separator, Button, Dropdown, MessageBar, MessageBarType } from '@fluentui/react';
import {
    Text,
    DetailsList,
    Selection,
    IColumn,
    buildColumns,
    IColumnReorderOptions,
    IDragDropEvents,
    IDragDropContext,
} from '@fluentui/react';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';

import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { Toggle, IToggleStyles } from 'office-ui-fabric-react/lib/Toggle';
import { getTheme, mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { IPersonaCustomedProps, IMergedPersonaCustomedProps } from '../../interfaces/IPersonas';
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress';
import { count } from 'console';
import { theme } from '../../configs/theme';
import { stringify } from 'querystring';
import { RenderPersonaFromPersonaManifest_portrait } from '../stretchableGrid/StrechablePersonaGrid';
import { uploadPersona, uploadPersonasManifest, uploadManifest } from '../../utils/apis/apis';
import { revealShimmer, hideShimmer } from '../../utils/fetchs/shimmerStatus';
import { NavigateShimmer } from '../navigateShimmer';

const margin = '0 30px 20px 0';
const dragEnterClass = mergeStyles({
    backgroundColor: theme.palette.neutralLight,
});
const controlWrapperClass = mergeStyles({
    display: 'flex',
    flexWrap: 'wrap',
});
const textFieldStyles: Partial<ITextFieldStyles> = {
    root: { margin: margin },
    fieldGroup: { maxWidth: '100px' },
};
const togglesStyles: Partial<IToggleStyles> = { root: { margin } };

export interface ITeamMemberEditorDragDropStates {
    personaGroups: IMergedPersonaCustomedProps[];
    //items: IPersonaCustomedProps[];
    columns: IColumn[];
    //groups: IGroup[]
    canAddGroup: boolean,
    canAddPerson: boolean,
    canEditPerson: boolean,
    canDeletePerson: boolean,
    canSave: boolean,

    isAddingGroup: boolean,
    isAddingPersona: boolean,

    editingPerona: IPersonaCustomedProps,
    selectedGroup?: string,

    editingGroupName: string,

    uploadingImageUrl?: string,


    displayMessageBar: boolean,
    isUploadSuccess: boolean,
    messageBarText: string
}

export interface ITeamMemberEditorDragDropProps {
    manifestUrl: string
}
const emptyPersona: IPersonaCustomedProps = { name: "", role: "", thumbnail: undefined, linkText: undefined, linkUrl: undefined, link2Text: undefined, link2Url: undefined }
const colomnConfigs = buildColumns([emptyPersona]).map(
    e => Object.assign(e,
        { name: e.name == "role" ? "description" : e.name })
)


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


var selectedImage: File;

export class TeamMemberEditor extends React.Component<ITeamMemberEditorDragDropProps, ITeamMemberEditorDragDropStates> {
    private _selection: Selection;

    constructor(props: ITeamMemberEditorDragDropProps) {
        super(props);
        this.state = {
            personaGroups: [],
            columns: colomnConfigs,
            canAddGroup: true,
            canAddPerson: true,
            canDeletePerson: false,
            canEditPerson: false,
            canSave: false,
            isAddingGroup: false,
            isAddingPersona: false,
            editingPerona: Object.assign({}, emptyPersona),
            editingGroupName: "",
            selectedGroup: "",
            messageBarText: "",
            isUploadSuccess: true,
            displayMessageBar: false
        };
        this._selection = new Selection({ onSelectionChanged: () => { this.updateButtonStatus(); } });
        this.generateListItems()
    }

    private updateButtonStatus() {
        this.setState({
            canDeletePerson: this._selection.count == 1,
            canEditPerson: this._selection.count == 1
        })
    }

    private getItemAndGroups(e: IMergedPersonaCustomedProps[]) {
        const itms = e.flatMap(itm => itm.personas)
        const lengthList = [0].concat(e.map(st => st.personas.length))
        return {
            items: itms,
            groups: e.map(
                (itm, index) => {
                    return {
                        key: itm.role,
                        count: itm.personas.length,
                        startIndex: lengthList.slice(0, index + 1).reduce((a, b) => a + b),
                        name: itm.role
                    }
                }
            )
        }
    }

    private generateListItems() {
        fetchJsonWithProgress(this.props.manifestUrl).then(
            e => this.setState({ personaGroups: e })
        )
    }

    private onPersonasChanged() {
        this.setState({
            canSave: true
        })
    }

    public render(): JSX.Element {
        const { columns, personaGroups, canAddGroup, canAddPerson, canDeletePerson, canEditPerson, canSave } = this.state;
        return (
            <div style={{ height: "calc(100vh - 120px)", position: "relative" }}>
                <div style={{ width: "100%", overflowX: "hidden", height: "100%", overflowY: "auto" }}>
                    <DetailsList
                        groups={this.getItemAndGroups(personaGroups).groups}
                        setKey="name"
                        items={this.getItemAndGroups(personaGroups).items}
                        columns={columns}
                        selection={this._selection}
                        onRenderItemColumn={this._onRenderItemColumn}
                        styles={{ root: { width: "100%", overflowX: "hidden", height: "100%" } }} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, background: '#fff', width: "calc(100% - 24px)", borderTop: `1px solid ${theme.palette.neutralLight}` }}>
                    <NavigateShimmer />
                    <Stack horizontal tokens={{ childrenGap: 12 }} horizontalAlign="end" styles={{ root: { padding: 12 } }}>
                        {
                            this.state.displayMessageBar &&
                            <MessageBar
                                styles={{ root: { width: "inherit" } }}
                                messageBarType={this.state.isUploadSuccess ? MessageBarType.success : MessageBarType.error}
                                onDismiss={() => this.setState({ displayMessageBar: false })}>
                                {this.state.isUploadSuccess ?
                                    <span>{this.state.messageBarText}<Link href="/team" target="_blank">Visit team page</Link></span>
                                    : this.state.messageBarText}
                            </MessageBar>
                        }

                        <DefaultButton text="Add Group" iconProps={{ iconName: "AddGroup" }} disabled={!canAddGroup}
                            onClick={() => this._addGroupPopup()} />
                        <DefaultButton text="Add Person" iconProps={{ iconName: "AddFriend" }} disabled={!canAddPerson}
                            onClick={() => this._addPersonPopup()} />
                        {/* <DefaultButton text="Edit" iconProps={{ iconName: "Edit" }} disabled={!canEditPerson}
                            onClick={() => this._editPersonPopup()} /> */}
                        <DefaultButton text="Delete Person" iconProps={{ iconName: "Delete" }} disabled={!canDeletePerson} onClick={() => this._deletePersonConfirmed()} />
                        <PrimaryButton text="Save" iconProps={{ iconName: "Save" }} disabled={!canSave} onClick={() => this._saveConfirmed()} />
                    </Stack>
                </div>
                <Modal
                    isOpen={this.state.isAddingPersona}
                    onDismiss={() => this.setState({ isAddingPersona: false })}
                    isBlocking={true}>
                    <div className={contentStyles.header}>
                        <span>Add Person</span>
                        <IconButton styles={iconButtonStyles}
                            iconProps={{ iconName: "Cancel" }}
                            onClick={() => this.setState({ isAddingPersona: false })} />
                    </div>

                    <div className={contentStyles.body}>

                        <Separator />
                        <Stack horizontal>
                            <div>
                                <Text variant="mediumPlus" style={{ fontSize: 14, fontWeight: 600, paddingBottom: 2 }}>Group</Text>
                                <Text variant="mediumPlus" style={{ fontSize: 14, fontWeight: 600, paddingBottom: 2, color: theme.palette.themeDark }}>*</Text>
                                {this.state.isAddingPersona && <Dropdown
                                    options={this.getItemAndGroups(personaGroups).groups.map((e, idx) => { return { key: e.name, text: e.name } })}
                                    styles={{ root: { margin: '0 0 12px 0' } }}
                                    onChange={(e, option, index) => this.setState({ selectedGroup: option?.text })}
                                    selectedKey={this.state.selectedGroup} />}
                                <TextField label={"Name"} required
                                    iconProps={{ iconName: "NumberSymbol" }}
                                    defaultValue={this.state.editingPerona.name}
                                    onChange={
                                        (e, v) => this.setState(
                                            {
                                                editingPerona: Object.assign(
                                                    this.state.editingPerona,
                                                    { name: "" + v }
                                                )
                                            }
                                        )

                                    } />
                                <TextField label={"Description"} required
                                    iconProps={{ iconName: "List" }}
                                    defaultValue={this.state.editingPerona.role}
                                    onChange={
                                        (e, v) => this.setState(
                                            {
                                                editingPerona: Object.assign(
                                                    this.state.editingPerona,
                                                    { role: "" + v }
                                                )
                                            }
                                        )
                                    } />
                                <input
                                    ref="add-person-image-input"
                                    type='file'
                                    accept='image/*'
                                    style={{ display: 'none' }}
                                    onChange={(e) => this._userSelectedImage(e)}
                                />
                                <DefaultButton
                                    text="Select a photo"
                                    styles={{ root: { margin: '24px 0', width: "100%" } }}
                                    iconProps={{ iconName: "PictureFill" }}
                                    onClick={() => {
                                        let trueInput = ReactDOM.findDOMNode(this.refs['add-person-image-input']) as HTMLInputElement;
                                        trueInput.click();
                                    }}
                                />

                                <Stack horizontal tokens={{ childrenGap: 24 }}>
                                    <div style={{ width: 240 }}>
                                        <TextField label={"Link1 Text"}
                                            iconProps={{ iconName: "TouchPointer" }}
                                            defaultValue={this.state.editingPerona.linkText}
                                            onChange={
                                                (e, v) => this.setState(
                                                    {
                                                        editingPerona: Object.assign(
                                                            this.state.editingPerona,
                                                            { linkText: v }
                                                        )
                                                    }
                                                )
                                            } />
                                        <TextField label={"Link1 Url"}
                                            iconProps={{ iconName: "Link" }}
                                            defaultValue={this.state.editingPerona.linkUrl}
                                            onChange={
                                                (e, v) => this.setState(
                                                    {
                                                        editingPerona: Object.assign(
                                                            this.state.editingPerona,
                                                            { linkUrl: v }
                                                        )
                                                    }
                                                )
                                            } />
                                    </div>
                                    <div style={{ width: 240 }}>
                                        <TextField label={"Link2 Text"}
                                            iconProps={{ iconName: "TouchPointer" }}
                                            defaultValue={this.state.editingPerona.link2Text}
                                            onChange={
                                                (e, v) => this.setState(
                                                    {
                                                        editingPerona: Object.assign(
                                                            this.state.editingPerona,
                                                            { link2Text: v }
                                                        )
                                                    }
                                                )} />
                                        <TextField label={"Link2 Url"}
                                            iconProps={{ iconName: "Link" }}
                                            defaultValue={this.state.editingPerona.link2Url}
                                            onChange={
                                                (e, v) => this.setState(
                                                    {
                                                        editingPerona: Object.assign(
                                                            this.state.editingPerona,
                                                            { link2Url: v }
                                                        )
                                                    }
                                                )} />
                                    </div>
                                </Stack>

                            </div>
                            <div style={{ width: 240, marginLeft: 24 }}>
                                <RenderPersonaFromPersonaManifest_portrait e={this.state.editingPerona} isBase64Style />
                            </div>
                        </Stack>
                        <Separator />
                        <PrimaryButton text="Confirm" styles={{ root: { width: "100%" } }} onClick={() => this._addPersonConfirmed()} />
                    </div>
                </Modal>

                <Modal
                    titleAriaId={"Add Group"}
                    isOpen={this.state.isAddingGroup}
                    onDismiss={() => this.setState({ isAddingGroup: false })}
                    isBlocking={true} >
                    <div className={contentStyles.header}>
                        <span>Add Group</span>
                        <IconButton styles={iconButtonStyles}
                            iconProps={{ iconName: "Cancel" }}
                            onClick={() => this.setState({ isAddingGroup: false })} />
                    </div>

                    <div className={contentStyles.body}>
                        <Separator />
                        <TextField label={"Group Name"} required
                            iconProps={{ iconName: "Group" }}
                            defaultValue={this.state.editingGroupName}
                            onChange={
                                (e, v) => this.setState(
                                    {
                                        editingGroupName: "" + v
                                    }
                                )
                            } />
                        <Separator />
                        <PrimaryButton text="Confirm" styles={{ root: { width: "100%" } }} onClick={() => this._addGroupConfirmed()} />
                    </div>
                </Modal>


            </div >
        );
    }

    private _onRenderItemColumn = (item: IPersonaCustomedProps, index?: number, column?: IColumn): JSX.Element | string => {
        const key = column!.key as keyof IPersonaCustomedProps;
        if (key === 'name') {
            return <span style={{ color: theme.palette.themeDark, fontWeight: 600 }}>{item[key]}</span>;
        }
        if (item[key] == undefined) {
            return <span style={{ color: theme.palette.neutralQuaternaryAlt }}>undefined</span>;
        }
        return String(item[key]);
    };

    private _userSelectedImage(e: React.ChangeEvent<HTMLInputElement>) {
        var reader = new FileReader();
        if (e.currentTarget.files != null && e.currentTarget.files.length > 0) {

            selectedImage = e.currentTarget.files[0]
            reader.readAsDataURL(selectedImage)
            reader.onload = (e) => this.setState({
                editingPerona: Object.assign(
                    this.state.editingPerona,
                    { thumbnail: reader.result as string }
                )
            })
        }
    }

    private _addGroupPopup() {
        this.setState({ isAddingGroup: true, editingGroupName: "" })
    }

    private _addPersonPopup() {
        this.setState({ isAddingPersona: true, editingPerona: Object.assign({}, emptyPersona) })
    }

    private _deletePersonConfirmed() {
        var tmp = this.state.personaGroups.slice(0)
        let selectedItem = this.state.personaGroups.flatMap(e => e.personas)[this._selection.getSelectedIndices()[0]]
        var res = tmp.map(
            personaLists => {
                return {
                    role: personaLists.role,
                    personas: personaLists.personas.filter(__itm => (__itm.name != selectedItem.name || __itm.role != selectedItem.role))
                }
            }
        )
        this.setState({ personaGroups: res })
        this.onPersonasChanged()
    }

    private _saveConfirmed() {
        this.setState({ canSave: false })
        revealShimmer();
        uploadManifest(
            "personas",
            this.state.personaGroups,
            () => {
                hideShimmer();
                this.setState({ displayMessageBar: true, isUploadSuccess: true, messageBarText: "Teams updated successfully." });
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

    private _addGroupConfirmed() {
        let tmp = this.state.personaGroups.slice(0)
        tmp.push(
            { role: this.state.editingGroupName, personas: [] }
        )
        this.setState({ personaGroups: tmp, isAddingGroup: false })
        this.onPersonasChanged()
    }

    private _addPersonConfirmed() {
        if (this.state.editingPerona.name.length <= 0 || this.state.editingPerona.role.length <= 0) {
            alert("Name and description are required to have more than 0 characters.")
            return;
        }
        let newPersonaGroups = this.state.personaGroups
        if (newPersonaGroups.filter(e => e.role == this.state.selectedGroup).length > 0) {
            if (selectedImage != undefined && this.state.editingPerona.thumbnail != undefined) {
                const fileName = selectedImage.name
                revealShimmer()
                uploadPersona(selectedImage,
                    () => {
                        hideShimmer();
                        this.setState({ displayMessageBar: true, isUploadSuccess: true, messageBarText: "New avatar uploaded successfully." });
                        setTimeout(() => {
                            this.setState({ displayMessageBar: false });
                        }, 1000);
                    },
                    () => {
                        hideShimmer();
                        this.setState({ displayMessageBar: true, isUploadSuccess: false, messageBarText: "Error occured uploading the new avatar." });
                    }
                )
                const newEscapedPersona = Object.assign({}, this.state.editingPerona)
                newEscapedPersona.thumbnail = fileName
                newPersonaGroups.filter(e => e.role == this.state.selectedGroup)[0].personas.push(newEscapedPersona)
            } else {
                const newEscapedPersona = Object.assign({}, this.state.editingPerona)
                newEscapedPersona.thumbnail = undefined
                newPersonaGroups.filter(e => e.role == this.state.selectedGroup)[0].personas.push(newEscapedPersona)
            }
        }
        else {
            alert("Please select a group.")
            return;
        }

        this.setState({
            personaGroups: newPersonaGroups, isAddingPersona: false
        })
        this.onPersonasChanged()
    }
}

export interface ITeamEditorStates {

}

export interface ITeamEditorProps {

}

export class TeamEditor extends React.Component<ITeamEditorProps, ITeamEditorStates>{
    constructor(props: ITeamEditorProps) {
        super(props)
    }
    render() {
        return null
    }
}