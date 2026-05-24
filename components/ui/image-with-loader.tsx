"use client"

import { useState } from "react"
import Image, { type ImageProps } from "next/image"

import { cn } from "@/lib/utils"

type ImageWithLoaderProps = ImageProps & {
  containerClassName?: string
  overlayClassName?: string
}

export function ImageWithLoader({
  containerClassName,
  overlayClassName,
  className,
  onLoad,
  onError,
  ...props
}: ImageWithLoaderProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn("relative", containerClassName)}>
      {!loaded && (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted/60",
            overlayClassName
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs text-muted-foreground">載入中...</span>
          </div>
        </div>
      )}

      <Image
        {...props}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={(event) => {
          setLoaded(true)
          onLoad?.(event)
        }}
        onError={(event) => {
          setLoaded(true)
          onError?.(event)
        }}
      />
    </div>
  )
}

