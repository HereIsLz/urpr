import React from 'react';

export const useScrollTop = () => {
    const [scrollTop, setScrollTop] = React.useState(document.documentElement.scrollTop);

    React.useEffect(() => {
        const handle = () => setScrollTop(document.documentElement.scrollTop);
        window.addEventListener("scroll", handle);
        window.addEventListener("resize", handle);
        return () => { window.removeEventListener("scroll", handle); window.removeEventListener("resize", handle); }
    }, []);
    return { scrollTop };
}