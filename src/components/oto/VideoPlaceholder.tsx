interface VideoPlaceholderProps {
  videoUrl?: string;
  onPlayClick: () => void;
}

const VideoPlaceholder = ({ videoUrl, onPlayClick }: VideoPlaceholderProps) => {
  if (videoUrl) {
    return (
      <div className="max-w-3xl mx-auto">
        <div
          className="relative overflow-hidden rounded-xl border border-[rgba(96,165,250,0.15)]"
          style={{ paddingBottom: "56.25%" }}
        >
          <iframe
            src={videoUrl}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="relative overflow-hidden rounded-xl border border-[rgba(96,165,250,0.15)] bg-[#0f1a2e] cursor-pointer group"
        style={{ paddingBottom: "56.25%" }}
        onClick={onPlayClick}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          {/* Play button */}
          <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-full bg-[#60A5FA] flex items-center justify-center shadow-[0_0_40px_rgba(96,165,250,0.3)] transition-all duration-200 group-hover:scale-[1.08] group-hover:shadow-[0_0_40px_rgba(96,165,250,0.45)]">
            <svg
              className="w-6 h-6 text-white ml-1"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      {/* Labels below video */}
      <div className="text-center mt-4 space-y-1">
        <p className="text-sm font-medium text-[#8A95A8]">
          I recorded this for you. 2 minutes.
        </p>
        <p className="text-xs text-[#4A5568]">
          Adrian explains what Founding Members get
        </p>
      </div>
    </div>
  );
};

export default VideoPlaceholder;
