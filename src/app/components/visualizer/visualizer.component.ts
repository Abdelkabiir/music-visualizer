import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { AudioService } from '../../services/audio.service';
import { Subject, takeUntil } from 'rxjs';
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-visualizer',
  templateUrl: './visualizer.component.html',
  styleUrls: ['visualizer.component.scss'],
  imports: [
    CommonModule,
    FormsModule
  ],
  standalone: true
})
export class VisualizerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('visualizerCanvas') mainCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('backgroundCanvas') bgCanvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('particleCanvas') particleCanvasRef!: ElementRef<HTMLCanvasElement>;

  private mainCtx!: CanvasRenderingContext2D;
  private bgCtx!: CanvasRenderingContext2D;
  private particleCtx!: CanvasRenderingContext2D;
  private destroy$ = new Subject<void>();
  private particles: any[] = [];
  private animationFrameId: number = 0;

  currentTime: string = '00:00';
  isPlaying: boolean = false;
  duration: string = '00:00';
  songTitle: string = 'Select a song';

  constructor(private audioService: AudioService) {}

  ngOnInit() {
    this.audioService.isPlaying$
      .pipe(takeUntil(this.destroy$))
      .subscribe(playing => this.isPlaying = playing);

    this.audioService.currentTime$
      .pipe(takeUntil(this.destroy$))
      .subscribe(time => this.currentTime = time);

    this.audioService.duration$
      .pipe(takeUntil(this.destroy$))
      .subscribe(duration => this.duration = duration);

    this.audioService.title$
      .pipe(takeUntil(this.destroy$))
      .subscribe(title => this.songTitle = title);
  }

  ngAfterViewInit() {
    this.initializeCanvases();
    this.createParticles();
    this.animate();
    this.drawCityscape();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    cancelAnimationFrame(this.animationFrameId);
  }

  private initializeCanvases() {
    this.mainCtx = this.mainCanvasRef.nativeElement.getContext('2d')!;
    this.bgCtx = this.bgCanvasRef.nativeElement.getContext('2d')!;
    this.particleCtx = this.particleCanvasRef.nativeElement.getContext('2d')!;

    this.resizeCanvases();
    window.addEventListener('resize', () => this.resizeCanvases());
  }

  private resizeCanvases() {
    [this.mainCanvasRef, this.bgCanvasRef, this.particleCanvasRef].forEach(canvasRef => {
      const canvas = canvasRef.nativeElement;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
    this.drawCityscape(); // Redraw background when resizing
  }

  private drawCityscape() {
    const canvas = this.bgCanvasRef.nativeElement;
    const ctx = this.bgCtx;
    const width = canvas.width;
    const height = canvas.height;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#000022');
    gradient.addColorStop(1, '#001133');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw buildings
    ctx.fillStyle = '#000033';
    for (let i = 0; i < width; i += 40) {
      const buildingHeight = Math.random() * (height * 0.5) + (height * 0.2);
      ctx.fillRect(i, height - buildingHeight, 30, buildingHeight);
    }

    // Add reflection
    ctx.save();
    ctx.globalAlpha = 0.2;
    ctx.scale(1, -0.3);
    ctx.translate(0, -height * 3.3);
    for (let i = 0; i < width; i += 40) {
      const buildingHeight = Math.random() * (height * 0.5) + (height * 0.2);
      ctx.fillRect(i, height - buildingHeight, 30, buildingHeight);
    }
    ctx.restore();
  }

  private drawVisualization(audioData: Uint8Array) {
    const canvas = this.mainCanvasRef.nativeElement;
    const ctx = this.mainCtx;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.4;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw outer glow
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Draw frequency bars
    const barCount = 180;
    const barWidth = 2;
    const barMaxHeight = radius * 0.5;

    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const dataIndex = Math.floor((i / barCount) * audioData.length);
      const value = audioData[dataIndex];
      const barHeight = (value / 255) * barMaxHeight;

      const startX = centerX + Math.cos(angle) * radius;
      const startY = centerY + Math.sin(angle) * radius;
      const endX = centerX + Math.cos(angle) * (radius + barHeight);
      const endY = centerY + Math.sin(angle) * (radius + barHeight);

      ctx.beginPath();
      ctx.strokeStyle = `rgba(255, 255, 255, ${value / 255})`;
      ctx.lineWidth = barWidth;
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw inner circle with glow
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'white';
    ctx.arc(centerX, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  private createParticle() {
    return {
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 2,
      speed: Math.random() * 1 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.5
    };
  }

  private createParticles() {
    for (let i = 0; i < 100; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private updateParticles() {
    const canvas = this.particleCanvasRef.nativeElement;
    const ctx = this.particleCtx;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach((particle: any, index: number) => {
      particle.y += particle.speed;
      particle.x += particle.speedX;
      particle.opacity -= 0.005;

      if (particle.y > canvas.height || particle.opacity <= 0) {
        this.particles[index] = this.createParticle();
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    const audioData = this.audioService.getAudioData();
    this.drawVisualization(audioData);
    this.updateParticles();
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.audioService.loadFile(file);
    }
  }

  togglePlay() {
    this.audioService.togglePlay();
  }
}
