/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('useObserveScrollPosition', () => {
  test('should observe scroll position changes', () => runHTMLTest('hooks.useObserveScrollPosition.html'));
});
