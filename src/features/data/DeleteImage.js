import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setDeletingImage, triggerRefresh } from '../../global/redux/slices/DisplaySlice';
import { supabase } from '../../global/supabase/Client';
import Confirm from '../../util/Confirm';

const DeleteImage = () => {
  const deletingImage = useSelector(state => state.display.deletingImage);
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    if (!deletingImage) return;

    console.log('DeleteImage: Deleting image', deletingImage);

    try {
      // Load current car data to get existing images
      const { data: car, error: fetchError } = await supabase
        .from('cars')
        .select('images')
        .eq('id', deletingImage.carId)
        .single();

      if (fetchError) {
        console.error('DeleteImage: Error fetching car data', fetchError);
        return;
      }

      // Remove the image URL from the images array
      const existingImages = car?.images || [];
      const updatedImages = existingImages.filter(img => img !== deletingImage.imageUrl);

      console.log('DeleteImage: Updating car with images. Existing:', existingImages, 'New total:', updatedImages.length);

      // Update car row with updated images array
      const { data: updateData, error: updateError } = await supabase
        .from('cars')
        .update({ images: updatedImages })
        .eq('id', deletingImage.carId)
        .select();

      if (updateError) {
        console.error('DeleteImage: Error updating car', updateError);
      } else {
        console.log('DeleteImage: Car updated successfully', updateData);
      }
    } catch (error) {
      console.error('DeleteImage: Error deleting image', error);
    }

    // Close the confirm dialog and trigger refresh
    dispatch(setDeletingImage(null));
    dispatch(triggerRefresh());
  };

  const handleCancel = () => {
    console.log('DeleteImage: Cancelled');
    dispatch(setDeletingImage(null));
  };

  if (!deletingImage) {
    return null;
  }

  return (
    <Confirm
      message="Are you sure you want to delete this image?"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
};

export default DeleteImage;
