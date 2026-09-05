export class CameraService {
  private stream: MediaStream | null = null;
  private facingMode: "user" | "environment" = "user";

  private getMediaDevices(): MediaDevices | null {
    if (typeof navigator === "undefined") return null;
    return navigator.mediaDevices || null;
  }

  private async requestCameraAccess(constraints: MediaStreamConstraints): Promise<MediaStream> {
    const mediaDevices = this.getMediaDevices();

    if (mediaDevices) {
      try {
        return await mediaDevices.getUserMedia(constraints);
      } catch {
        // Fall through to legacy API
      }
    }

    // Legacy fallback for HTTP contexts
    if (typeof navigator !== "undefined" && (navigator as any).getUserMedia) {
      return new Promise((resolve, reject) => {
        (navigator as any).getUserMedia(
          constraints,
          (stream: MediaStream) => resolve(stream),
          (err: Error) => reject(err)
        );
      });
    }

    throw new Error("Camera not supported in this browser. Please use Chrome, Firefox, or Safari.");
  }

  async startStream(facingMode: "user" | "environment" = "user"): Promise<MediaStream> {
    this.facingMode = facingMode;
    this.stopStream();

    if (typeof navigator === "undefined") {
      throw new Error("Camera not supported in this environment.");
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      this.stream = await this.requestCameraAccess(constraints);
      return this.stream;
    } catch (err) {
      const error = err as Error;
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        throw new Error("Camera access denied. Please allow camera access in your browser settings and refresh the page.");
      }
      if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        throw new Error("No camera found. Please connect a camera and try again.");
      }
      if (error.name === "NotReadableError" || error.name === "TrackStartError") {
        throw new Error("Camera is already in use by another application.");
      }
      if (error.name === "OverconstrainedError") {
        throw new Error("Camera doesn't support the required resolution. Try a different camera.");
      }
      throw new Error(`Camera error: ${error.message}`);
    }
  }

  stopStream(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
  }

  async switchCamera(): Promise<MediaStream> {
    const newFacing = this.facingMode === "user" ? "environment" : "user";
    return this.startStream(newFacing);
  }

  getStream(): MediaStream | null {
    return this.stream;
  }

  getFacingMode(): "user" | "environment" {
    return this.facingMode;
  }

  captureFrame(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx || !this.stream) throw new Error("No stream or context available");
    const video = document.createElement("video");
    video.srcObject = this.stream;
    video.play();
    ctx.drawImage(video, 0, 0, width, height);
    video.remove();
    return canvas;
  }
}
