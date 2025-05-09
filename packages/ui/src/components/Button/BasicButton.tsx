import { motion } from 'motion/react';

import { Button, ButtonProps } from '@repo/ui/chakra-ui';

type BasicButtonProps = {
  tapScale?: number;
} & ButtonProps;

/** Chakra Buttonのラッパーコンポーネント */
export function BasicButton({ children, tapScale = 0.97, ...props }: BasicButtonProps) {
  return (
    <motion.div whileTap={{ scale: tapScale }}>
      <Button
        variant="solid"
        w="222px"
        h="40px"
        fontSize="sm"
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}
