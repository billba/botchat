/* eslint react/no-array-index-key: "off" */

import { Components, hooks } from 'botframework-webchat-component';
import PropTypes from 'prop-types';
import React from 'react';

import CommonCard from './CommonCard';

const { AudioContent } = Components;
const { useStyleSet } = hooks;

const AudioCardAttachment = ({
  adaptiveCardHostConfig,
  adaptiveCards,
  attachment,
  attachment: {
    content: { autostart = false, autoloop = false, image: { url: imageURL = '' } = {}, media = [] } = {}
  } = {}
}) => {
  const { audioCardAttachment: audioCardAttachmentStyleSet } = useStyleSet();

  return (
    <div className={audioCardAttachmentStyleSet}>
      <ul className="media-list">
        {media.map(({ url }, index) => (
          <li key={index}>
            <AudioContent autoPlay={autostart} loop={autoloop} poster={imageURL} src={url} />
          </li>
        ))}
      </ul>
      <CommonCard
        adaptiveCardHostConfig={adaptiveCardHostConfig}
        adaptiveCards={adaptiveCards}
        attachment={attachment}
      />
    </div>
  );
};

AudioCardAttachment.propTypes = {
  adaptiveCardHostConfig: PropTypes.any.isRequired,
  adaptiveCards: PropTypes.any.isRequired,
  attachment: PropTypes.shape({
    content: PropTypes.shape({
      autostart: PropTypes.bool,
      autoloop: PropTypes.bool,
      image: PropTypes.shape({
        url: PropTypes.string.isRequired
      }),
      media: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string.isRequired
        }).isRequired
      ).isRequired
    })
  }).isRequired
};

export default AudioCardAttachment;
