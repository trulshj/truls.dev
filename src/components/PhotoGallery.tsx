import ImageGallery from "react-image-gallery";

export type GalleryItem = {
    original: string;
    thumbnail: string;
    originalAlt?: string;
    thumbnailAlt?: string;
    description?: string;
};

type PhotoGalleryProps = {
    items: GalleryItem[];
};

export default function PhotoGallery({ items }: PhotoGalleryProps) {
    return (
        <ImageGallery
            items={items}
            showPlayButton={false}
            showFullscreenButton={true}
            showIndex={false}
            slideDuration={250}
        />
    );
}
