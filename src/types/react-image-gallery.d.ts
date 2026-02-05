declare module "react-image-gallery" {
    import { ComponentType } from "react";

    export type ReactImageGalleryItem = {
        original: string;
        thumbnail?: string;
        originalAlt?: string;
        thumbnailAlt?: string;
        description?: string;
    };

    export type ReactImageGalleryProps = {
        items: ReactImageGalleryItem[];
        showPlayButton?: boolean;
        showFullscreenButton?: boolean;
        showIndex?: boolean;
        slideDuration?: number;
        [key: string]: unknown;
    };

    const ImageGallery: ComponentType<ReactImageGalleryProps>;
    export default ImageGallery;
}
