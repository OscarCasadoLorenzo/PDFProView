// Custom scale color scheme was created with https://smart-swatch.netlify.app/

import { extendTheme } from '@chakra-ui/react';

const PDFProViewTheme = {
  colors: {
    primary: {
      50: '#e6fae8',
      100: '#c6e9c8',
      200: '#a4d9a6',
      300: '#82c984',
      400: '#5fba63',
      500: '#45a049',
      600: '#357c38',
      700: '#255927',
      800: '#133615',
      900: '#001400',
    },
    secondary: {
      50: '#d9f9ff',
      100: '#abe8ff',
      200: '#7cd7ff',
      300: '#4bc7fe',
      400: '#1cb7fc',
      500: '#039de3',
      600: '#007ab1',
      700: '#005780',
      800: '#003550',
      900: '#001320',
    },
    background: '#FFFFFF',
    surface: '#F5F5F5',
    error: '#FF5252',
    onPrimary: '#F5F5F5',
    onSecondary: '#111411',
    onBackground: '#111411',
    onSurface: '#111411',
    onError: '#F5F5F5',
  },
};

export default extendTheme(PDFProViewTheme);
