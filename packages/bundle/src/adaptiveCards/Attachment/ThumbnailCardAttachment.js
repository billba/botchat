/* eslint no-magic-numbers: ["error", { "ignore": [25, 75] }] */

import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { hooks } from 'botframework-webchat-component';
import AdaptiveCardBuilder from './AdaptiveCardBuilder';
import AdaptiveCardRenderer from './AdaptiveCardRenderer';

const { useStyleOptions } = hooks;

const ThumbnailCardAttachment = ({ adaptiveCardHostConfig, adaptiveCards, attachment: { content } = {} }) => {
  const [styleOptions] = useStyleOptions();

  const builtCard = useMemo(() => {
    if (content) {
      const builder = new AdaptiveCardBuilder(adaptiveCards, styleOptions);
      const { TextSize, TextWeight } = adaptiveCards;
      const { buttons, images, subtitle, text, title } = content;
      const { richCardWrapTitle } = styleOptions;

      if (images && images.length) {
        const [firstColumn, lastColumn] = builder.addColumnSet([75, 25]);
        const [{ tap, url }] = images;

        builder.addTextBlock(
          title,
          { size: TextSize.Medium, weight: TextWeight.Bolder, wrap: richCardWrapTitle },
          firstColumn
        );

        builder.addTextBlock(subtitle, { isSubtle: true, wrap: richCardWrapTitle }, firstColumn);
        builder.addImage(url, lastColumn, tap);
        builder.addTextBlock(text, { wrap: true });
        builder.addButtons(buttons);
      } else {
        builder.addCommon(content);
      }
      return builder.card;
    }
  }, [adaptiveCards, content, styleOptions]);

  return (
    <AdaptiveCardRenderer
      adaptiveCard={builtCard}
      adaptiveCardHostConfig={adaptiveCardHostConfig}
      tapAction={content && content.tap}
    />
  );
};

ThumbnailCardAttachment.propTypes = {
  adaptiveCardHostConfig: PropTypes.any.isRequired,
  adaptiveCards: PropTypes.any.isRequired,
  attachment: PropTypes.shape({
    content: PropTypes.shape({
      buttons: PropTypes.array,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          tap: PropTypes.any,
          url: PropTypes.string.isRequired
        })
      ),
      subtitle: PropTypes.string,
      tap: PropTypes.any,
      text: PropTypes.string,
      title: PropTypes.string
    }).isRequired
  }).isRequired
};

export default ThumbnailCardAttachment;
