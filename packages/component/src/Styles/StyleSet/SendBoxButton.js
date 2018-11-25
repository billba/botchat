export default function ({
  sendBoxButtonColor,
  sendBoxButtonColorOnDisabled,
  sendBoxButtonColorOnFocus,
  sendBoxButtonColorOnHover,
  sendBoxHeight
}) {
  return {
    backgroundColor: 'Transparent',
    border: 0,
    height: '100%',
    outline: 0,
    padding: 0,

    // We use the sendBoxHeight, so the button looks square
    width: sendBoxHeight,

    '&:not(:disabled)': {
      cursor: 'pointer'
    },

    '& svg': {
      fill: sendBoxButtonColor
    },

    '&:disabled svg': {
      fill: sendBoxButtonColorOnDisabled
    },

    '&:focus svg': {
      fill: sendBoxButtonColorOnFocus
    },

    '&:hover svg': {
      fill: sendBoxButtonColorOnHover
    },

    '&.btn-rtl' : {
      transform: 'scaleX(-1)',
      filter: 'FlipH'
    }
  };
}
