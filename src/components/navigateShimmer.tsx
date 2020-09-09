import React from 'react';
import { theme } from '../configs/theme';

interface INavigateShimmerProps {
    blocked?: boolean,
    specifiedId?: string
}

export const NavigateShimmer: React.FC<INavigateShimmerProps> = (props) => {
    return <svg className="not-shimmering" id={props.specifiedId ? props.specifiedId : "navigate-shimmer"} width="100%" height="3px" style={{ position: props.blocked ? "inherit" : "absolute", transition: "opacity 0.2s", zIndex: 10000, top: 0, width: '100%', height: 2 }}>
        <rect width="100%" height="3px" fill={theme.palette.neutralLighter} x="0" y="0" />
        <rect id="shimmer" width="60%" height="3px" fill={theme.palette.themePrimary} x="-60%" y="0" rx="1.5" ry="1.5">
            <animate attributeType="CSS" attributeName="x" from="-60%" to="100%" dur="0.9s" repeatCount="indefinite" />
        </rect>
    </svg>
}