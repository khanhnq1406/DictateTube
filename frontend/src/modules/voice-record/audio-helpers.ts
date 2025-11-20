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