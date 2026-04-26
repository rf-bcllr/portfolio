/**
 * Optimized video sources for project thumbnails that were originally GIFs.
 * Keep <video> autoplay loop muted to mimic a GIF while shipping ~95% less bytes.
 */
import aiWritingAssistantMp4 from "@/assets/ai-writing-assistant.mp4";
import aiWritingAssistantWebm from "@/assets/ai-writing-assistant.webm";
import aiWritingAssistantPoster from "@/assets/ai-writing-assistant-poster.jpg";
import meuArcoMp4 from "@/assets/meu-arco-demo.mp4";
import meuArcoWebm from "@/assets/meu-arco-demo.webm";
import meuArcoPoster from "@/assets/meu-arco-demo-poster.jpg";
import type { VideoSource } from "@/components/MediaThumb";

export interface AnimatedMedia {
  sources: VideoSource[];
  poster: string;
}

export const animatedProjectMedia: Record<string, AnimatedMedia> = {
  "ai-writing-assistant": {
    sources: [
      { src: aiWritingAssistantWebm, type: "video/webm" },
      { src: aiWritingAssistantMp4, type: "video/mp4" },
    ],
    poster: aiWritingAssistantPoster,
  },
  "meu-arco": {
    sources: [
      { src: meuArcoWebm, type: "video/webm" },
      { src: meuArcoMp4, type: "video/mp4" },
    ],
    poster: meuArcoPoster,
  },
};
