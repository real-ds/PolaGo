export class CameraService {
  private stream: MediaStream | null = null;
  private facingMode: "user" | "environment" = "user";

  async startStream(facingMode: "user" | "environment" = "user"): Promise<MediaStream> {
    this.facingMode = facingMode;
    this.stopStream();
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      return this.stream;
    } catch (err) {
      throw new Error(`Camera access denied: ${(err as Error).message}`);
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
