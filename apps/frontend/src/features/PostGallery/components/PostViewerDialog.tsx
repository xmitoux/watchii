// post拡大表示ダイアログ
import NextImage from 'next/image';

import { Center } from '@repo/ui/chakra-ui';
import { DialogBody, DialogContent, DialogRoot } from '@repo/ui/chakra-ui/dialog';

import { useDeviceType } from '@/hooks/useDeviceType';

type ImageViewerDialogProps = {
  isOpen: boolean;
  onOpenChange: (e: { open: boolean }) => void;
  imageUrl: string;
};

export const PostViewerDialog = ({
  isOpen,
  onOpenChange,
  imageUrl,
}: ImageViewerDialogProps) => {
  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();

  return (
    <DialogRoot open={isOpen} placement="center" size="xl" onOpenChange={onOpenChange}>
      <DialogContent background="transparent" boxShadow="none" onClick={() => onOpenChange({ open: false })}>
        <DialogBody>
          <Center>
            <NextImage
              style={{
                // スマホとタブレットの場合は画面幅いっぱいに拡大
                width: isMobile ? '90vw' : 'auto',
                // PCの場合は画像を画面高さいっぱいに拡大
                height: isMobile ? 'auto' : '80vh',
              }}
              src={imageUrl}
              width={800}
              height={0}
              alt="拡大画像"
            />
          </Center>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
