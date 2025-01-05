import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioContext: AudioContext;
  private analyser: AnalyserNode;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private audioElement: HTMLAudioElement;

  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private currentTimeSubject = new BehaviorSubject<string>('00:00');
  private durationSubject = new BehaviorSubject<string>('00:00');
  private titleSubject = new BehaviorSubject<string>('Select a song');

  constructor() {
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.audioElement = new Audio();

    // Configure analyser
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.8;

    // Setup audio element listeners
    this.audioElement.addEventListener('play', () => this.isPlayingSubject.next(true));
    this.audioElement.addEventListener('pause', () => this.isPlayingSubject.next(false));
    this.audioElement.addEventListener('ended', () => this.isPlayingSubject.next(false));
    this.audioElement.addEventListener('timeupdate', () => this.updateTime());
    this.audioElement.addEventListener('loadedmetadata', () => this.updateDuration());
  }

  loadFile(file: File): void {
    const fileURL = URL.createObjectURL(file);
    this.audioElement.src = fileURL;

    // Update title (remove file extension)
    const title = file.name.replace(/\.[^/.]+$/, "");
    this.titleSubject.next(title);

    // Create and connect nodes if not already connected
    if (!this.sourceNode) {
      this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
      this.sourceNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);
    }
  }

  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  private updateTime(): void {
    const timeString = this.formatTime(this.audioElement.currentTime);
    this.currentTimeSubject.next(timeString);
  }

  private updateDuration(): void {
    const durationString = this.formatTime(this.audioElement.duration);
    this.durationSubject.next(durationString);
  }

  play(): void {
    this.audioContext.resume().then(() => {
      this.audioElement.play();
    });
  }

  pause(): void {
    this.audioElement.pause();
  }

  togglePlay(): void {
    if (this.audioElement.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  getAudioData(): Uint8Array {
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  get isPlaying$(): Observable<boolean> {
    return this.isPlayingSubject.asObservable();
  }

  get currentTime$(): Observable<string> {
    return this.currentTimeSubject.asObservable();
  }

  get duration$(): Observable<string> {
    return this.durationSubject.asObservable();
  }

  get title$(): Observable<string> {
    return this.titleSubject.asObservable();
  }
}
