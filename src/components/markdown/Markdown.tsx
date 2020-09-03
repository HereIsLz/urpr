import React from 'react';
import { markdownHtmlParser } from './MarkdownHtmlParser';
import { Stack } from 'office-ui-fabric-react';
import { Shimmer, ShimmerElementType, IShimmerElement, IShimmerStyles } from 'office-ui-fabric-react/lib/Shimmer';
import { useViewport } from '../../utils/hooks/useViewport';
import { breakpointTiny } from '../../configs/dimens';

export interface IMarkdownProps {
    unparsedContentString?: string
}

const shimmerStyle: IShimmerStyles = {
    root: { height: 24 },
    shimmerWrapper: { height: '100%' }
}

export interface IAutoAdjustMarkdownContainerProps {
    innerHtml: string
}

export const AutoAdjustMarkdownContainer: React.FC<IAutoAdjustMarkdownContainerProps> = (props) => {
    const { width } = useViewport();
    return <div dangerouslySetInnerHTML={{ __html: markdownHtmlParser.render(props.innerHtml) }}
        style={{ width: '100%', textAlign: width > breakpointTiny ? "justify" : "inherit" }}
        className="urpr-markdown"
    />
}

export class Markdown extends React.Component<IMarkdownProps, {}>{
    constructor(props: IMarkdownProps) {
        super(props)
    }

    render() {
        return this.props.unparsedContentString ? <div>
            <AutoAdjustMarkdownContainer innerHtml={this.props.unparsedContentString} />
        </div>
            : <Stack tokens={{ childrenGap: 24 }}>
                <Shimmer styles={{ root: { height: 48 }, shimmerWrapper: { height: '100%' } }} width="40%" />
                <Shimmer styles={shimmerStyle} />
                <Shimmer styles={shimmerStyle} />
                <Shimmer styles={shimmerStyle} />
                <Shimmer styles={shimmerStyle} width="80%" />
            </Stack>
    }
}