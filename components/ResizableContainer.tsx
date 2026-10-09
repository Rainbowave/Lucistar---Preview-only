
import React, { useState, useRef, useEffect } from 'react';

interface ResizableContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  canInteract?: boolean;
  initialSize?: { width: string | number; height: string | number };
  initialPosition?: { x: number; y: number };
  onLayoutChange?: (size: { width: string | number; height: string | number }, position: { x: number; y: number }) => void;
}

export function ResizableContainer({ 
  children, 
  className = '', 
  id, 
  canInteract = true,
  initialSize = { width: '100%', height: 'auto' },
  initialPosition = { x: 0, y: 0 },
  onLayoutChange
}: ResizableContainerProps) {
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const containerRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  const startOffset = useRef({ x: 0, y: 0 });
  const resizeDirection = useRef<string | null>(null);

  // Update internal state if initial props change (e.g. on reset)
  useEffect(() => {
    setSize(initialSize);
    setPosition(initialPosition);
  }, [initialSize.width, initialSize.height, initialPosition.x, initialPosition.y]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const onMouseDown = (e: React.MouseEvent, direction: string | null = null) => {
    if (!canInteract) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    startPos.current = { x: e.clientX, y: e.clientY };
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      startSize.current = { width: rect.width, height: rect.height };
      startOffset.current = { x: position.x, y: position.y };
    }

    if (direction) {
      isResizing.current = true;
      resizeDirection.current = direction;
    } else {
      isDragging.current = true;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (isResizing.current && resizeDirection.current) {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;
      let newX = startOffset.current.x;
      let newY = startOffset.current.y;

      if (resizeDirection.current.includes('right')) {
        newWidth = startSize.current.width + deltaX;
      }
      if (resizeDirection.current.includes('left')) {
        newWidth = startSize.current.width - deltaX;
        newX = startOffset.current.x + deltaX;
      }
      if (resizeDirection.current.includes('bottom')) {
        newHeight = startSize.current.height + deltaY;
      }
      if (resizeDirection.current.includes('top')) {
        newHeight = startSize.current.height - deltaY;
        newY = startOffset.current.y + deltaY;
      }

      setSize({ width: Math.max(50, newWidth), height: Math.max(50, newHeight) });
      setPosition({ x: newX, y: newY });
    } else if (isDragging.current) {
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      setPosition({
        x: startOffset.current.x + deltaX,
        y: startOffset.current.y + deltaY
      });
    }
  };

  const onMouseUp = () => {
    if (isResizing.current || isDragging.current) {
      if (onLayoutChange) {
        onLayoutChange(size, position);
      }
    }
    isResizing.current = false;
    isDragging.current = false;
    resizeDirection.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  return (
    <div 
      id={id}
      ref={containerRef}
      className={`relative group ${className} ${canInteract ? 'ring-1 ring-primary/20 ring-inset' : ''}`}
      style={{ 
        width: typeof size.width === 'number' ? `${size.width}px` : size.width, 
        height: typeof size.height === 'number' ? `${size.height}px` : size.height,
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: !canInteract ? 'default' : isDragging.current ? 'grabbing' : 'move',
        borderRadius: '5px',
        zIndex: isDragging.current || isResizing.current ? 100 : 'auto',
        transition: isDragging.current || isResizing.current ? 'none' : 'transform 0.2s ease, width 0.2s ease, height 0.2s ease'
      }}
      onMouseDown={(e) => {
        // Only drag if clicking the container itself or non-interactive parts
        if (canInteract && e.target === e.currentTarget) {
          onMouseDown(e);
        }
      }}
    >
      {/* Resizer Handles Overlay */}
      {canInteract && (
        <>
          <div className="absolute inset-0 pointer-events-none border border-primary/40 rounded-[5px] z-40"></div>
          
          {/* Top Handle */}
          <div 
            className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-primary/40 z-50"
            onMouseDown={(e) => onMouseDown(e, 'top')}
          ></div>
          {/* Bottom Handle */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-primary/40 z-50"
            onMouseDown={(e) => onMouseDown(e, 'bottom')}
          ></div>
          {/* Left Handle */}
          <div 
            className="absolute top-0 bottom-0 left-0 w-2 cursor-ew-resize hover:bg-primary/40 z-50"
            onMouseDown={(e) => onMouseDown(e, 'left')}
          ></div>
          {/* Right Handle */}
          <div 
            className="absolute top-0 bottom-0 right-0 w-2 cursor-ew-resize hover:bg-primary/40 z-50"
            onMouseDown={(e) => onMouseDown(e, 'right')}
          ></div>
          
          {/* Corner Handles */}
          <div 
            className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize bg-primary/60 hover:bg-primary z-50 rounded-full -translate-x-2 -translate-y-2"
            onMouseDown={(e) => onMouseDown(e, 'topleft')}
          ></div>
          <div 
            className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize bg-primary/60 hover:bg-primary z-50 rounded-full translate-x-2 -translate-y-2"
            onMouseDown={(e) => onMouseDown(e, 'topright')}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize bg-primary/60 hover:bg-primary z-50 rounded-full -translate-x-2 translate-y-2"
            onMouseDown={(e) => onMouseDown(e, 'bottomleft')}
          ></div>
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize bg-primary/60 hover:bg-primary z-50 rounded-full translate-x-2 translate-y-2"
            onMouseDown={(e) => onMouseDown(e, 'bottomright')}
          ></div>
        </>
      )}

      <div className="w-full h-full overflow-hidden rounded-[5px]">
        {children}
      </div>
    </div>
  );
};
