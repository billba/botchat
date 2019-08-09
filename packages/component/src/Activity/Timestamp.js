import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import connectToWebChat from '../connectToWebChat';
import AbsoluteTime from '../Utils/AbsoluteTime';
import RelativeTime from '../Utils/RelativeTime';

const Timestamp = ({ activity: { timestamp }, className, styleSet }) => (
  <span className={classNames(styleSet.timestamp + '', (className || '') + '')}>
    {styleSet.options.timestampConfig === 'relative' ? (
      <RelativeTime value={timestamp} />
    ) : (
      <AbsoluteTime value={timestamp} />
    )}
  </span>
);

Timestamp.defaultProps = {
  className: ''
};

Timestamp.propTypes = {
  activity: PropTypes.shape({
    timestamp: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string,
  styleSet: PropTypes.shape({
    timestamp: PropTypes.any.isRequired
  }).isRequired
};

export default connectToWebChat(({ styleSet }) => ({ styleSet }))(Timestamp);
