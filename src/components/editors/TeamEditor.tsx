import React from 'react'

export interface ITeamEditorStates{

}

export interface ITeamEditorProps{

}

export class TeamEditor extends React.Component<ITeamEditorProps,ITeamEditorStates>{
    private teamEditorJsonUrl ="/personas.json"
    constructor(props:ITeamEditorProps){
        super(props)
        this.state={

        }
    }
}