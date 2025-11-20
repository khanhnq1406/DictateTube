import { useEffect, useState, useRef } from 'react';
import { audioOutputManager } from './audio-helpers';

interface MobileAudioOptions {
  preferSpeakerOutput?: boolean;
  preventPhoneCallOutput?: boolean;
}

// Detect if device is iPhone
const isIPhone = (): boolean => {
  return /iPhone/i.test(navigator.userAgent);
};

// Detect if device is iPad (similar audio behavior)
const isIPad = (): boolean => {
  return /iPad/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

// Detect if iOS device
const isIOS = (): boolean => {
  return isIPhone() || isIPad();
};

// Setup iOS-specific audio session for speaker routing
const setupIOSAudioSession = async (audioContext: AudioContext): Promise<void> => {
  try {
    // Create a silent oscillator to maintain audio context
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // Set very low volume to be essentially silent
    gainNode.gain.value = 0.0001;

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Start oscillator to maintain audio session
    oscillator.start();

    // Create a audio element with speaker routing
    const audioElement = new Audio();
    audioElement.muted = true;
    audioElement.preload = 'auto';

    // Set audio element to use speaker (iOS specific)
    try {
      // Use Web Audio API to force speaker output
      const source = audioContext.createMediaElementSource(audioElement);
      source.connect(audioContext.destination);
    } catch (error) {
      console.warn('Could not set up media element source:', error);
    }

    // Add iOS-specific audio attributes
    audioElement.setAttribute('x-webkit-airplay', 'allow');
    audioElement.setAttribute('playsinline', 'true');

    // Store oscillator for cleanup
    (audioContext as AudioContext & { _speakerOscillator?: OscillatorNode })._speakerOscillator = oscillator;

  } catch (error) {
    console.warn('Failed to setup iOS audio session:', error);
  }
};

export const useMobileAudio = (options: MobileAudioOptions = {}) => {
  const { preferSpeakerOutput = true, preventPhoneCallOutput = true } = options;
  const [isAudioContextReady, setIsAudioContextReady] = useState(false);
  const [availableOutputs, setAvailableOutputs] = useState<MediaDeviceInfo[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isIOSDevice = isIOS();

  // Initialize mobile audio handling
  useEffect(() => {
    const initializeMobileAudio = async () => {
      try {
        // Initialize audio context with iOS-specific settings
        const audioContext = audioOutputManager.initializeAudioContext();
        audioContextRef.current = audioContext;

        // For iOS devices, set up proper audio session
        if (isIOSDevice) {
          await setupIOSAudioSession(audioContext);
        }

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
        // Stop iOS-specific oscillator if it exists
        const oscillator = (audioContextRef.current as AudioContext & { _speakerOscillator?: OscillatorNode })._speakerOscillator;
        if (oscillator) {
          try {
            oscillator.stop();
            oscillator.disconnect();
          } catch {
            // Ignore cleanup errors
          }
        }

        audioContextRef.current.close();
      }
      audioOutputManager.cleanup();

      // Remove iOS audio session maintainer
      const audioMaintainer = document.getElementById('mobile-audio-context-maintainer');
      if (audioMaintainer) {
        audioMaintainer.remove();
      }
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

  // Force speaker output on mobile with iOS-specific handling
  const forceSpeakerOutput = async (): Promise<void> => {
    if (!isAudioContextReady) return;

    try {
      const audioContext = audioContextRef.current;
      if (!audioContext) return;

      // For iOS devices, use Web Audio API for better control
      if (isIOSDevice) {
        // Ensure audio context is running
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // Create a dedicated audio routing element for iOS
        const iosAudioElement = document.createElement('audio');
        iosAudioElement.muted = false; // Keep unmuted for iOS speaker detection
        iosAudioElement.volume = 0.1; // Low volume to avoid disturbance
        iosAudioElement.preload = 'auto';

        // iOS-specific attributes
        iosAudioElement.setAttribute('playsinline', 'true');
        iosAudioElement.setAttribute('x-webkit-airplay', 'allow');

        // Create Web Audio nodes for speaker routing
        const source = audioContext.createMediaElementSource(iosAudioElement);
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.1; // Low volume

        // Connect to destination (speaker)
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Try to play a short silent tone to establish speaker route
        iosAudioElement.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmoeBjiS2Oy9diMFl2+z5NVm';

        try {
          await iosAudioElement.play();

          // Stop after a very short duration
          setTimeout(() => {
            iosAudioElement.pause();
            iosAudioElement.currentTime = 0;
          }, 50);
        } catch (error) {
          console.warn('iOS audio routing attempt failed:', error);
        }

      } else {
        // Non-iOS devices: use standard approach
        const testAudio = document.createElement('audio');
        testAudio.muted = true;

        // Set output to speaker
        await setPreferredOutput(testAudio);

        // Play silently to establish audio routing
        await testAudio.play();
      }

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