import { useMemo } from "react";

export const useThumbSize = (viewSize: number, scrollSize: number) => {
    return useMemo(() => {
        if (viewSize >= scrollSize) {
            return viewSize;
        }
        else {
            const overloadsize = scrollSize - viewSize;
            const thumbPercent = 1 - (overloadsize / viewSize);
            const thumbwidth = thumbPercent < 0 ? 20 : thumbPercent * viewSize;
            return thumbwidth;
        }
    }, [viewSize, scrollSize]);
}
