import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { ButtonGroup, IconButton } from '@repo/ui/chakra-ui';
import { Pagination as ChakraPagination } from '@repo/ui/chakra-ui';
import { IoEllipsisHorizontal, MdKeyboardArrowLeft, MdKeyboardArrowRight } from '@repo/ui/icons';

import { useDeviceTypeStore } from '@/stores/deviceTypeStore';

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

  const { isMobile } = useDeviceTypeStore();
  /** ページネーションの現在ページ前後のページ番号数 */
  const paginationSiblingCount = isMobile ? 1 : 2;

  function handlePageChange(page: number) {
    setCurrentPageState(page);
    onPageChange(page);
  }

  return (
    <ChakraPagination.Root
      count={totalPageCount}
      pageSize={perPage}
      page={currentPageState}
      siblingCount={paginationSiblingCount}
      onPageChange={(e) => handlePageChange(e.page)}
    >
      <ButtonGroup variant="solid" size={isMobile ? 'xs' : 'sm'} gap={2}>
        {/* 前ページ(<)のボタン */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <ChakraPagination.PrevTrigger asChild>
            <IconButton color="chiiWhite" bg="hachiBlueSwitch">
              <MdKeyboardArrowLeft />
            </IconButton>
          </ChakraPagination.PrevTrigger>
        </motion.div>

        <ChakraPagination.Context>
          {({ pages }) =>
            pages.map((page, index) =>
              page.type === 'page'
                ? (
                  // ページ番号のボタン
                  <motion.div key={index} whileTap={{ scale: 0.95 }}>
                    <ChakraPagination.Item {...page} asChild>
                      <IconButton
                        variant={page.value === currentPageState ? 'solid' : 'outline'}
                        color={page.value === currentPageState ? 'chiiWhite' : 'blackSwitch'}
                        bg={page.value === currentPageState ? 'hachiBlueSwitch' : 'whiteSwitch'}
                      >
                        {page.value}
                      </IconButton>
                    </ChakraPagination.Item>
                  </motion.div>
                )
                : (
                  // ページ番号省略(...)のボタン
                  <ChakraPagination.Ellipsis key={index} index={index} asChild>
                    <IconButton variant="outline" color="blackSwitch" bg="whiteSwitch">
                      <IoEllipsisHorizontal />
                    </IconButton>
                  </ChakraPagination.Ellipsis>
                ))}
        </ChakraPagination.Context>

        {/* 次ページ(>)のボタン */}
        <motion.div whileTap={{ scale: 0.95 }}>
          <ChakraPagination.NextTrigger asChild>
            <IconButton color="chiiWhite" bg="hachiBlueSwitch">
              <MdKeyboardArrowRight />
            </IconButton>
          </ChakraPagination.NextTrigger>
        </motion.div>
      </ButtonGroup>
    </ChakraPagination.Root>
  );
}
