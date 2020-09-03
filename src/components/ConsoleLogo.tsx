import React from 'react';
import { Text } from '@fluentui/react'
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';
import { UrprAbbr, UrprDesc } from '../configs/strings';
import { theme } from '../configs/theme';


export const UrprConsoleLogo: React.FC = () => {
    return <Text variant="xxLarge" aria-label={UrprDesc}
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
            cursor: 'pointer'
        }}>
        {UrprAbbr}
        <Text variant="xxLarge" style={{
            alignItems: 'center',
            display: 'flex',
            height: '100%',
            justifyContent: 'center',
            color: theme.palette.neutralDark,
            fontWeight: 400,
            KhtmlUserSelect: 'none',
            MozUserSelect: 'none',
            WebkitUserSelect: 'none',
            userSelect: 'none',
            cursor: 'pointer'
        }}>&nbsp;Console</Text>
    </Text>
}