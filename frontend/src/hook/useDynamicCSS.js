import { useEffect } from 'react';

export const useDynamicCSS = (componentName) => {
    useEffect(() => {
        function loadCSS() {
            const cssFiles = [
               `components/App/${componentName}.css`
            ];

            console.log('CSS Files to load:', cssFiles);

            const existingLinks = document.querySelectorAll('link.dynamic-css');
            existingLinks.forEach(link => link.remove());

            cssFiles.forEach(cssFile => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssFile;
                link.className = 'dynamic-css';
                document.head.appendChild(link);
                console.log('Added CSS file:', cssFile);
            });
        }

        loadCSS();
        window.addEventListener('resize', loadCSS);

        return () => {
            window.removeEventListener('resize', loadCSS);
        };
    }, [componentName]);
};