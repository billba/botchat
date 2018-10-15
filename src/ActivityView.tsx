import { Activity, Attachment, AttachmentLayout } from 'botframework-directlinejs';
import * as React from 'react';
import { AttachmentView } from './Attachment';
import { Carousel } from './Carousel';
import { IDoCardAction } from './Chat';
import { DatePickerCard } from './DatePickerCard';
import { FileUploadCard } from './FileUploadCard';
import { FormattedText } from './FormattedText';
import { FormatState, SizeState } from './Store';

const Attachments = (props: {
    attachments: Attachment[],
    attachmentLayout: AttachmentLayout,
    format: FormatState,
    size: SizeState,
    onCardAction: IDoCardAction,
    onImageLoad: () => void
}) => {
    const { attachments, attachmentLayout, ...otherProps } = props;
    if (!attachments || attachments.length === 0) {
        return null;
    }
    return attachmentLayout === 'carousel' ?
        <Carousel
            attachments={ attachments }
            { ...otherProps }
        />
    :
        <div className="wc-list">
            { attachments.map((attachment, index) =>
                <AttachmentView
                    key={ index }
                    attachment={ attachment }
                    format={ props.format }
                    onCardAction={ props.onCardAction }
                    onImageLoad={ props.onImageLoad }
                />
            ) }
        </div>;
};

export interface ActivityViewProps {
    format: FormatState;
    size: SizeState;
    activity: Activity;
    type?: string;
    onCardAction: IDoCardAction;
    onImageLoad: () => void;
}

export class ActivityView extends React.Component<ActivityViewProps, {}> {
    constructor(props: ActivityViewProps) {
        super(props);
    }

    shouldComponentUpdate(nextProps: ActivityViewProps) {
        // if the activity changed, re-render
        return this.props.activity !== nextProps.activity
        // if the format changed, re-render
            || this.props.format !== nextProps.format
        // if it's a carousel and the size changed, re-render
            || (this.props.activity.type === 'message'
                && this.props.activity.attachmentLayout === 'carousel'
                && this.props.size !== nextProps.size);
    }

    render() {
        const { activity, type, ...props } = this.props;

        if (type === 'message' && activity.type === 'message') {
            return (
                <div>
                    <FormattedText
                        text={ activity.text }
                        format={ activity.textFormat }
                        onImageLoad={ props.onImageLoad }
                    />
                    <Attachments
                        attachments={ activity.attachments }
                        attachmentLayout={ activity.attachmentLayout }
                        format={ props.format }
                        onCardAction={ props.onCardAction }
                        onImageLoad={ props.onImageLoad }
                        size={ props.size }
                    />
                </div>
            );
        } else if (activity.type === 'typing') {
            return <div className="wc-typing"/>;
        } else if (type === 'date' || type === 'handoff') {
            const activityCopy: any = activity;
            return (
                <DatePickerCard { ...props } node={activityCopy.entities[0]} />
            );
        } else if (type === 'file') {
            console.log('ActivityViee');
            const activityCopy: any = activity;
            return (
                <FileUploadCard { ...props } node={activityCopy.entities[0]} />
            );
        }
    }
}
