import { useState } from 'react';

export const usePostViewerDialog = () => {
  const [isViewerDialogOpen, setIsImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const handleImageClick = (filename: string) => {
    setSelectedImage(filename);
    setIsImageDialogOpen(true);
  };

  return {
    isViewerDialogOpen,
    selectedImage,
    setIsImageDialogOpen,
    handleImageClick,
  };
};
