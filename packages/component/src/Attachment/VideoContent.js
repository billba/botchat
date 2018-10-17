import React from 'react';

import HTMLVideoContent from './HTMLVideoContent';
import VimeoContent from './VimeoContent';
import YouTubeContent from './YouTubeContent';

const YOUTUBE_DOMAIN = "youtube.com";
const YOUTUBE_WWW_DOMAIN = "www.youtube.com";
const YOUTUBE_SHORT_DOMAIN = "youtu.be";
const YOUTUBE_WWW_SHORT_DOMAIN = "www.youtu.be";
const VIMEO_DOMAIN = "vimeo.com";
const VIMEO_WWW_DOMAIN = "www.vimeo.com";

// This is a workaround
// - Today, there is no good URL polyfill for older browser
// - Instead of writing a URL parser, for older browser, we will use this <a href> trick to parse the URL
function parseURL(url) {
  let urlLike;

  if (typeof URL === 'function') {
    urlLike = new URL(url);
  } else {
    urlLike = document.createElement('a');
    urlLike.setAttribute('href', url);
  }

  const { hostname, pathname, search } = urlLike;

  return { hostname, pathname, search };
}

export default props => {
  const { autoPlay, loop, poster, src } = props;
  const { hostname, pathname, search } = parseURL(src);
  const lastSegment = pathname.split('/').pop();
  const searchParams = new URLSearchParams(search);

  switch (hostname) {
    case VIMEO_DOMAIN:
    case VIMEO_WWW_DOMAIN:
      return (
        <VimeoContent
          autoPlay={ autoPlay }
          embedID={ lastSegment }
          loop={ loop }
        />
      );

    case YOUTUBE_DOMAIN:
    case YOUTUBE_WWW_DOMAIN:
      return (
        <YouTubeContent
          autoPlay={ autoPlay }
          embedID={ searchParams.get('v') }
          loop={ loop }
        />
      );

    case YOUTUBE_SHORT_DOMAIN:
    case YOUTUBE_WWW_SHORT_DOMAIN:
      return (
        <YouTubeContent
          autoPlay={ autoPlay }
          embedID={ lastSegment }
          loop={ loop }
        />
      );

    default:
      return (
        <HTMLVideoContent
          autoPlay={ autoPlay }
          loop={ loop }
          poster={ poster }
          src={ src }
        />
      );
  }
}
