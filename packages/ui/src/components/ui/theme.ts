import { createSystem, defaultConfig } from '@chakra-ui/react';

import { kosugi_maru } from '../../utils';

export default createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: kosugi_maru.style.fontFamily },
        body: { value: kosugi_maru.style.fontFamily },
      },
      colors: {
        hachiBlue: {
          DEFAULT: { value: '#9BD5F2' },
          dark: { value: '#78A6BE' },
          light: { value: '#BFE9FF' },
        },
        chiiWhite: { value: '#FFFFFF' },
        usaYellow: {
          DEFAULT: { value: '#FDEFCA' },
          dark: { value: '#E0C072 ' },
          light: { value: '#FFF7E0' },
        },
        blackPrimary: { value: '{colors.gray.700}' },
      },
    },
    semanticTokens: {
      colors: {
        blackSwitch: { value: { base: '{colors.blackPrimary}', _dark: '{colors.chiiWhite}' } },
        whiteSwitch: { value: { base: '{colors.chiiWhite}', _dark: '{colors.gray.800}' } },
      },
    },
  },
});
