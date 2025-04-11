import { useState, useCallback } from 'react';
import { Camera, CameraResultType, CameraSource, type Photo } from '@capacitor/camera';

interface UseCameraProps {
  onCapture?: (imagePath: string) => void;
  onError?: (error: Error | unknown) => void;
}

export function useCamera({ onCapture, onError }: UseCameraProps = {}) {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const takePhoto = useCallback(async () => {
    try {
      setIsCapturing(true);

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        promptLabelHeader: 'Take a Photo',
        promptLabelCancel: 'Cancel',
        width: 1280,
        height: 1280,
        correctOrientation: true,
      });

      setPhoto(image);

      if (onCapture && image.dataUrl) {
        onCapture(image.dataUrl);
      }

      return image;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error('Error capturing photo:', error);
      }
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [onCapture, onError]);

  const selectFromGallery = useCallback(async () => {
    try {
      setIsCapturing(true);

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        promptLabelHeader: 'Select a Photo',
        promptLabelCancel: 'Cancel',
        correctOrientation: true,
      });

      setPhoto(image);

      if (onCapture && image.dataUrl) {
        onCapture(image.dataUrl);
      }

      return image;
    } catch (error) {
      if (onError) {
        onError(error);
      } else {
        console.error('Error selecting photo:', error);
      }
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [onCapture, onError]);

  const clearPhoto = useCallback(() => {
    setPhoto(null);
  }, []);

  return {
    photo,
    isCapturing,
    takePhoto,
    selectFromGallery,
    clearPhoto,
  };
}
