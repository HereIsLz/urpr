import React from 'react'
import { Link, IGroup, Stack, PrimaryButton, DefaultButton } from '@fluentui/react';
import {
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
import { getTheme, mergeStyles } from 'office-ui-fabric-react/lib/Styling';
import { IPersonaCustomedProps, IMergedPersonaCustomedProps } from '../../interfaces/IPersonas';
import { fetchJsonWithProgress } from '../../utils/fetchs/fetchWithProgress';
import { count } from 'console';

interface ITeamPersonaEditorProps {
    oldPersona: IPersonaCustomedProps
}

interface ITeamPersonaEditorStates {
    newPersona: IPersonaCustomedProps
}

export class TeamPersonaEditor extends React.Component<ITeamPersonaEditorProps, ITeamPersonaEditorStates>{
    constructor(props: ITeamPersonaEditorProps) {
        super(props)
        this.state = {
            newPersona: props.oldPersona
        }
    }
    render() {
        return <Stack tokens={{ childrenGap: 12 }}>
            <TextField label={"Name"} />
            <TextField label={"Description"} />
            <TextField label={"Link1 Text"} />
            <TextField label={"Link1 Url"} />
            <TextField label={"Link2 Text"} />
            <TextField label={"Link2 Url"} />
        </Stack>
    }
}