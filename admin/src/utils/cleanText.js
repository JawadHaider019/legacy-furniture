// Maps Unicode Mathematical Bold/Italic chars back to plain ASCII
// (These are used by WhatsApp, Facebook, copy-paste tools etc. and visually look bold/italic)
export const normalizeUnicodeText = (str) => {
    if (!str) return "";
    const ranges = [
        // Bold: A-Z, a-z
        [0x1D400, 0x41], [0x1D41A, 0x61],
        // Italic: A-Z, a-z
        [0x1D434, 0x41], [0x1D44E, 0x61],
        // Bold Italic: A-Z, a-z
        [0x1D468, 0x41], [0x1D482, 0x61],
        // Bold Script: A-Z, a-z
        [0x1D4D0, 0x41], [0x1D4EA, 0x61],
        // Bold Fraktur: A-Z, a-z
        [0x1D56C, 0x41], [0x1D586, 0x61],
        // Sans-Serif: A-Z, a-z
        [0x1D5A0, 0x41], [0x1D5BA, 0x61],
        // Sans-Serif Bold: A-Z, a-z
        [0x1D5D4, 0x41], [0x1D5EE, 0x61],
        // Sans-Serif Italic: A-Z, a-z
        [0x1D608, 0x41], [0x1D622, 0x61],
        // Sans-Serif Bold Italic: A-Z, a-z
        [0x1D63C, 0x41], [0x1D656, 0x61],
        // Monospace: A-Z, a-z
        [0x1D670, 0x41], [0x1D68A, 0x61],
    ];
    return [...str].map(ch => {
        const code = ch.codePointAt(0);
        for (const [start, base] of ranges) {
            if (code >= start && code < start + 26) {
                return String.fromCharCode(base + (code - start));
            }
        }
        return ch;
    }).join('');
};

// Strip ALL HTML tags, entities, and Unicode styling so pasted text looks identical to typed text
export const cleanName = (name) => {
    return normalizeUnicodeText(
        String(name || '')
            .replace(/<[^>]*>/g, '')           // strip HTML tags
            .replace(/&nbsp;/g, ' ')           // decode &nbsp;
            .replace(/&amp;/g, '&')            // decode &amp;
            .replace(/&lt;/g, '<')             // decode &lt;
            .replace(/&gt;/g, '>')             // decode &gt;
            .replace(/&[a-z]+;/gi, ' ')        // strip remaining HTML entities
            .replace(/\u00A0/g, ' ')           // non-breaking spaces
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // zero-width chars
            .replace(/\s+/g, ' ')              // collapse whitespace
            .trim()
    );
};
