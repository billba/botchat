import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import AbsoluteTime from '../Utils/AbsoluteTime';
import RelativeTime from '../Utils/RelativeTime';
import useStyleOptions from '../hooks/useStyleOptions';
import useStyleSet from '../hooks/useStyleSet';

const Timestamp = ({ activity: { timestamp }, className }) => {
  const [{ timestampFormat }] = useStyleOptions();
  const [{ timestamp: timestampStyleSet }] = useStyleSet();

  return (
    !!timestamp && (
      <span className={classNames(timestampStyleSet + '', (className || '') + '')}>
        {timestampFormat === 'relative' ? <RelativeTime value={timestamp} /> : <AbsoluteTime value={timestamp} />}
      </span>
    )
  );
};

Timestamp.defaultProps = {
  className: ''
};

Timestamp.propTypes = {
  activity: PropTypes.shape({
    timestamp: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string
};

export default Timestamp;