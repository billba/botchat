/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('toast', () => {
  test('should have valid aria-labelled-by.', () => runHTMLTest('toast.accessibility.html'));
});
