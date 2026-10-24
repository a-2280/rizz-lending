#!/usr/bin/env bash
#
# Regenerate the compressed hero videos in public/videos/.
#
# WHY THIS EXISTS
# Sanity serves `file` assets untransformed — no transcode, no resize, no poster.
# The hero uploads were 63MB and 53MB, and together with two orphaned earlier
# cuts they drove ~83% of the project's CDN egress, nearly exhausting the
# 100GB/month free-plan bandwidth cap. The site plays these compressed copies
# from /public instead; src/lib/video-sources.js maps Sanity asset IDs to them.
#
# Re-run this if a hero video is replaced. Then update the asset ID in
# src/lib/video-sources.js so the new upload resolves to the new local file —
# an unmapped upload deliberately renders the fallback image instead.
#
# Requires ffmpeg (sudo apt install ffmpeg).
#
# Usage: ./scripts/compress-videos.sh [workdir]
set -euo pipefail

WORK="${1:-$(mktemp -d)}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/videos"
BASE="https://cdn.sanity.io/files/gx0bybp7/production"

# Sanity asset ID -> output basename. Keep in sync with src/lib/video-sources.js.
ASSETS=(
  "1ff7f24730e35b04788392b5c29a7a9eddafcaec.mp4:home-hero"
  "b87e5c84c92f0025dc3b703e1e77d9212c263f6d.mp4:hypercar-hero"
)

command -v ffmpeg >/dev/null || { echo "ffmpeg not found. sudo apt install ffmpeg" >&2; exit 1; }
mkdir -p "$WORK" "$OUT"
PATHS=()

for entry in "${ASSETS[@]}"; do
  asset="${entry%%:*}"
  name="${entry##*:}"
  src="$WORK/$name-src.${asset##*.}"

  [ -f "$src" ] || { echo "==> downloading $asset"; curl -sS -o "$src" "$BASE/$asset"; }

  echo "==> probing $name"
  ffprobe -v error -select_streams v:0 \
    -show_entries stream=width,height,r_frame_rate,duration,codec_name \
    -of default=noprint_wrappers=1 "$src"

  # H.264, 1080p cap, CRF 32, slow preset. CRF 32 is deliberately aggressive:
  # these play under a dark scrim with text over them, so artifacts are hard to
  # see, and every megabyte here is repo weight AND per-visit egress. CRF 26 was
  # 15.7MB for the home hero; 32 is 7.5MB for the same 44s.
  # -an strips audio — muted autoplay backgrounds never use it.
  # +faststart moves the moov atom to the front so playback can begin before the
  # file is fully buffered; without it the first play stalls over a network.
  #
  # MP4 only. VP9/WebM saved ~14% per view but doubled what git has to carry,
  # and H.264 is universally supported.
  echo "==> encoding $name.mp4"
  ffmpeg -y -loglevel error -stats -i "$src" \
    -vf "scale='min(1920,iw)':-2:flags=lanczos" \
    -c:v libx264 -crf 32 -preset slow -profile:v high -pix_fmt yuv420p \
    -movflags +faststart -an "$WORK/$name.mp4"

  mp4_size=$(stat -c%s "$WORK/$name.mp4")

  # Poster: frame one of the ENCODED mp4, so it matches what plays exactly.
  # This is what the <video poster> attribute shows while the video loads.
  echo "==> poster $name-poster.jpg"
  ffmpeg -y -loglevel error -i "$WORK/$name.mp4" -frames:v 1 -q:v 6 "$WORK/$name-poster.jpg"

  # netlify.toml caches /videos/* as immutable for a year, so a new encode must
  # land at a new URL. Name each file by its content hash and drop the old cut.
  rm -f "$OUT/$name".*.mp4 "$OUT/$name-poster".*.jpg
  for f in "$name.mp4" "$name-poster.jpg"; do
    hash=$(sha256sum "$WORK/$f" | cut -c1-8)
    hashed="${f%.*}.$hash.${f##*.}"
    mv "$WORK/$f" "$OUT/$hashed"
    PATHS+=("$name -> /videos/$hashed")
  done

  echo "    source: $(numfmt --to=iec "$(stat -c%s "$src")")  ->  mp4: $(numfmt --to=iec "$mp4_size")"
done

echo
echo "=== public/videos ==="
ls -la "$OUT"

echo
echo "=== paste into src/lib/video-sources.js ==="
printf '%s\n' "${PATHS[@]}"
