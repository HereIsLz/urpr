import { createTheme } from "office-ui-fabric-react";

export const AccentFont = "Product Sans"

export const AccentColors = createTheme({
    palette: {
        themePrimary: '#d13438',
        themeLighterAlt: '#fdf6f6',
        themeLighter: '#f8dadb',
        themeLight: '#f1bbbd',
        themeTertiary: '#e37d81',
        themeSecondary: '#d7494e',
        themeDarkAlt: '#bc2f34',
        themeDark: '#9f282c',
        themeDarker: '#751d20',
        neutralLighterAlt: '#f8f8f8',
        neutralLighter: '#f4f4f4',
        neutralLight: '#eaeaea',
        neutralQuaternaryAlt: '#dadada',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c8c8',
        neutralTertiary: '#a19f9d',
        neutralSecondary: '#605e5c',
        neutralPrimaryAlt: '#3b3a39',
        neutralPrimary: '#323130',
        neutralDark: '#201f1e',
        black: '#000000',
        white: '#ffffff',
    },
    fonts: {
        xxLarge: { fontFamily: AccentFont },
        xxLargePlus: { fontFamily: AccentFont },
        superLarge: { fontFamily: AccentFont },
        mega: { fontFamily: AccentFont },
    },
    defaultFontStyle: { fontFamily: 'Product Sans, Roboto, Inter, 思源黑体 CN, -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif' },

});

export const theme = createTheme(AccentColors);