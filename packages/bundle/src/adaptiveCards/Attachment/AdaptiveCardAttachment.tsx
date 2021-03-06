import { DirectLineAttachment } from 'botframework-webchat-core';
import PropTypes from 'prop-types';
import React, { FC } from 'react';

import AdaptiveCardContent from './AdaptiveCardContent';

type AdaptiveCardAttachmentProps = {
  attachment: DirectLineAttachment;
  disabled?: boolean;
};

const AdaptiveCardAttachment: FC<AdaptiveCardAttachmentProps> = ({ attachment: { content }, disabled }) => (
  <AdaptiveCardContent content={content} disabled={disabled} />
);

export default AdaptiveCardAttachment;

AdaptiveCardAttachment.defaultProps = {
  disabled: undefined
};

AdaptiveCardAttachment.propTypes = {
  attachment: PropTypes.shape({
    content: PropTypes.any.isRequired
  }).isRequired,
  disabled: PropTypes.bool
};
