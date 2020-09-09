import React from "react"
import { fetchJsonWithProgress } from "../../utils/fetchs/fetchWithProgress"
import { Stack, Text, TextField, PrimaryButton, MessageBar, MessageBarType } from "@fluentui/react"
import { revealShimmer, hideShimmer } from "../../utils/fetchs/shimmerStatus"
import { uploadManifest } from "../../utils/apis/apis"
import { NavigateShimmer } from "../navigateShimmer"
import { theme } from "../../configs/theme"

interface IInforEditorProps {

}
interface IInforEditorStates {
    getInvolvedMarkdown: string,
    isSucc: boolean,
    showMessageBar: boolean,
    canSave: boolean
}

export class InfoEditor extends React.Component<IInforEditorProps, IInforEditorStates>{
    constructor(props: IInforEditorProps) {
        super(props)
        this.state = {
            getInvolvedMarkdown: "",
            isSucc: true,
            showMessageBar: false,
            canSave: false
        }
        fetchJsonWithProgress("/others.json").then(e => this.setState({ getInvolvedMarkdown: e.getInvolvedMarkdown }))
    }

    render() {
        return <div style={{ borderBottom: `1px solid ${theme.palette.neutralLight}`, width: "calc(100% - 24px)", padding: 12 }}>
            <Stack horizontal tokens={{ childrenGap: 12 }} styles={{ root: { marginBottom: -12 } }} verticalAlign="center" horizontalAlign="space-between">
                <Text block variant="mediumPlus" style={{ fontSize: 14, fontWeight: 600, }}>Get Involved (Markdown Supported)</Text>
                {this.state.showMessageBar && <MessageBar
                    styles={{ root: { maxWidth: 640 } }}
                    messageBarType={this.state.isSucc ? MessageBarType.success : MessageBarType.error}
                    onDismiss={() => this.setState({ showMessageBar: false })}>
                    {this.state.isSucc ? <span><i>Get Involved</i>Updated</span> : "Error"}
                </MessageBar>}
                <PrimaryButton text="Save" iconProps={{ iconName: "Save" }} disabled={!this.state.canSave}
                    onClick={() => {
                        revealShimmer("get-involved-string-shimmer")
                        this.setState({
                            canSave: false,
                        })
                        uploadManifest("others",
                            { getInvolvedMarkdown: this.state.getInvolvedMarkdown },
                            () => {
                                hideShimmer("get-involved-string-shimmer")
                                this.setState({
                                    showMessageBar: true,
                                    isSucc: true,
                                })
                            },
                            () => {
                                hideShimmer("get-involved-string-shimmer")
                                this.setState({
                                    showMessageBar: true,
                                    isSucc: false,
                                    canSave: true
                                })
                            }
                        )
                    }} />
            </Stack>
            <NavigateShimmer blocked specifiedId="get-involved-string-shimmer" />
            <TextField value={this.state.getInvolvedMarkdown} onChange={(ev, str) => { if (str) this.setState({ getInvolvedMarkdown: str, canSave: true }) }} styles={{ root: { width: "100%" } }} multiline rows={3} />
        </div >
    }
}