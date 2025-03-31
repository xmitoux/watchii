// Postページシャトルボタン
import { JSX } from 'react';

import { Icon, IconButton } from '@repo/ui/chakra-ui';
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from '@repo/ui/icons';

type PostPageShuttleButtonProps = {
  direction: 'top' | 'up' | 'down' | 'bottom';
  onClick: () => void;
};

export function PostPageShuttleButton({ direction, onClick }: PostPageShuttleButtonProps) {
  const icon: { [key in PostPageShuttleButtonProps['direction']]: JSX.Element } = {
    top: <MdKeyboardDoubleArrowUp />,
    up: <MdOutlineKeyboardArrowUp />,
    down: <MdOutlineKeyboardArrowDown />,
    bottom: <MdKeyboardDoubleArrowDown />,
  };

  return (
    <IconButton
      bg="hachiBlue"
      size="xs"
      rounded="full"
      onClick={onClick}
    >
      <Icon color="chiiWhite" size="md">
        {icon[direction]}
      </Icon>
    </IconButton>
  );
}
