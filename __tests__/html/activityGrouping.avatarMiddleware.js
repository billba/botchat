/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('activity grouping', () => {
  test('should not break avatar middleware', () =>
    runHTMLTest('activityGrouping.avatarMiddleware.html', {
      height: 1280
    }));
});
