import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file) // Reads the file as a data URL (includes base64)
        reader.onload = () => {
            const result = reader.result
            // Remove the Data URL prefix (e.g., "data:image/png;base64,")
            const base64Data = result.split(',')[1]
            if (base64Data) {
                resolve(base64Data)
            } else {
                reject(new Error('Could not extract base64 data from file.'))
            }
        }
        reader.onerror = (error) => reject(error)
    })
}

export const base64ToDataUrl = (base64, mimeType = 'image/png') => {
    return `data:${mimeType};base64,${base64}`
}
