import { Center } from '@repo/ui/chakra-ui';
import { DialogBody, DialogContent, DialogRoot } from '@repo/ui/chakra-ui/dialog';
// post拡大表示ダイアログ
import { NextImage } from '@repo/ui/components';
import { useDeviceType } from '@repo/ui/hooks';

type ImageViewerDialogProps = {
  isOpen: boolean;
  onOpenChange: (e: { open: boolean }) => void;
  filename: string;
};

export const PostViewerDialog = ({
  isOpen,
  onOpenChange,
  filename,
}: ImageViewerDialogProps) => {
  /** モバイルデバイス(スマホ・タブレット)か */
  const { isMobile } = useDeviceType();
  // スマホとタブレットの場合は画面幅いっぱいに拡大
  const imageWidth = isMobile ? '90vw' : 'auto';
  // PCの場合は画像を画面高さいっぱいに拡大
  const imageHeight = isMobile ? 'auto' : '80vh';

  return (
    <DialogRoot open={isOpen} placement="center" size="xl" onOpenChange={onOpenChange}>
      <DialogContent background="transparent" boxShadow="none" onClick={() => onOpenChange({ open: false })}>
        <DialogBody>
          <Center>
            <NextImage
              src={filename}
              width={400}
              styleWidth={imageWidth}
              styleHeight={imageHeight}
              alt="拡大画像"
            />
          </Center>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};
