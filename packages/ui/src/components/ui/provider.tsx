import { ChakraProvider, createSystem, defaultConfig, defaultSystem } from '@chakra-ui/react';

import { kosugi_maru } from '../../utils';

import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from './color-mode';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: kosugi_maru.style.fontFamily },
        body: { value: kosugi_maru.style.fontFamily },
      },
    },
  },
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
