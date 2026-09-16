/**
 * Sanity project constants, kept in their own module with no side effects.
 *
 * src/lib/sanity.js calls createClient() at module scope, so importing anything
 * from it pulls @sanity/client into whatever bundle does the importing. The
 * image URL builder only needs projectId and dataset — and it is used from
 * 'use client' components — so it reads them from here instead, keeping the
 * Sanity client out of the browser bundle.
 */
export const projectId = 'gx0bybp7';
export const dataset = 'production';
export const apiVersion = '2026-07-17';
