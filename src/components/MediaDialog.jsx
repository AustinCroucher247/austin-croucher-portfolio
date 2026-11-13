import { useEffect, useRef, useState } from 'react';

/**
 * One native <dialog> for every piece of media on the site.
 *   { type: 'video',   title, src }
 *   { type: 'game',    title, src }
 *   { type: 'gallery', title, images: [{ src, alt, caption }], index }
 */
export default function MediaDialog({ media, onClose }) {
  const dialogRef = useRef(null);
  const [index, setIndex] = useState(0);
  const count = media?.type === 'gallery' ? media.images.length : 0;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (media && !dialog.open) dialog.showModal();
    if (!media && dialog.open) dialog.close();
    if (media?.type === 'gallery') setIndex(media.index ?? 0);
  }, [media]);

  const step = (by) => setIndex((i) => (i + by + count) % count);

  const onKeyDown = (event) => {
    if (!count) return;
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  };

  const image = count ? media.images[Math.min(index, count - 1)] : null;

  return (
    <dialog
      ref={dialogRef}
      className={`media-dialog${media ? ` media-dialog--${media.type}` : ""}`}
      aria-label={media?.title}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        // A click on the backdrop lands on the dialog element itself.
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {media ? (
        <>
          <div className="media-dialog__bar">
            <strong>
              {media.title}
              {image ? <span>{image.caption}</span> : null}
            </strong>
            {count ? (
              <span className="media-dialog__count">
                {index + 1} / {count}
              </span>
            ) : null}
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
          <div className="media-dialog__stage">
            {media.type === 'video' ? <video src={media.src} controls autoPlay playsInline /> : null}
            {media.type === 'game' ? (
              <iframe src={media.src} title={media.title} onLoad={(event) => event.target.focus()} />
            ) : null}
            {image ? (
              <>
                <img src={image.src} alt={image.alt} />
                <button type="button" className="media-dialog__nav" onClick={() => step(-1)} aria-label="Previous image">
                  ←
                </button>
                <button
                  type="button"
                  className="media-dialog__nav media-dialog__nav--next"
                  onClick={() => step(1)}
                  aria-label="Next image"
                >
                  →
                </button>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </dialog>
  );
}
