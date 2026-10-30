import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Sanitize a filename by removing path separators, special characters,
 * and other potentially dangerous characters. Keeps alphanumeric, hyphens,
 * underscores, and dots.
 */
export function sanitizeFileName(name: string): string {
    // Remove path separators and null bytes
    let sanitized = name.replace(/[/\\:\0]/g, '')
    // Remove leading dots (hidden files / directory traversal)
    sanitized = sanitized.replace(/^\.+/, '')
    // Replace any non-alphanumeric characters (except hyphen, underscore, dot) with underscore
    sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, '_')
    // Collapse multiple underscores
    sanitized = sanitized.replace(/_+/g, '_')
    // Fallback if filename is empty after sanitization
    if (!sanitized || sanitized === '') {
        sanitized = 'file'
    }
    return sanitized
}

/** MIME types considered safe for upload */
export const SAFE_UPLOAD_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'video/mp4',
    'video/webm',
    'video/ogg',
] as const

/**
 * Check if a file's MIME type matches an accept spec.
 * Supports exact matches (e.g. 'application/pdf') and wildcard
 * categories (e.g. 'image/*').
 */
export function isFileTypeAllowed(
    file: File,
    acceptSpec: Record<string, string[]>
): boolean {
    const allowedMimeKeys = Object.keys(acceptSpec)
    if (allowedMimeKeys.length === 0) return true

    return allowedMimeKeys.some((mimeKey) => {
        if (mimeKey.endsWith('/*')) {
            // Wildcard category like 'image/*'
            const category = mimeKey.replace('/*', '/')
            return file.type.startsWith(category)
        }
        // Exact MIME match
        return file.type === mimeKey
    })
}

/** Maximum file size: 10MB */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024
