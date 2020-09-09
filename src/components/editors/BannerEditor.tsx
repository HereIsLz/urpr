import React from 'react'
import ReactDOM from 'react-dom'
import { Link, Text, IGroup, Stack, PrimaryButton, DefaultButton, Modal, IconButton, Separator, Button, Dropdown, MessageBar, MessageBarType, DatePicker, MessageBarBase, ColorPicker } from '@fluentui/react';
import { DetailsList, Selection, IColumn, buildColumns, IColumnReorderOptions, IDragDropEvents, IDragDropContext } from '@fluentui/react';
import { TextField, ITextFieldStyles } from 'office-ui-fabric-react/lib/TextField';
import { Toggle, IToggleStyles } from 'office-ui-fabric-react/lib/Toggle';
import { getTheme, mergeStyles, mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { IPersonaCustomedProps, IMergedPersonaCustomedProps } from '../../interfaces/IPersonas';
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress';
import { count } from 'console';
import { theme } from '../../configs/theme';
import { uploadPersona, uploadPersonasManifest, uploadManifest, uploadOpenResource, uploadPageThumbnail } from '../../utils/apis/apis';
import { IOpendataItem } from '../../interfaces/IOpendata';
import { NavigateShimmer } from '../navigateShimmer';
import { revealShimmer, hideShimmer } from '../../utils/fetchs/shimmerStatus';
import { IIndexFragmentStaticProps } from '../../views/IndexFragment';

interface IBannerEditorProps {
    manifestUrl?: string
}

interface IBannerEditorStates {
    heroText: string,
    heroText2: string,
    description: string,
    bgImageName?: string,
    canSave: boolean,
    displayMessage: boolean,
    isSucc: boolean,
    message: string,
    color?: string,
}

export class BannerEditor extends React.Component<IBannerEditorProps, IBannerEditorStates>{
    constructor(props: IBannerEditorProps) {
        super(props);
        this.state = {
            heroText: "",
            heroText2: "",
            description: "",
            canSave: false,
            displayMessage: false,
            isSucc: true,
            message: ""
        }
        this.updateBannerConfigs(this.props.manifestUrl ? this.props.manifestUrl : "/banner.json");
    }

    private updateBannerConfigs(manifestUrl: string) {
        fetchJsonWithProgress(manifestUrl).then(st => this.setState({ ...st }))
    }

    private _uploadBackgroundResource(e: React.ChangeEvent<HTMLInputElement>) {
        var reader = new FileReader();
        if (e.currentTarget.files != null && e.currentTarget.files.length > 0) {

            let resourceToUpload = e.currentTarget.files[0]
            revealShimmer();
            uploadPageThumbnail(resourceToUpload,
                () => {
                    hideShimmer();
                    this.setState({
                        canSave: true,
                        bgImageName: resourceToUpload.name,
                        displayMessage: true,
                        isSucc: true,
                        message: "Background image uploaded successfully."
                    })
                },
                () => {
                    hideShimmer();
                    this.setState({
                        displayMessage: true,
                        isSucc: false,
                        message: "Unknown error occured uploading background image."
                    })
                })
        }
    }

    render() {
        return <div style={{ paddingTop: 12 }}>
            <Stack tokens={{ childrenGap: 12 }}>
                <Stack tokens={{ childrenGap: 24 }} horizontal>
                    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { width: "-webkit-fill-available" } }}>
                        <TextField label={"Hero Text"} required value={this.state.heroText}
                            onChange={(ev, str) => {
                                if (str) this.setState({
                                    heroText: str,
                                    canSave: true
                                })
                            }} />
                        <TextField label={"Hero Text 2"} required value={this.state.heroText2}
                            onChange={(ev, str) => {
                                if (str) this.setState({
                                    heroText2: str,
                                    canSave: true
                                })
                            }} />
                        <TextField label={"Description"} required rows={16} multiline value={this.state.description}
                            onChange={(ev, str) => {
                                if (str) this.setState({
                                    description: str,
                                    canSave: true
                                })
                            }} />
                    </Stack>
                    <Stack tokens={{ childrenGap: 12 }}>
                        <Text variant="mediumPlus" style={{ fontSize: 14, fontWeight: 600, paddingBottom: 2 }}>Text Color</Text>
                        <ColorPicker color={this.state.color ? this.state.color : theme.palette.neutralDark} showPreview={true}
                            onChange={
                                (ev, cl) => {
                                    this.setState({
                                        color: cl.str,
                                        canSave: true
                                    })
                                }
                            }
                            styles={{ root: { marginTop: -10, selectors: { ">div": { padding: 0 } } } }} />
                        <Text variant="mediumPlus" style={{ fontSize: 14, fontWeight: 600, paddingBottom: 2, paddingTop: 12 }}>Background Image</Text>
                        <DefaultButton
                            iconProps={{ iconName: "PictureFill" }}
                            text="Upload"
                            onClick={() => {
                                let trueInput = ReactDOM.findDOMNode(this.refs['upload-background-image']) as HTMLInputElement;
                                trueInput.click();
                            }} />
                    </Stack>
                </Stack>
                <input
                    ref="upload-background-image"
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={(e) => this._uploadBackgroundResource(e)}
                />
                <Separator />
                <NavigateShimmer blocked />
                <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 12 }}>
                    {this.state.displayMessage && <MessageBar messageBarType={
                        this.state.isSucc ? MessageBarType.success : MessageBarType.error}
                        onDismiss={() => this.setState({ displayMessage: false })}
                        styles={{ root: { maxWidth: 600 } }}  >
                        {this.state.message}
                    </MessageBar>}
                    <PrimaryButton iconProps={{ iconName: "Save" }} text="Save"
                        disabled={!this.state.canSave}
                        onClick={() => {
                            revealShimmer();
                            this.setState({ canSave: false })
                            let newBanner: IIndexFragmentStaticProps = {
                                heroText: this.state.heroText,
                                heroText2: this.state.heroText2,
                                description: this.state.description,
                                bgImageName: this.state.bgImageName,
                                color: this.state.color
                            }
                            uploadManifest("banner", newBanner,
                                () => {
                                    hideShimmer();
                                    this.setState({
                                        displayMessage: true,
                                        isSucc: true,
                                        message: "Banner configs saved successfully."
                                    })
                                    setTimeout(() => {
                                        this.setState({ displayMessage: false })
                                    }, 2000);
                                },
                                () => {
                                    hideShimmer();
                                    this.setState({
                                        canSave: true,
                                        displayMessage: true,
                                        isSucc: false,
                                        message: "Failed saving banner configs."
                                    })
                                })
                        }}
                    />
                </Stack>
            </Stack>
        </div>
    }
}