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
        hachiBlue: { value: '#9BD5F2' },
        chiiWhite: { value: '#FFFFFF' },
        usaYellow: { value: '#FDEFCA' },
        blackPrimary: { value: '{colors.gray.800}' },
      },
    },
    semanticTokens: {
      colors: {
        blackSwitch: { value: { base: '{colors.blackPrimary}', _dark: '{colors.chiiWhite}' } },
        whiteSwitch: { value: { base: '{colors.chiiWhite}', _dark: '{colors.blackPrimary}' } },
      },
    },
  },
});
