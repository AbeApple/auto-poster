import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAddingImagesToCarId, triggerRefresh, setSelectedCarData } from '../../global/redux/slices/DisplaySlice';
import Camera from '../../util/Camera';
import { supabase } from '../../global/supabase/Client';
import './AddImages.css';

const AddImages = () => {
  const addingImagesToCarId = useSelector(state => state.display.addingImagesToCarId);
  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const handleCameraSave = async (imageData, action) => {
    console.log('AddImages: Camera save with action:', action, 'carId:', addingImagesToCarId, 'userId:', user?.id);
    
    if (!addingImagesToCarId || !user?.id) {
      console.error('AddImages: Missing carId or userId');
      return;
    }

    try {
      // Convert base64 data URL to Blob
      const base64Data = imageData.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Upload image to Supabase storage
      const fileName = `image-${Date.now()}.jpg`;
      const filePath = `${user.id}/${addingImagesToCarId}/${fileName}`;
      
      console.log('AddImages: Uploading image to path:', filePath);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, blob);

      if (uploadError) {
        console.error('AddImages: Error uploading image', uploadError);
        return;
      }

      console.log('AddImages: Image uploaded successfully', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      console.log('AddImages: Image public URL:', urlData.publicUrl);

      // Load current car data to get existing images
      const { data: existingCar, error: fetchError } = await supabase
        .from('cars')
        .select('images')
        .eq('id', addingImagesToCarId)
        .single();

      if (fetchError) {
        console.error('AddImages: Error fetching car data', fetchError);
        return;
      }

      // Append new image URL to existing images array (prepend to make it first)
      const existingImages = existingCar?.images || [];
      const updatedImages = [urlData.publicUrl, ...existingImages];

      console.log('AddImages: Updating car with images. Existing:', existingImages, 'New total:', updatedImages.length);

      // Update car row with updated images array
      const { data: updateData, error: updateError } = await supabase
        .from('cars')
        .update({ images: updatedImages })
        .eq('id', addingImagesToCarId)
        .select();

      if (updateError) {
        console.error('AddImages: Error updating car with image', updateError);
      } else {
        console.log('AddImages: Car updated with image. Updated data:', updateData);
      }
    } catch (error) {
      console.error('AddImages: Error processing image', error);
    }
    
    if (action === 'done') {
      // Close the add images overlay and trigger refresh
      dispatch(setAddingImagesToCarId(null));
      dispatch(triggerRefresh());
    } else if (action === 'next') {
      // Keep camera open for next image
      console.log('AddImages: Ready for next image');
    }
  };

  const handleCancel = () => {
    console.log('AddImages: Cancelled');
    dispatch(setAddingImagesToCarId(null));
  };

  if (!addingImagesToCarId) {
    return null;
  }

  return (
    <div className="add-images-overlay">
      <div className="add-images-content">
        <div className="add-images-header">
          <h2 className="add-images-title">Add Images</h2>
          <button className="close-button" onClick={handleCancel}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <Camera
          carId={addingImagesToCarId}
          userId={user?.id}
          onSave={handleCameraSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddImages;
