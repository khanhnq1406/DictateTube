import { useEffect, useState, useRef } from 'react';
import { audioOutputManager } from './audio-helpers';

interface MobileAudioOptions {
  preferSpeakerOutput?: boolean;
  preventPhoneCallOutput?: boolean;
}

export const useMobileAudio = (options: MobileAudioOptions = {}) => {
  const { preferSpeakerOutput = true, preventPhoneCallOutput = true } = options;
  const [isAudioContextReady, setIsAudioContextReady] = useState(false);
  const [availableOutputs, setAvailableOutputs] = useState<MediaDeviceInfo[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize mobile audio handling
  useEffect(() => {
    const initializeMobileAudio = async () => {
      try {
        // Initialize audio context
        const audioContext = audioOutputManager.initializeAudioContext();
        audioContextRef.current = audioContext;

        // Resume audio context if suspended (common on mobile)
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // Get available audio devices
        const devices = await navigator.mediaDevices.enumerateDevices();
        const outputDevices = devices.filter(device => device.kind === 'audiooutput');
        setAvailableOutputs(outputDevices);

        setIsAudioContextReady(true);

        // Prevent automatic audio routing to phone call output
        if (preventPhoneCallOutput) {
          preventPhoneCallAudioRouting();
        }

      } catch (error) {
        console.error('Failed to initialize mobile audio:', error);
      }
    };

    initializeMobileAudio();

    // Cleanup
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      audioOutputManager.cleanup();
    };
  }, [preventPhoneCallOutput]);

  // Prevent phone call audio routing
  const preventPhoneCallAudioRouting = () => {
    // Add CSS class to prevent phone call output
    document.body.classList.add('prevent-phone-output');

    // Create hidden audio element to maintain audio context
    const hiddenAudio = document.createElement('audio');
    hiddenAudio.preload = 'auto';
    hiddenAudio.muted = true;
    hiddenAudio.style.position = 'absolute';
    hiddenAudio.style.top = '-9999px';
    hiddenAudio.style.left = '-9999px';
    hiddenAudio.style.opacity = '0';
    hiddenAudio.id = 'mobile-audio-context-maintainer';

    // Set a silent audio source
    hiddenAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAAAQAEAAEAfAAAQAQABAAgAZGF0YQAAAAA=';
    document.body.appendChild(hiddenAudio);

    // Play silently to maintain audio context
    hiddenAudio.play().catch(() => {
      // Ignore autoplay restrictions
    });

    return hiddenAudio;
  };

  // Set preferred audio output
  const setPreferredOutput = async (element: HTMLAudioElement): Promise<void> => {
    if (!preferSpeakerOutput || availableOutputs.length === 0) return;

    try {
      // Look for speaker device
      const speakerDevice = availableOutputs.find(device =>
        device.label.toLowerCase().includes('speaker') ||
        device.label.toLowerCase().includes('built-in') ||
        device.label.toLowerCase().includes('main')
      );

      if (speakerDevice) {
        await audioOutputManager.setAudioOutputSink(element, speakerDevice.deviceId);
      }
    } catch (error) {
      console.warn('Failed to set preferred audio output:', error);
    }
  };

  // Force speaker output on mobile
  const forceSpeakerOutput = async (): Promise<void> => {
    if (!isAudioContextReady) return;

    try {
      // Create a test audio element
      const testAudio = document.createElement('audio');
      testAudio.muted = true;

      // Set output to speaker
      await setPreferredOutput(testAudio);

      // Play silently to establish audio routing
      await testAudio.play();
    } catch (error) {
      console.warn('Failed to force speaker output:', error);
    }
  };

  return {
    isAudioContextReady,
    availableOutputs,
    setPreferredOutput,
    forceSpeakerOutput,
    audioContext: audioContextRef.current,
  };
};