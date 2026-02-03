import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCreatingNew, triggerRefresh, setSelectedCarData } from '../../global/redux/slices/DisplaySlice';
import { supabase } from '../../global/supabase/Client';
import Camera from '../../util/Camera';
import './NewItem.css';

const NewItem = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.user);
  const [step, setStep] = useState(1);
  const [carId, setCarId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCancel = () => {
    console.log('NewItem: Cancel clicked');
    dispatch(setCreatingNew(false));
  };

  const handleCreate = async () => {
    const registration = document.querySelector('#reg')?.value || '';
    const miles = document.querySelector('#miles')?.value || '';
    
    // Validate registration field
    if (!registration.trim()) {
      setMessage('Please add registration or placeholder');
      return;
    }

    console.log('NewItem: Create clicked with registration:', registration, 'miles:', miles);
    setLoading(true);
    setMessage('Creating...');

    // Create row in database
    const { data, error } = await supabase
      .from('cars')
      .insert([
        { registration, miles: parseInt(miles) || 0, user_id: user?.id }
      ])
      .select()
      .single();

    if (error) {
      console.error('NewItem: Error creating car', error);
      setMessage('Error creating car');
      setLoading(false);
    } else {
      console.log('NewItem: Created car with id:', data.id);
      setCarId(data.id);
      setStep(2);
      setLoading(false);
      setMessage('');
    }
  };

  const handleCameraSave = async (imageData, action) => {
    console.log('NewItem: Camera save with action:', action, 'carId:', carId, 'userId:', user?.id);
    
    if (!carId || !user?.id) {
      console.error('NewItem: Missing carId or userId');
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
      // Path: car-images/user-id/car-id/<filename>
      const fileName = `image-${Date.now()}.jpg`;
      const filePath = `${user.id}/${carId}/${fileName}`;
      
      console.log('NewItem: Uploading image to path:', filePath);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(filePath, blob);

      if (uploadError) {
        console.error('NewItem: Error uploading image', uploadError);
        console.error('NewItem: Upload error details:', JSON.stringify(uploadError));
        return;
      }

      console.log('NewItem: Image uploaded successfully', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(filePath);

      console.log('NewItem: Image public URL:', urlData.publicUrl);

      // Load current car data to get existing images
      const { data: existingCar, error: fetchError } = await supabase
        .from('cars')
        .select('images')
        .eq('id', carId)
        .single();

      if (fetchError) {
        console.error('NewItem: Error fetching car data', fetchError);
        return;
      }

      // Append new image URL to existing images array
      const existingImages = existingCar?.images || [];
      const updatedImages = [...existingImages, urlData.publicUrl];

      console.log('NewItem: Updating car with images. Existing:', existingImages, 'New total:', updatedImages.length);

      // Update car row with updated images array
      const { data: updateData, error: updateError } = await supabase
        .from('cars')
        .update({ images: updatedImages })
        .eq('id', carId)
        .select();

      if (updateError) {
        console.error('NewItem: Error updating car with image', updateError);
        console.error('NewItem: Update error details:', JSON.stringify(updateError));
      } else {
        console.log('NewItem: Car updated with image. Updated data:', updateData);
      }
    } catch (error) {
      console.error('NewItem: Error processing image', error);
      console.error('NewItem: Error details:', JSON.stringify(error));
    }
    
    if (action === 'done') {
      // Fetch full car data and set as selectedCarData
      const { data: fullCarData, error: fetchError } = await supabase
        .from('cars')
        .select('*')
        .eq('id', carId)
        .single();

      if (fetchError) {
        console.error('NewItem: Error fetching full car data:', fetchError);
      } else {
        console.log('NewItem: Fetched full car data:', fullCarData);
        dispatch(setSelectedCarData(fullCarData));
      }
      dispatch(setCreatingNew(false));
      dispatch(triggerRefresh());
    } else if (action === 'next') {
      // Keep camera open for next image
      console.log('NewItem: Ready for next image');
    }
  };

  const handleCameraCancel = () => {
    console.log('NewItem: Camera cancel');
    dispatch(setCreatingNew(false));
    dispatch(triggerRefresh());
  };

  return (
    <div className="new-item-overlay">
      {step === 1 ? (
        <div className="new-item-content">
          <h2 className="new-item-title">Add New Car</h2>
          
          <div className="new-item-form">
            <div className="form-group">
              <label htmlFor="reg">Car Registration</label>
              <input
                type="text"
                id="reg"
                placeholder="e.g., ABC123"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="miles">Miles</label>
              <input
                type="text"
                id="miles"
                placeholder="e.g., 5000"
                className="form-input"
              />
            </div>
          </div>

          <div className="new-item-actions">
            {message && (
              <div className="new-item-message">{message}</div>
            )}
            <div className="new-item-buttons">
              <button className="cancel-button" onClick={handleCancel} disabled={loading}>
                Cancel
              </button>
              <button className="create-button" onClick={handleCreate} disabled={loading}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                  <circle cx="12" cy="13" r="4"></circle>
                </svg>
                Create
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <Camera
          carId={carId}
          onSave={handleCameraSave}
          onCancel={handleCameraCancel}
        />
      )}
    </div>
  );
};

export default NewItem;
