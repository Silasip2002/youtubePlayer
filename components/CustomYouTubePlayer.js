import React, { useEffect, useRef } from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';

const CustomYouTubePlayer = (props) => {
  const playerRef = useRef(null);

  // Handle web-specific setup
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Add message event listener to handle messages from iframe
      const handleMessage = (event) => {
        // Only process messages from our iframe
        if (event.data && typeof event.data === 'string' && event.data.includes('youTubeIframeAPIReady')) {
          console.log('YouTube iframe API ready');
        }
      };

      window.addEventListener('message', handleMessage);
      
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, []);

  // Customize props based on platform
  const getPlayerProps = () => {
    const baseProps = {
      ...props,
      ref: props.ref || playerRef,
      webViewProps: {
        ...(props.webViewProps || {}),
        allowsFullscreenVideo: Platform.OS !== 'web',
        javaScriptEnabled: true,
        domStorageEnabled: true,
        allowsInlineMediaPlayback: true,
        mediaPlaybackRequiresUserAction: false,
      },
      initialPlayerParams: {
        ...(props.initialPlayerParams || {}),
        preventFullScreen: Platform.OS === 'web', // Prevent fullscreen on web to avoid issues
        origin: Platform.OS === 'web' ? window.location.origin : undefined,
      },
    };

    if (Platform.OS === 'web') {
      // Web-specific adjustments
      return {
        ...baseProps,
        webViewStyle: {
          ...(props.webViewStyle || {}),
          opacity: 0.99, // Fix for WebView issues on web
        },
      };
    }

    return baseProps;
  };

  return <YoutubePlayer {...getPlayerProps()} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CustomYouTubePlayer;
