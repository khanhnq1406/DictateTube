// Audio helpers to control output routing on mobile devices

export interface AudioDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput';
}

export class AudioOutputManager {
  private audioElement: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;

  // Initialize audio context for better mobile control
  initializeAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioContextClass();

      // Configure for better iOS performance
      this.audioContext.destination.channelInterpretation = 'discrete';
      this.audioContext.destination.channelCount = 2; // Stereo for speaker output
    }
    return this.audioContext;
  }

  // Set audio output sink for mobile devices
  async setAudioOutputSink(element: HTMLAudioElement, deviceId?: string): Promise<void> {
    if (!deviceId) {
      // Try to find speaker output device
      const devices = await navigator.mediaDevices.enumerateDevices();
      const outputDevices = devices.filter(device => device.kind === 'audiooutput');

      // Look for device that might be the main speaker
      const speakerDevice = outputDevices.find(device =>
        device.label.toLowerCase().includes('speaker') ||
        device.label.toLowerCase().includes('built-in')
      );

      if (speakerDevice) {
        deviceId = speakerDevice.deviceId;
      }
    }

    try {
      await (element as HTMLAudioElement).setSinkId(deviceId || 'default');
    } catch (error) {
      console.warn('Failed to set audio output sink:', error);
    }
  }

  // Request audio with proper constraints for mobile
  async getAudioStream(): Promise<MediaStream> {
    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
        // Force use of built-in microphone
        deviceId: undefined
      },
      video: false
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      // Force audio context state for mobile
      const audioContext = this.initializeAudioContext();
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      return stream;
    } catch (error) {
      console.error('Failed to get audio stream:', error);
      throw error;
    }
  }

  // Play audio with proper mobile handling
  async playAudioWithOutput(element: HTMLAudioElement): Promise<void> {
    try {
      // Set up audio element for mobile
      element.muted = false; // Ensure not muted

      // Try to set output to main speaker
      await this.setAudioOutputSink(element);

      // Play with user gesture context
      await element.play();
    } catch (error) {
      console.error('Failed to play audio:', error);
      throw error;
    }
  }

  // Force iOS speaker output using Web Audio API
  async forceIOSSpeakerOutput(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = this.initializeAudioContext();
    }

    try {
      // Ensure audio context is running
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Create a high-frequency tone that routes to speaker
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      // Set frequency to 20kHz (near ultrasonic - mostly inaudible)
      oscillator.frequency.value = 20000;
      gainNode.gain.value = 0.001; // Very low volume

      // Connect to speaker output
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Play for a very short duration to establish speaker route
      oscillator.start();

      // Stop after 100ms
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
      }, 100);

    } catch (error) {
      console.warn('Failed to force iOS speaker output:', error);
    }
  }

  // Create a dedicated iOS speaker routing element
  createIOSSpeakerElement(): HTMLAudioElement {
    const audio = new Audio();

    // iOS-specific attributes
    audio.setAttribute('playsinline', 'true');
    audio.setAttribute('x-webkit-airplay', 'allow');
    audio.setAttribute('controls', ''); // May help with audio routing

    // Configure for speaker output
    audio.muted = false;
    audio.volume = 0.05; // Very low volume
    audio.preload = 'auto';

    return audio;
  }

  // Cleanup
  cleanup(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioElement = null;
  }
}

// Export singleton instance
export const audioOutputManager = new AudioOutputManager();