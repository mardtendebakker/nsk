// ----------------------------------------------------------------------

export function remToPx(value) {
  return Math.round(parseFloat(value) * 16);
}

export function pxToRem(value) {
  return `${value / 16}rem`;
}

export function responsiveFontSizes({ sm, md, lg }) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

// ----------------------------------------------------------------------

const FONT_PRIMARY = 'Inter, normal';
// const FONT_SECONDARY = 'CircularStd, sans-serif'; // Local Font

const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: 1.6,
    fontSize: '1.6rem',
  },
  h2: {
    fontWeight: 700,
    lineHeight: 1.6,
    fontSize: '1.4rem',
  },
  h3: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: '1.2rem',
  },
  h4: {
    fontWeight: 600,
    lineHeight: 1.5,
    fontSize: '1rem',
  },
  h5: {
    fontWeight: 550,
    lineHeight: 1.5,
    fontSize: '.8rem',
  },
  body1: {
    lineHeight: 1.5,
    fontSize: '.8rem',
  },
  body2: {
    lineHeight: 1.6,
    fontSize: '.7rem',
    fontWeight: 400,
  },
  caption: {
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 700,
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontWeight: 700,
    lineHeight: 24 / 14,
    textTransform: 'capitalize',
  },
};

export default typography;
