# Music Visualizer

An interactive music visualization application built with Angular and Web Audio API. The application creates stunning visual representations of audio in real-time, featuring a circular visualizer with frequency bars and particle effects.

## Features

- Real-time audio visualization
- Multiple visualization layers:
  - Circular frequency bars
  - Particle effects
  - City skyline background
- Audio playback controls
- Time and duration display
- File upload support
- Responsive design
- Glow effects and animations

## Demo

![Screenshot 2025-01-05 at 15 40 59](https://github.com/user-attachments/assets/83523406-4a10-44fc-ae68-a3594769885a)

## Technologies Used

- Angular (latest version)
- TypeScript
- Web Audio API
- HTML5 Canvas
- RxJS
- SCSS

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (latest version)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Abdelkabiir/music-visualizer.git
cd music-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Open your browser and navigate to `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── visualizer/
│   │       ├── visualizer.component.ts
│   │       ├── visualizer.component.html
│   │       └── visualizer.component.scss
│   ├── services/
│   │   └── audio.service.ts
│   ├── app.module.ts
│   └── app.component.ts
└── ...
```

## Key Components

### Audio Service
Handles audio processing and analysis using Web Audio API:
- Audio file loading
- Frequency data analysis
- Playback control
- Time tracking

### Visualizer Component
Manages the visual representation:
- Multiple canvas layers
- Real-time rendering
- Interactive controls
- Particle system
- Background effects

## Usage

1. Click "Select Audio" to choose an audio file
2. Use the play/pause button to control playback
3. Watch the visualization respond to the audio
4. Current time and duration are displayed at the top
5. The visualization automatically adjusts to audio frequencies

## Development

To modify the visualizer:

1. Visualization types can be adjusted in `visualizer.component.ts`
2. Styles can be modified in `visualizer.component.scss`
3. Audio processing can be customized in `audio.service.ts`

### Adding New Features

To add new visualization types:
1. Create a new draw method in `VisualizerComponent`
2. Add any necessary controls in the template
3. Update the animation loop to include the new visualization

## Future Enhancements

Potential improvements:
- Additional visualization types
- Audio effects and filters
- Playlist support
- Color theme customization
- Progress bar and seeking
- Volume control
- Preset patterns

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by various audio visualization techniques
- Uses Web Audio API for audio analysis
- Canvas-based rendering for performance
- Particle system for enhanced visuals
