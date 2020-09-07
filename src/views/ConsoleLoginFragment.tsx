import React from 'react'
import { DesktopNavigation } from '../components/navigation/desktopNavigation'
import { resolveStaticImages } from '../configs/resources'
import { ResponsiveDiv } from '../components/responsive/ResponisveDiv'
import { Text, TextField, Button, PrimaryButton, Separator, MaskedTextField, Stack } from "@fluentui/react";
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
import { NavigateShimmer } from '../components/navigateShimmer';
import { revealShimmer, hideShimmer } from '../utils/fetchs/shimmerStatus';
import { ErrorMessageBar } from '../components/MessageBars/MessageBar';

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
    const [logEnabled, setLogEnabled] = React.useState<boolean>(true)
    const [isLoggingError, setIsLoggingError] = React.useState<boolean>(false)
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
                        <Stack style={{ maxWidth: 420 }} tokens={{ childrenGap: 12 }}>
                            <Text variant="superLarge" >Log In</Text>
                            <TextField label={"Username"}
                                required
                                iconProps={{ iconName: "AccountBrowser" }}
                                onChange={
                                    (e, v) => {
                                        if (v != undefined)
                                            setTypedUsername(v)
                                    }} />
                            <TextField label={"Password"} required
                                type={"password"}
                                iconProps={{ iconName: "Signin" }}
                                onChange={
                                    (e, v) => {
                                        if (v != undefined)
                                            setTypedPassword(v)
                                    }} />

                            <PrimaryButton text="Log In" styles={{ root: { width: "100%" }, }}
                                disabled={!((logEnabled) && (typedUsername.length > 0) && (typedPassword.length > 0))}
                                onClick={() => {
                                    if (typedPassword.length <= 0 || typedUsername.length <= 0) {
                                        alert("Username or password required.")
                                        return;
                                    }
                                    revealShimmer();
                                    setLogEnabled(false);
                                    validateToken(
                                        typedUsername,
                                        typedPassword,
                                        () => {
                                            setIsLogged(true);
                                            Cookies.set("username", typedUsername);
                                            Cookies.set("password", typedPassword);
                                            hideShimmer();
                                            setLogEnabled(false);
                                        },
                                        () => {
                                            setIsLoggingError(true)
                                            hideShimmer();
                                            setLogEnabled(true);
                                        }
                                    )
                                }} />
                            <div style={{ position: "relative", height: 3, width: "100%" }}>
                                <NavigateShimmer />
                            </div>
                            <div style={{ height: 32, width: "100%" }}>
                                {isLoggingError &&
                                    <ErrorMessageBar resetChoice={() => { setIsLoggingError(false) }}
                                        message="Log in error." />}
                            </div>
                        </Stack>
                    </div>
                </div>
            </ResponsiveDiv>
            <RoomForFootnot />
        </div>

}