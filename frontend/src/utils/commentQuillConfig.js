import { useMemo } from "react";

export const useCommentQuillModules = (imageHandler) => {
    return useMemo(() => ({
        toolbar: {
        container: [
            ["image", "link"],
            ["blockquote", "code-block"],
        ],
        handlers: {
            image: imageHandler,
        },
        },
    }), [imageHandler]);
    };

    export const commentFormats = [
    "image",
    "link",
    "blockquote",
    "code-block",
    ];