import React from 'react'
import ReactDOM from 'react-dom'
import { Link, IGroup, Stack, PrimaryButton, DefaultButton, Modal, IconButton, Separator, Button, Dropdown, MessageBar, MessageBarType, DatePicker } from '@fluentui/react';
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
    bgImageName?: string
    canSave: boolean
}

export class BannerEditor extends React.Component<IBannerEditorProps, IBannerEditorStates>{
    constructor(props: IBannerEditorProps) {
        super(props);
        this.state = {
            heroText: "",
            heroText2: "",
            description: "",
            canSave: false
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
                        bgImageName: resourceToUpload.name
                    })
                    alert("Background image uploaded.")
                },
                () => {
                    hideShimmer();
                    alert("Unknown error occured uploading background image.")
                })
        }
    }

    render() {
        return <div>
            <Stack tokens={{ childrenGap: 12 }}>
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
                <TextField label={"Description"} required rows={10} multiline value={this.state.description} 
                    onChange={(ev, str) => {
                        if (str) this.setState({
                            description: str,
                            canSave: true
                        })
                    }} />
                <input
                    ref="upload-background-image"
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={(e) => this._uploadBackgroundResource(e)}
                />
                <div style={{ width: "100%", height: 3, position: "relative" }}>
                    <NavigateShimmer />
                </div>
                <Stack horizontal horizontalAlign="end" tokens={{ childrenGap: 12 }}>
                    <DefaultButton
                        iconProps={{ iconName: "PictureFill" }}
                        text="Upload Background Image"
                        onClick={() => {
                            let trueInput = ReactDOM.findDOMNode(this.refs['upload-background-image']) as HTMLInputElement;
                            trueInput.click();
                        }} />
                    <PrimaryButton iconProps={{ iconName: "Save" }} text="Save"
                        disabled={!this.state.canSave}
                        onClick={() => {
                            revealShimmer();
                            this.setState({ canSave: false })
                            let newBanner: IIndexFragmentStaticProps = { ...this.state }
                            uploadManifest("banner", newBanner,
                                () => {
                                    hideShimmer();
                                    
                                    alert("Banner configs saved successfully.")
                                },
                                () => {
                                    hideShimmer();
                                    this.setState({ canSave: true })
                                    
                                    alert("Failed saving banner configs. Retry or refresh.")
                                })
                        }}
                    />
                </Stack>
            </Stack>
        </div>
    }
}