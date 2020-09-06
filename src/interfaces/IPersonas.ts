export interface IPersonaCustomedProps {
    name: string,
    role: string,
    thumbnail?: string,
    imageInitials?: string,

    linkText?: string,
    linkUrl?: string,
    link2Text?: string,
    link2Url?: string
}

export interface IMergedPersonaCustomedProps {
    role: string,
    personas: IPersonaCustomedProps[]
}