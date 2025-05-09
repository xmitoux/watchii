import { motion } from 'motion/react';
import Link from 'next/link';

import { Button, ButtonProps } from '@repo/ui/chakra-ui';

type RoundedButtonProps = {
  variant?: ButtonProps['variant'];
  color?: string;
  bg?: string;
  to: string;
  children: React.ReactNode;
};

/** 丸っこいボタンコンポーネント */
export default function RoundedButton({ variant, color, bg, to, children }: RoundedButtonProps) {
  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Button
        variant={variant}
        w={['240px', '280px']}
        h="56px"
        fontSize="lg"
        fontWeight="bold"
        borderRadius="full"
        boxShadow="0px 4px 10px rgba(0,0,0,0.15)"
        color={color}
        bg={bg}
        _hover={{
          transform: 'translateY(-4px)',
          boxShadow: '0px 6px 12px rgba(0,0,0,0.2)',
        }}
        transition="all 0.2s"
        asChild
      >
        <Link href={to}>{children}</Link>
      </Button>
    </motion.div>
  );
}
