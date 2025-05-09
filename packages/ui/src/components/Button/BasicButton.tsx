import { motion } from 'motion/react';

import { Button, ButtonProps } from '@repo/ui/chakra-ui';

/** Chakra Buttonのラッパーコンポーネント */
export function BasicButton({ children, ...props }: ButtonProps) {
  return (
    <motion.div whileTap={{ scale: 0.97 }}>
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
