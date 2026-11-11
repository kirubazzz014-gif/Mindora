import React, { useState } from 'react';
import { YouTubeVideoInfo } from '../types';
import { extractYouTubeId, fetchYouTubeMetadata, CURATED_EDUCATIONAL_VIDEOS } from '../utils/youtube';
import { Mascot } from './Mascot';
import { Link2, Play, Check, AlertCircle, Loader2, Sparkles, BookOpen, Clock, ChevronRight } from 'lucide-react';

interface VideoSelectorProps {
  onVideoSelected: (video: YouTubeVideoInfo) => void;
  selectedVideo: YouTubeVideoInfo | null;
}

export const VideoSelector: React.FC<VideoSelectorProps> = ({ onVideoSelected, selectedVideo }) => {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewVideo, setPreviewVideo] = useState<YouTubeVideoInfo | null>(selectedVideo);

  const handleValidateAndLoad = async (urlToParse: string) => {
    const videoId = extractYouTubeId(urlToParse);
    if (!videoId) {
      setError('Please paste a valid YouTube video link (e.g. youtube.com/watch?v=... or youtu.be/...)');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const info = await fetchYouTubeMetadata(videoId);
      setPreviewVideo(info);
    } catch {
      setError('Could not fetch video details. Please ensure the link is public.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPreset = (preset: YouTubeVideoInfo) => {
    setUrlInput(preset.url);
    setError(null);
    setPreviewVideo(preset);
  };

  const handleConfirm = () => {
    if (previewVideo) {
      onVideoSelected(previewVideo);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dashboard Mascot Greeting Banner */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3.5 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033] flex items-center gap-3 shadow-xs">
        <Mascot size="sm" animate={true} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-[#1E293B] dark:text-[#F5F0E6] flex items-center gap-1.5">
            <span>Ready to focus?</span>
            <span className="text-[10px] font-bold text-[#87CEEB] uppercase tracking-wide">
              Focus. Learn. Grow.
            </span>
          </p>
          <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8] mt-0.5 leading-snug">
            Paste your lesson below. Mindora blocks distracting apps and unrelated video recommendations.
          </p>
        </div>
      </div>

      {/* Title & Explainer */}
      <div>
        <h2 className="text-sm font-bold text-[#1E293B] dark:text-[#F5F0E6] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#3A89A8] dark:text-[#87CEEB]" />
          Step 1: Choose Educational Video
        </h2>
      </div>

      {/* URL Input Box */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3.5 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033]">
        <label className="block text-[11px] font-bold text-[#1E293B] dark:text-[#E8F6FC] mb-1.5">
          Paste YouTube Video URL
        </label>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (error) setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleValidateAndLoad(urlInput);
                }
              }}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D5C9B3] dark:border-[#383A3D] bg-white dark:bg-[#181A1B] text-xs text-[#1E293B] dark:text-white placeholder-[#94A3B8] focus:outline-hidden focus:border-[#87CEEB] focus:ring-1 focus:ring-[#87CEEB]"
            />
          </div>

          <button
            type="button"
            onClick={() => handleValidateAndLoad(urlInput)}
            disabled={isLoading || !urlInput.trim()}
            className="px-3.5 py-2 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] disabled:opacity-50 text-[#1E293B] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-xs font-medium mt-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Preview Card if video loaded */}
      {previewVideo && (
        <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3.5 rounded-2xl border-2 border-[#87CEEB] shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A89A8] dark:text-[#87CEEB] flex items-center gap-1">
              <Check className="w-3 h-3" />
              Selected Focus Video
            </span>
            <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#A0AAB8] flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#3A89A8] dark:text-[#87CEEB]" />
              {previewVideo.durationFormatted}
            </span>
          </div>

          <div className="flex gap-3 items-start">
            <div className="relative w-28 aspect-video rounded-xl overflow-hidden bg-black shrink-0 border border-black/10">
              <img
                src={previewVideo.thumbnailUrl}
                alt={previewVideo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-7 h-7 rounded-full bg-[#87CEEB] flex items-center justify-center shadow-xs">
                  <Play className="w-3.5 h-3.5 fill-[#1E293B] text-[#1E293B] ml-0.5" />
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-[#1E293B] dark:text-[#F5F0E6] line-clamp-2 leading-snug">
                {previewVideo.title}
              </h3>
              <p className="text-[11px] text-[#64748B] dark:text-[#A0AAB8] mt-1 font-medium">
                {previewVideo.author}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirm}
            className="w-full mt-3 py-2.5 px-4 rounded-xl bg-[#87CEEB] hover:bg-[#72BFDE] text-[#1E293B] text-xs font-black flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-colors"
          >
            <span>Proceed to Timer & App Blocker</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Preset Curated Educational Videos Library */}
      <div className="bg-[#FAF7F2] dark:bg-[#202224] p-3.5 rounded-2xl border border-[#E8DEC9] dark:border-[#2D3033]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-[#1E293B] dark:text-[#F5F0E6] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#3A89A8] dark:text-[#87CEEB]" />
            Or Pick from Popular Educational Lectures
          </span>
          <span className="text-[10px] text-[#64748B]">1-Click</span>
        </div>

        <div className="space-y-2">
          {CURATED_EDUCATIONAL_VIDEOS.map((item) => {
            const isChosen = previewVideo?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPreset(item)}
                className={`w-full p-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                  isChosen
                    ? 'border-[#87CEEB] bg-[#87CEEB]/15'
                    : 'border-[#E8DEC9]/60 dark:border-[#383A3D] bg-white dark:bg-[#181A1B] hover:border-[#87CEEB]/60'
                }`}
              >
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  className="w-14 h-9 rounded-lg object-cover shrink-0 bg-neutral-900"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-bold text-[#1E293B] dark:text-[#F5F0E6] truncate">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-[#64748B] dark:text-[#A0AAB8]">
                    {item.author} · {item.durationFormatted}
                  </p>
                </div>
                {isChosen && (
                  <div className="w-5 h-5 rounded-full bg-[#87CEEB] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#1E293B]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
