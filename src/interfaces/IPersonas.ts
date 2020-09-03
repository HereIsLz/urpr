export interface IPersonaCustomedProps {
    thumbnail?: string,
    imageInitials: string,
    name: string,
    role: string,
    linkText?: string,
    linkUrl?: string,
    link2Text?: string,
    link2Url?: string
}

export interface IMergedPersonaCustomedProps {
    role: string,
    personas: IPersonaCustomedProps[]
}