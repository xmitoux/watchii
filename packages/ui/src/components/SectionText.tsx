import { Box, Icon, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { MdAdd } from 'react-icons/md';

type SectionTextProps = {
  title: string;
  to?: string;
};

export function SectionText({ title, to }: SectionTextProps) {
  return (
    <Box
      position="relative"
      w="full"
      bg={{ base: 'hachiBlue.light', _dark: 'hachiBlue.dark' }}
      borderRadius="lg"
      py={2}
      mb={4}
      textAlign="center"
    >
      <Text color="blackSwitch" fontSize="xl" fontWeight="bold">
        {title}
      </Text>

      {to && (
        <Link href={to}>
          <Icon
            position="absolute"
            right={4}
            top="11px"
            color="blackSwitch"
            size="lg"
            cursor="pointer"
            _hover={{ color: 'whiteSwitch' }}
            transition="all 0.2s"
          >
            <MdAdd />
          </Icon>
        </Link>
      )}
    </Box>
  );
}
