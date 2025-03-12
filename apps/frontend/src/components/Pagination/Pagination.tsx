import { HStack } from '@repo/ui/chakra-ui';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@repo/ui/chakra-ui/pagination';
import { useDeviceType } from '@repo/ui/hooks';

type PaginationProps = {
  count: number;
  pageSize: number;
  defaultPage: number;
  destination: string;
};

export function Pagination({ count, pageSize, defaultPage, destination }: PaginationProps) {
  const { isMobile } = useDeviceType();
  /** ページネーションの現在ページ前後のページ番号数 */
  const paginationSiblingCount = isMobile ? 1 : 2;

  return (
    <PaginationRoot
      variant="solid"
      size={isMobile ? 'xs' : 'sm'}
      count={count}
      pageSize={pageSize}
      defaultPage={defaultPage}
      siblingCount={paginationSiblingCount}
      getHref={page => `${destination}/${page}`}
    >
      <HStack px={4}>
        <PaginationPrevTrigger />
        <PaginationItems />
        <PaginationNextTrigger />
      </HStack>
    </PaginationRoot>
  );
}
