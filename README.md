# 🎬 DictateTube

**Free YouTube Listening & Typing Tool** - Master language skills through interactive YouTube content practice

<div align="center">

![DictateTube Logo](https://raw.githubusercontent.com/khanhnq1406/resources/main/DictateTube/icon.png)

**Listen. Type. Learn.**

[![Next.js](https://img.shields.io/badge/Next.js-15.1.8-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

## ✨ Features

### 🎯 **Two Learning Modes**

- **Dictation Mode**: Listen to YouTube video segments and type what you hear
- **Shadowing Mode**: Practice speaking by repeating audio from YouTube videos

### 🎬 **YouTube Integration**

- **Automatic Transcript Fetching**: Extract transcripts from any YouTube video
- **Video Synchronization**: Seamless playback with transcript segments
- **Smart URL Handling**: Support for regular and shortened YouTube URLs

### 🗣️ **Voice Recording & Analysis**

- **Speech Recognition**: Real-time voice recording using Web Speech API
- **Silence Detection**: Automatically stops recording after 2 seconds of silence
- **Transcript Comparison**: Compare your speech with original text
- **Visual Feedback**: Color-coded accuracy indicators (green for correct, red for incorrect)
- **Progress Tracking**: Circular progress indicators showing accuracy percentage

### 📱 **Mobile Optimized**

- **Responsive Design**: Fully functional on desktop and mobile devices
- **Touch-Friendly Interface**: Optimized buttons and controls for touch screens
- **Audio Output Management**: Prevents audio from routing to phone calls on mobile

### 💾 **Data Persistence**

- **Local Storage**: Saves your progress, transcripts, and settings
- **Session Management**: Resume from where you left off
- **State Management**: Separate storage for dictation and shadowing modes

### 🎨 **Modern UI/UX**

- **Beautiful Design**: Clean, modern interface with gradient backgrounds
- **Dark Theme**: Easy on the eyes during extended practice sessions
- **Keyboard Shortcuts**: Press Escape to replay audio segments
- **Loading States**: Smooth loading animations and feedback

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/khanhnq1406/DictateTube.git
   cd DictateTube/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── contract/            # Blockchain contract API (commented out)
│   │   └── transcript/          # YouTube transcript API
│   ├── dictation/               # Dictation mode pages
│   ├── shadowing/               # Shadowing mode pages
│   └── page.tsx                 # Main landing page
├── modules/                     # Feature components
│   ├── dictation/               # Dictation mode main component
│   ├── shadowing/               # Shadowing mode main component
│   ├── video-form/              # YouTube URL input form
│   ├── video-player/            # YouTube video player
│   ├── voice-record/            # Voice recording and analysis
│   │   ├── components.tsx       # UI components
│   │   ├── helpers.ts           # Transcript comparison logic
│   │   ├── audio-helpers.ts     # Audio management utilities
│   │   └── useMobileAudio.ts    # Mobile audio optimization
│   ├── type-form/               # Typing practice component
│   ├── header/                  # Navigation header
│   └── footer/                  # Page footer
├── context/                     # React Context providers
│   └── video-form.tsx          # Video form state management
├── utils/                       # Utility functions
│   ├── transcript.ts            # Transcript parsing
│   ├── youtube.ts               # YouTube URL handling
│   └── hooks.ts                 # Custom React hooks
├── interface.tsx                # TypeScript type definitions
└── const.tsx                    # Application constants
```

## 🛠️ Technologies Used

### **Frontend Framework**

- [Next.js 15.1.8](https://nextjs.org/) - React framework with App Router
- [React 19.0.0](https://reactjs.org/) - UI library with Hooks
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript

### **Styling & UI**

- [Tailwind CSS 3.4.1](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible UI components

### **Functionality**

- [react-youtube](https://react-youtube.js.org/) - YouTube player component
- [react-speech-recognition](https://www.npmjs.com/package/react-speech-recognition) - Speech recognition
- [react-hook-form](https://react-hook-form.com/) - Form management
- [uuid](https://www.npmjs.com/package/uuid) - Unique identifier generation

## 🎯 How to Use

### **1. Start a Practice Session**

1. Enter a YouTube video URL on the main page
2. Click "Start Dictation" or "Start Shadowing"
3. The app will automatically fetch the video transcript

### **2. Dictation Mode**

1. Watch and listen to a video segment
2. Type what you hear in the text area
3. Compare your typing with the original transcript
4. Navigate between segments using arrow buttons

### **3. Shadowing Mode**

1. Click the microphone button to start recording
2. Repeat what you hear from the video
3. The app automatically stops after 2 seconds of silence
4. See your accuracy with color-coded feedback
5. Use the Next button to move to the next segment

### **4. Keyboard Shortcuts**

- **Escape**: Replay the current audio segment
- **Arrow Keys**: Navigate between segments

## 🔧 Configuration

### **Environment Variables**

Create a `.env.local` file in the root directory:

```env
# YouTube API configuration (if needed)
YOUTUBE_API_KEY=your_api_key_here
```

### **Customization**

- **Audio Detection**: Adjust silence detection timeout in `voice-record/index.tsx`
- **UI Themes**: Modify Tailwind CSS configuration in `tailwind.config.js`
- **API Endpoints**: Update transcript API settings in `utils/getTranscriptApi.ts`

## 🚀 Deployment

### **Vercel (Recommended)**

1. Connect your repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `.next`
3. Deploy automatically on git push

### **Other Platforms**

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   npm run lint
   ```
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

## 📝 Development Notes

### **Recent Updates**

- ✅ Voice recording with automatic silence detection
- ✅ Transcript comparison with visual feedback
- ✅ Shadowing mode implementation
- ✅ Mobile responsiveness improvements
- ✅ Enhanced YouTube transcript API support

### **Known Issues**

- Browser speech recognition may vary in accuracy across different languages
- Some YouTube videos may not have available transcripts
- Mobile audio output behavior may vary by device

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- YouTube for providing video content and transcripts
- React Speech Recognition community for the amazing library
- Next.js team for the excellent framework
- All contributors who help improve this project

---

<div align="center">

**Made with ❤️ for language learners worldwide**

[🔗 Visit Live Demo](https://dictatetube.vercel.app/) | [📧 Report Issues](https://github.com/khanhnq1406/DictateTube/issues) | [⭐ Star this Repo](https://github.com/khanhnq1406/DictateTube)

</div>
