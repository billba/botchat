/**
 * @jest-environment ./__tests__/html/__jest__/perTest/WebChatEnvironment.js
 */

describe('Avatar', () => {
  test('with undefined initials should not leave gutter space', () => runHTMLTest('avatar.undefinedInitials.html'));
});
