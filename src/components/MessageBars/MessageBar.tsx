import * as React from 'react';
import {
    MessageBarButton,
    Link,
    Stack,
    StackItem,
    MessageBar,
    MessageBarType,
    ChoiceGroup,
    IStackProps,
} from 'office-ui-fabric-react';

interface IMessageBarProps {
    message: string,
    resetChoice: () => void
}

export const ErrorMessageBar = (p: IMessageBarProps) => (
    <MessageBar
        messageBarType={MessageBarType.error}
        isMultiline={false}
        onDismiss={p.resetChoice}
        dismissButtonAriaLabel="Close"
    >
        {p.message}
    </MessageBar>
);

export const SuccessMessageBar = (p: IMessageBarProps) => (
    <MessageBar
        actions={
            <div>
                <MessageBarButton>Yes</MessageBarButton>
                <MessageBarButton>No</MessageBarButton>
            </div>
        }
        messageBarType={MessageBarType.success}
        isMultiline={false}
        onDismiss={p.resetChoice}
        dismissButtonAriaLabel="Close"
    >
        {p.message}
        <Link href="/" target="_blank">
            Visit website.
        </Link>
    </MessageBar>
);