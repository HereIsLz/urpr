import React from 'react'
import { DesktopNavigation } from '../components/navigation/desktopNavigation'
import { resolveStaticImages } from '../configs/resources'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text, TextField, Button, PrimaryButton, Separator, MaskedTextField } from "@fluentui/react";
import { UrprFull, UrprDetail } from '../configs/strings';
import { theme } from '../configs/theme';
import { useViewport } from '../utils/hooks/useViewport';
import { breakpointMedium, breakpointLarge } from '../configs/dimens';
import { StretchableGrid } from '../components/stretchableGrid/StreachableGrid';
import { NAVIGATION_LAYOUT } from '../components/navigation/_layout';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { StretchablePersonaGrid } from '../components/stretchableGrid/StrechablePersonaGrid';
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import { RoomForFootnot } from '../components/footnote/RoomForFootnote';
import { ConsoleNavigation } from '../components/navigation/ConsoleNavigation';
import { ConsoleFragment } from './ConsoleFragment';
import { validateToken } from '../utils/apis/apis';
import Cookies from 'js-cookie'

const navigatePlaceHolderStyle: React.CSSProperties = {
    width: "100%",
    height: NAVIGATION_LAYOUT.height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    msUserSelect: 'none',
}


export const ConsoleLoginFragment: React.FC = () => {
    return <div>
        <div style={navigatePlaceHolderStyle}>
            <ConsoleNavigation isLogged />
        </div>
        <ResponsiveDiv>
            <div style={{ minHeight: "60vh", width: "100%", display: "table" }}>
                <div style={{ width: "100%", display: "table-cell", verticalAlign: "middle" }}>
                    <div style={{ maxWidth: 420 }}>
                        <Text variant="superLarge" style={{ lineHeight: "120px" }}>Log In</Text>

                        <TextField label={"Username"} />
                        <MaskedTextField label={"Password"} maskChar="/[a-zA-Z0-9]/" />
                        <Separator />
                        <PrimaryButton text="Log In" styles={{ root: { width: "100%" }, }} />
                    </div>
                </div>
            </div>
        </ResponsiveDiv>
        <RoomForFootnot />
    </div>
}



export const ConsoleWrappedFragment: React.FC = () => {
    const [isLogged, setIsLogged] = React.useState<boolean>(false)
    const [typedPassword, setTypedPassword] = React.useState<string>("")
    const [typedUsername, setTypedUsername] = React.useState<string>("")

    return isLogged ? <ConsoleFragment username={typedUsername} password={typedPassword} />
        : <div>
            <div style={navigatePlaceHolderStyle}>
                <ConsoleNavigation isLogged />
            </div>
            <ResponsiveDiv>
                <div style={{ minHeight: "60vh", width: "100%", display: "table" }}>
                    <div style={{ width: "100%", display: "table-cell", verticalAlign: "middle" }}>
                        <div style={{ maxWidth: 420 }}>
                            <Text variant="superLarge" style={{ lineHeight: "120px" }}>Log In</Text>

                            <TextField label={"Username"} required
                                iconProps={{ iconName: "AccountBrowser" }}
                                onChange={
                                    (e, v) => {
                                        if (v != undefined)
                                            setTypedUsername(v)
                                    }} />
                            <TextField label={"Password"} required
                                iconProps={{ iconName: "Signin" }}
                                onChange={
                                    (e, v) => {
                                        if (v != undefined)
                                            setTypedPassword(v)
                                    }} />
                            <Separator />
                            <PrimaryButton text="Log In" styles={{ root: { width: "100%" }, }}
                                onClick={() => {
                                    if (typedPassword.length <= 0 || typedUsername.length <= 0) {
                                        alert("Username or password required.")
                                    }
                                    validateToken(
                                        typedUsername,
                                        typedPassword,
                                        () => {
                                            setIsLogged(true);
                                            alert("Log in succ.");
                                            Cookies.set("username", typedUsername);
                                            Cookies.set("password", typedPassword);
                                        },
                                        () => { alert("Log in failed.") }
                                    )
                                }} />
                        </div>
                    </div>
                </div>
            </ResponsiveDiv>
            <RoomForFootnot />
        </div>

}