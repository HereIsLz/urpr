import React from 'react';
import { Text } from '@fluentui/react'
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { UrprAbbr, UrprDesc, UrprSubAbbr } from '../configs/strings';
import { theme } from '../configs/theme';


export const UrprLogo: React.FC = () => {
    return <Text variant="xxLargePlus" aria-label={UrprDesc}
        onClick={() => { window.location.pathname = "/" }}
        style={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            color: theme.palette.neutralDark,
            fontWeight: 700,
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            cursor: 'pointer',
            fontSize: 36
            //fontFamily: "Josefin Sans",
            //fontFamily: "Product Sans"
        }}>
        {UrprSubAbbr}
    </Text>
}