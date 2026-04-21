/**
 * Converts a product name into a URL-friendly slug.
 * e.g. "Modern Oak Sofa" → "modern-oak-sofa"
 */
export function slugify(name = '') {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')   // remove non-alphanumeric (except spaces/hyphens)
        .replace(/\s+/g, '-')           // spaces → hyphens
        .replace(/-+/g, '-');           // collapse multiple hyphens
}
