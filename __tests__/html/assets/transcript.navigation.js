const {
  WebChatTest: { conditions, elements, timeouts }
} = window;

const INPUT_CARD = Symbol();

function createInputCardActivity(index = 0) {
  return {
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
          $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
          type: 'AdaptiveCard',
          version: '1.3',
          body: [
            {
              type: 'ColumnSet',
              columns: [
                {
                  type: 'Column',
                  width: 2,
                  items: [
                    {
                      type: 'TextBlock',
                      text: 'Tell us about yourself',
                      weight: 'Bolder',
                      size: 'Medium',
                      wrap: true
                    },
                    {
                      type: 'TextBlock',
                      text: 'We just need a few more details to get you booked for the trip of a lifetime!',
                      isSubtle: true,
                      wrap: true
                    },
                    {
                      type: 'TextBlock',
                      text: "Don't worry, we'll never share or sell your information.",
                      isSubtle: true,
                      wrap: true,
                      size: 'Small'
                    },
                    {
                      type: 'Container',
                      items: [
                        {
                          type: 'TextBlock',
                          text: 'Your name',
                          wrap: true
                        },
                        {
                          type: 'Input.Text',
                          id: 'myName',
                          placeholder: 'Last, First'
                        },
                        {
                          type: 'TextBlock',
                          text: 'Your email',
                          wrap: true
                        },
                        {
                          type: 'Input.Text',
                          id: 'myEmail',
                          placeholder: 'youremail@example.com'
                        },
                        {
                          type: 'TextBlock',
                          text: 'Phone Number',
                          wrap: true
                        },
                        {
                          type: 'Input.Text',
                          id: 'myTel',
                          placeholder: 'xxx.xxx.xxxx'
                        }
                      ]
                    }
                  ]
                },
                {
                  type: 'Column',
                  width: 1,
                  items: [
                    {
                      type: 'Image',
                      url:
                        'https://upload.wikimedia.org/wikipedia/commons/b/b2/Diver_Silhouette%2C_Great_Barrier_Reef.jpg',
                      size: 'auto'
                    }
                  ]
                }
              ]
            }
          ],
          actions: [
            {
              type: 'Action.Submit',
              title: 'Submit'
            }
          ]
        }
      }
    ],
    from: { role: 'bot' },
    id: index + '',
    text: `This is an input card`,
    timestamp: 0,
    type: 'message'
  };
}

async function expectScroll(element, eventInitDict, shouldScroll) {
  const scrollable = elements.transcriptScrollable();

  const scrollTopAtBottommost = scrollable.scrollHeight - scrollable.offsetHeight;

  scrollable.scrollTop = scrollTopAtBottommost;

  Simulate.keyDown(element, eventInitDict);

  // "scrollTop" may not move immediately, but probably within the next 500 ms.
  await new Promise(resolve => setTimeout(resolve, 500));

  if (shouldScroll) {
    expect(scrollable.scrollTop).toBeLessThan(scrollTopAtBottommost, `Should scroll for ${element.outerHTML}`);
  } else {
    expect(scrollable.scrollTop).toBe(scrollTopAtBottommost, `Should not scroll for ${element.outerHTML}`);
  }
}

function generateTranscript() {
  const messages = [
    'Do incididunt qui sit nulla dolor.',
    'Ipsum dolor laborum veniam sunt irure nulla aliquip minim ad veniam culpa sit ut.',
    'Labore ut ex anim in nisi enim deserunt anim minim esse veniam.',
    'Lorem amet occaecat voluptate fugiat elit cillum.',
    'Sit et velit qui laboris et elit eu pariatur velit occaecat.',
    'Nostrud minim deserunt excepteur elit aliquip excepteur.',
    'Laboris pariatur minim ad incididunt.',
    'Reprehenderit sint id elit laboris nisi ipsum pariatur et id deserunt dolore.',
    'Quis dolor ut dolor qui.',
    'Fugiat commodo ipsum irure deserunt duis ea est amet Lorem esse eiusmod.',
    'Magna occaecat enim magna laboris sunt consequat esse elit ipsum esse quis culpa amet.',
    'Laborum officia est elit officia voluptate dolore elit veniam aute velit.',
    'Et esse sint incididunt irure et amet deserunt consectetur dolor.',
    'Ipsum adipisicing nisi nulla eiusmod commodo ad enim veniam velit.',
    'Consectetur labore adipisicing do dolor dolor eiusmod sint irure in labore ullamco incididunt voluptate.',
    'Duis voluptate elit tempor quis consequat incididunt excepteur anim in.',
    'Aliquip cupidatat exercitation magna aute nostrud fugiat deserunt.',
    'Nulla eu do duis consequat sint irure proident cupidatat duis.',
    'Ipsum laborum commodo sint tempor fugiat esse est sit officia qui cupidatat nisi minim.',
    'Aliquip sit proident cillum excepteur laborum enim fugiat cupidatat consequat ex excepteur.',
    'Qui occaecat ex dolore elit.',
    'Cillum non Lorem aute proident sunt laboris reprehenderit ipsum ipsum.',
    'Eu dolor do sit reprehenderit sint duis aliqua amet esse.',
    'Cupidatat ut et dolor Lorem enim ex irure eu tempor occaecat.',
    'Duis tempor minim eu labore enim aute ex pariatur.',
    'Aliqua ea eu sunt magna.',
    'Ullamco culpa cupidatat eu magna eu amet.',
    'Commodo dolore laborum mollit non est.',
    'Proident laboris commodo mollit est adipisicing in veniam.',
    INPUT_CARD,
    'Et in tempor eiusmod officia eu quis ullamco velit sit dolor consectetur ex.',
    'Cillum exercitation do dolore aliqua ea incididunt consequat proident deserunt sunt incididunt eiusmod adipisicing cupidatat.'
  ];

  return messages.map((text, index) => {
    if (text === INPUT_CARD) {
      return createInputCardActivity(index);
    }

    const fromUser = index % 2;

    return {
      ...(fromUser
        ? {
            channelData: {
              clientActivityID: index + '',
              clientTimestamp: 0,
              state: 'sent'
            }
          }
        : {}),
      from: { role: fromUser ? 'user' : 'bot' },
      id: index + '',
      text: `#${index}: ${text}`,
      timestamp: 0,
      type: 'message'
    };
  });
}

async function waitForFocusedActivityInView(message) {
  await pageObjects.wait(
    conditions.scrollStabilized(`wait for focused activity in view${message ? ': ' + message : ''}`),
    timeouts.ui
  );

  await pageObjects.wait(
    {
      message: 'focused activity scroll into view',
      fn: () => {
        const { offsetHeight: activityHeight, offsetTop: activityTop } = elements.focusedActivity();
        const { offsetHeight: scrollableHeight, scrollTop: scrollableTop } = elements.transcriptScrollable();

        const activityBottom = activityHeight + activityTop;
        const scrollableBottom = scrollableHeight + scrollableTop;

        return (
          (activityTop >= scrollableTop &&
            activityTop <= scrollableBottom &&
            activityBottom >= scrollableTop &&
            activityBottom <= scrollableBottom) ||
          (scrollableTop >= activityTop &&
            scrollableTop <= activityBottom &&
            scrollableBottom >= activityTop &&
            scrollableBottom <= activityBottom)
        );
      }
    },
    timeouts.ui
  );
}

window.TestAsset = {
  createInputCardActivity,
  expectScroll,
  generateTranscript,
  waitForFocusedActivityInView
};
