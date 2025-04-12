# YouTube Music Player

A React Native music player app that uses the YouTube API to search and play music videos.

## Features

- Browse trending music videos
- Search for music videos
- Create and manage playlists
- Play YouTube videos directly in the app
- Clean and modern UI

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Silasip2002/youtubePlayer.git
cd youtubePlayer
```

2. Install dependencies:
```bash
npm install
```

3. Set up your YouTube API key:
   - Copy the template config file:
   ```bash
   cp services/config.template.js services/config.js
   ```
   - Edit `services/config.js` and replace `YOUR_YOUTUBE_API_KEY_HERE` with your actual YouTube API key.

4. Start the development server:
```bash
npm start
```

## Getting a YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create credentials (API key)
5. Restrict the API key to the YouTube Data API v3

## Screens

- **Home**: Displays personalized content and recommendations
- **Explore**: Allows users to discover new music
- **Library**: Organizes the user's music collection
- **Playing**: Controls music playback with a full-screen player

## Technologies Used

- React Native
- Expo
- YouTube Data API v3
- React Navigation
- React Native WebView

## License

This project is licensed under the MIT License - see the LICENSE file for details.
