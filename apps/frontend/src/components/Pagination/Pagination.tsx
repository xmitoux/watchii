import { useEffect, useState } from 'react';

import { HStack } from '@repo/ui/chakra-ui';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from '@repo/ui/chakra-ui/pagination';
import { useDeviceType } from '@repo/ui/hooks';

type PaginationProps = {
  totalPageCount: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export function Pagination({ totalPageCount, perPage, currentPage, onPageChange }: PaginationProps) {
  const [currentPageState, setCurrentPageState] = useState(currentPage);

  useEffect(() => {
    setCurrentPageState(currentPage);
  }, [currentPage]);

  const { isMobile } = useDeviceType();
  /** ページネーションの現在ページ前後のページ番号数 */
  const paginationSiblingCount = isMobile ? 1 : 2;

  function handlePageChange(page: number) {
    setCurrentPageState(page);
    onPageChange(page);
  }

  return (
    <PaginationRoot
      variant="solid"
      size={isMobile ? 'xs' : 'sm'}
      count={totalPageCount}
      pageSize={perPage}
      page={currentPageState}
      siblingCount={paginationSiblingCount}
      onPageChange={e => handlePageChange(e.page)}
    >
      <HStack gap={isMobile ? 1 : 2}>
        <PaginationPrevTrigger />
        <PaginationItems />
        <PaginationNextTrigger />
      </HStack>
    </PaginationRoot>
  );
}
