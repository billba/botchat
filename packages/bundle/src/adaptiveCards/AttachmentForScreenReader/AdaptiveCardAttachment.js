import { hooks } from 'botframework-webchat-component';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import useAdaptiveCardsPackage from '../hooks/useAdaptiveCardsPackage';
import useParseAdaptiveCardJSON from '../hooks/internal/useParseAdaptiveCardJSON';

const { useLocalizer } = hooks;

// Perform a depth-first search of the Adaptive Card tree.
function walkAllItems(node, fn) {
  fn(node);

  if (node.getItemAt && node.getItemCount) {
    for (let count = node.getItemCount(), index = 0; index < count; index++) {
      walkAllItems(node.getItemAt(index), fn);
    }
  }

  if (node.getActionAt && node.getActionCount) {
    for (let count = node.getActionCount(), index = 0; index < count; index++) {
      fn(node.getActionAt(index));
    }
  }
}

const AdaptiveCardAttachment = ({ content }) => {
  const localize = useLocalizer();
  const parseAdaptiveCardJSON = useParseAdaptiveCardJSON();
  const [
    {
      ChoiceSetInput,
      DateInput,
      NumberInput,
      OpenUrlAction,
      ShowCardAction,
      SubmitAction,
      TextInput,
      TimeInput,
      ToggleInput
    }
  ] = useAdaptiveCardsPackage();

  const card = useMemo(() => parseAdaptiveCardJSON(content, { ignoreErrors: true }), [content, parseAdaptiveCardJSON]);
  const inputs = useMemo(() => {
    const inputs = [];

    walkAllItems(card, node => {
      if (
        node instanceof ChoiceSetInput ||
        node instanceof DateInput ||
        node instanceof NumberInput ||
        node instanceof OpenUrlAction ||
        node instanceof ShowCardAction ||
        node instanceof SubmitAction ||
        node instanceof TextInput ||
        node instanceof TimeInput ||
        node instanceof ToggleInput
      ) {
        inputs.push(node);
      }
    });

    return inputs;
  }, [card]);

  const cardLabel = localize('ATTACHMENT_CARD', '', '', '');

  return (
    <div>
      <p>{cardLabel}</p>
      {inputs.map((input, index) =>
        input instanceof ChoiceSetInput ? (
          <label key={index}>
            {input.placeholder}
            <select defaultValue={input.value} tabIndex={-1}>
              {input.choices.map(choice => (
                <option key={choice.value} value={choice.value}>
                  {choice.title}
                </option>
              ))}
            </select>
          </label>
        ) : input instanceof DateInput ? (
          <label key={index}>
            {input.placeholder}
            <input tabIndex={-1} type="date" />
          </label>
        ) : input instanceof NumberInput ? (
          <label key={index}>
            {input.placeholder}
            <input tabIndex={-1} type="number" />
          </label>
        ) : input instanceof OpenUrlAction || input instanceof ShowCardAction || input instanceof SubmitAction ? (
          <button key={index} tabIndex={-1} type="button">
            {input.title}
          </button>
        ) : input instanceof TextInput ? (
          <label key={index}>
            {input.placeholder}
            <input tabIndex={-1} type="text" />
          </label>
        ) : input instanceof TimeInput ? (
          <label key={index}>
            {input.placeholder}
            <input tabIndex={-1} type="time" />
          </label>
        ) : input instanceof ToggleInput ? (
          <label key={index}>
            {input.title}
            <input defaultChecked={input.value === input.valueOn} tabIndex={-1} type="checkbox" />
          </label>
        ) : (
          false
        )
      )}
    </div>
  );
};

AdaptiveCardAttachment.propTypes = {
  content: PropTypes.any.isRequired
};

export default AdaptiveCardAttachment;
