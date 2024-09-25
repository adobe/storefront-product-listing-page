import { useEffect, useState } from "preact/hooks";

export const useIntersectionObserver = (ref: any, options: any) => {
    const { rootMargin } = options;
    const [observerEntry, setObserverEntry] = useState<IntersectionObserverEntry | null>(null);

    useEffect(() => {
        if (!ref?.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                setObserverEntry(entry);
                if (entry.isIntersecting) {
                    observer.unobserve(entry.target);
                }
            },
            { rootMargin },
        );

        observer.observe(ref.current);

        return () => {
            observer.disconnect();
        };
    }, [ref, rootMargin]);

    return observerEntry;
};
