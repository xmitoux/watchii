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
        // アプリ全体のテーマカラー
        chiiWhite: { value: '#FFFFFF' },
        hachiBlue: {
          DEFAULT: { value: '#9BD5F2' },
          dark: { value: '#78A6BE' },
          light: { value: '#BFE9FF' },
        },
        blackPrimary: { value: '{colors.gray.700}' },

        // 各キャラの色
        // DEFAULTは主にキャラアイコンに使用
        // dark/lightは主に語録吹き出しに使用
        chiikawaPink: {
          DEFAULT: { value: '#F8B5C6' },
          dark: { value: '#D4687E' },
          light: { value: '#FFE8F2' },
        },
        hachiwareBlue: { // hachiBlueとは異なるので注意！
          DEFAULT: { value: '#3DCBFD' },
          dark: { value: '#0088BE' },
          light: { value: '#D2EEF7' },
        },
        usagiYellow: {
          DEFAULT: { value: '#FFC756' },
          dark: { value: '#CF9125' },
          light: { value: '#FFF7E0' },
        },
        kurimanjuGreen: {
          DEFAULT: { value: '#9AEE7E' },
          dark: { value: '#529F3B' },
          light: { value: '#E0FFD6' },
        },
        momongaPurple: {
          DEFAULT: { value: '#C775FB' },
          dark: { value: '#9340C9' },
          light: { value: '#F4E2FF' },
        },
        shisaOrange: {
          DEFAULT: { value: '#FFA63F' },
          dark: { value: '#D97B16' },
          light: { value: '#FFECD6' },
        },
        rakkoGray: {
          DEFAULT: { value: '#B7B5BE' },
          dark: { value: '#75737A' },
          light: { value: '#E5E5EB' },
        },
      },
    },
    semanticTokens: {
      colors: {
        blackSwitch: {
          value: { base: '{colors.blackPrimary}', _dark: '{colors.chiiWhite}' },
        },
        whiteSwitch: {
          value: { base: '{colors.chiiWhite}', _dark: '{colors.gray.800}' },
        },
        hachiBlueSwitch: {
          value: { base: '{colors.hachiBlue}', _dark: '{colors.hachiBlue.dark}' },
        },
        usaYellowSwitch: {
          value: { base: '{colors.usaYellow.light}', _dark: '{colors.usaYellow.dark}' },
        },
      },
    },
  },
});
