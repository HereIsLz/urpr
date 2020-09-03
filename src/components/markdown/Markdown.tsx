import React from 'react';
import { markdownHtmlParser } from './MarkdownHtmlParser';
import { Stack } from 'office-ui-fabric-react';
import { Shimmer, ShimmerElementType, IShimmerElement, IShimmerStyles } from 'office-ui-fabric-react/lib/Shimmer';

export interface IMarkdownProps {
    unparsedContentString?: string
}

const shimmerStyle: IShimmerStyles = {
    root: { height: 24 },
    shimmerWrapper: { height: '100%' }
}

export class Markdown extends React.Component<IMarkdownProps, {}>{
    constructor(props: IMarkdownProps) {
        super(props)
    }

    render() {
        return this.props.unparsedContentString ? <div>
            <div dangerouslySetInnerHTML={{ __html: markdownHtmlParser.render(this.props.unparsedContentString) }}
                style={{ width: '100%' }}
                className="urpr-markdown" />
        </div>
            : <Stack tokens={{ childrenGap: 16 }}>
                <Shimmer styles={{ root: { height: 48 }, shimmerWrapper: { height: '100%' } }} width="40%" />
                <Shimmer styles={shimmerStyle} />
                <Shimmer styles={shimmerStyle} />
                <Shimmer styles={shimmerStyle} />
                <Shimmer styles={shimmerStyle} width="80%" />
            </Stack>
    }
}