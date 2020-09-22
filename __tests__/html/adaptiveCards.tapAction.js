/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('Adaptive Cards', () => {
  test('with "tapAction" prop should react to click, ENTER, and SPACEBAR', () =>
    runHTMLTest('adaptiveCards.tapAction.html'));
});
