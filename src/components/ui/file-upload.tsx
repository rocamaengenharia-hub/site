import { useCallback } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { cn, isFileTypeAllowed } from '../../lib/utils'
import { Button } from './button'

interface FileUploadProps {
    accept?: Record<string, string[]>
    maxFiles?: number
    maxSize?: number // in bytes
    value?: string[]
    onChange: (files: File[]) => void
    onRemove?: (index: number) => void // For removing existing URLs or newly added files
    disabled?: boolean
    label?: string
}

export const FileUpload = ({
    accept,
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024, // 10MB default
    value: rawValue = [], // URLs of existing files
    onChange,
    onRemove,
    disabled = false,
    label = "Arraste e solte arquivos aqui, ou clique para selecionar"
}: FileUploadProps) => {
    const value = rawValue.filter((url): url is string => typeof url === 'string' && url.length > 0)

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (rejectedFiles.length > 0) {
            console.warn('Rejected files:', rejectedFiles)
            alert(`Alguns arquivos foram rejeitados. Verifique o tipo e tamanho (Max: ${maxSize / 1024 / 1024}MB)`)
        }

        // Double-check MIME types server-side since react-dropzone only checks client-side
        let validated = acceptedFiles
        if (accept) {
            validated = acceptedFiles.filter((file) => {
                if (!isFileTypeAllowed(file, accept)) {
                    console.warn(`File rejected by MIME validation: ${file.name} (${file.type})`)
                    return false
                }
                return true
            })
            if (validated.length < acceptedFiles.length) {
                alert('Alguns arquivos foram rejeitados por tipo inválido.')
            }
        }

        const limited = validated.slice(0, maxFiles - value.length)
        if (limited.length === 0) return
        onChange(limited)
    }, [accept, maxFiles, maxSize, onChange, value.length])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxFiles: maxFiles - (value?.length || 0),
        maxSize,
        disabled: disabled || value.length >= maxFiles
    })

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25 hover:border-primary/50",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center gap-2">
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-medium">
                        {isDragActive ? "Solte os arquivos aqui" : label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Máximo {maxFiles} arquivos. Até {maxSize / 1024 / 1024}MB cada.
                    </p>
                </div>
            </div>

            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {value.map((url, index) => (
                        <div key={`url-${index}`} className="relative group rounded-md border bg-muted/40 p-2 flex flex-col items-center justify-center aspect-video overflow-hidden">
                            {url.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video src={url} className="w-full h-full object-cover" />
                            ) : (
                                <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            )}

                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onRemove && onRemove(index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
