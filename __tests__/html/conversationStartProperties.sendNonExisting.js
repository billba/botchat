/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('conversationStartProperties', () => {
  test('with non-existing locale should get "Hello and welcome!" message.', () =>
    runHTMLTest('conversationStartProperties.sendNonExisting.html'));
});
