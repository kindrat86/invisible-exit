const VIDEO_URL =
  "https://maybpahtbbcxnucposjy.supabase.co/storage/v1/object/public/videos/Avatar_Video_oto.mp4";

const VideoPlaceholder = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="overflow-hidden rounded-xl border border-[rgba(96,165,250,0.15)]">
        <video
          className="w-full aspect-video bg-black/20"
          controls
          preload="metadata"
          playsInline
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
      </div>
      {/* Labels below video */}
      <div className="text-center mt-4 space-y-1">
        <p className="text-sm font-medium text-white/70">
          I recorded this for you. 2 minutes.
        </p>
        <p className="text-xs text-white/40">
          Adrian explains what Founding Members get
        </p>
      </div>
    </div>
  );
};

export default VideoPlaceholder;
