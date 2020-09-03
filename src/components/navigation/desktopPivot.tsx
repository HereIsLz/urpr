import React from "react";
import { Pivot, PivotItem } from "@fluentui/react";
import { UrprAbbr, UrprZh } from "../../configs/strings";
import { IManifestItem } from "../../interfaces/IManifestItem";
import { NAVIGATION_LAYOUT } from "./_layout";

export interface IPivotItemStates {
    selectedPivotKey?: string
}

export interface IPivotItemProps {
    manifest: IManifestItem[]
    defaultSelectedPivotKey?: string
}

export class DesktopPivot extends React.Component<IPivotItemProps, IPivotItemStates> {
    constructor(props: IPivotItemProps) {
        super(props);
        this.state = {
            selectedPivotKey: props.defaultSelectedPivotKey
        }
    }
    private _pivotItems(manifest: IManifestItem[]) {
        var res: JSX.Element[] = [];
        manifest.forEach(
            st => res.push(<PivotItem headerText={st.name} key={st.route} itemKey={st.route} />)
        )
        return res
    }

    render() {
        return (
            <Pivot aria-label={`${UrprAbbr} - ${UrprZh}`} selectedKey={this.state.selectedPivotKey}
                onLinkClick={
                    (item) => {
                        if (item?.props.itemKey?.startsWith("http")) {
                            window.open(item?.props.itemKey, '_blank')
                            return;
                        }
                        this.setState({ selectedPivotKey: item?.props.itemKey })
                        window.location.href = item?.props.itemKey ? item?.props.itemKey : ""
                    }
                }
                styles={{
                    root: { height: NAVIGATION_LAYOUT.height },
                    link: { height: NAVIGATION_LAYOUT.height },
                    linkIsSelected: { height: NAVIGATION_LAYOUT.height },
                    linkContent: { minWidth: NAVIGATION_LAYOUT.linkMinWidth, fontSize: NAVIGATION_LAYOUT.linkTextSize, textRendering: "legibility" }
                }}>
                {this._pivotItems(this.props.manifest)}
            </Pivot>
        )
    }
}