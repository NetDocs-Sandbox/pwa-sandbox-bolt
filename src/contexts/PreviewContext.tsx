import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { DocumentPreview } from '../components/DocumentPreview';
import { throttle } from 'lodash';

interface PreviewState {
  isOpen: boolean;
  documentId: string | null;
  position: { x: number; y: number } | null;
}

interface PreviewContextType {
  isOpen: boolean;
  documentId: string | null;
  position: { x: number; y: number } | null;
  isCtrlPressed: boolean;
  show: (documentId: string, x: number, y: number) => void;
  close: () => void;
}

const PreviewContext = createContext<PreviewContextType | null>(null);

export function PreviewProvider({ children }: { children: React.ReactNode }) {
  const [preview, setPreview] = useState<PreviewState>({
    isOpen: false,
    documentId: null,
    position: null,
  });
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const ctrlPressedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        ctrlPressedRef.current = true;
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        ctrlPressedRef.current = false;
        setIsCtrlPressed(false);
        setPreview({
          isOpen: false,
          documentId: null,
          position: null,
        });
      }
    };

    const handleMouseMove = throttle((e: MouseEvent) => {
      const newCtrlState = e.ctrlKey;
      if (newCtrlState !== ctrlPressedRef.current) {
        ctrlPressedRef.current = newCtrlState;
        setIsCtrlPressed(newCtrlState);
        if (!newCtrlState) {
          setPreview({
            isOpen: false,
            documentId: null,
            position: null,
          });
        }
      }
    }, 100);

    const handleBlur = () => {
      ctrlPressedRef.current = false;
      setIsCtrlPressed(false);
      setPreview({
        isOpen: false,
        documentId: null,
        position: null,
      });
    };

    if (containerRef.current) {
      containerRef.current.focus();
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('blur', handleBlur);
      handleMouseMove.cancel();
    };
  }, []);

  const shouldShowPreview = Boolean(
    isCtrlPressed && 
    preview.isOpen && 
    preview.documentId && 
    preview.position && 
    preview.position.x && 
    preview.position.y
  );

  const show = useCallback((documentId: string, x: number, y: number) => {
    if (!isCtrlPressed) return;
    
    setPreview({
      isOpen: true,
      documentId,
      position: { x, y },
    });
  }, [isCtrlPressed]);

  const close = useCallback(() => {
    setPreview({
      isOpen: false,
      documentId: null,
      position: null,
    });
  }, []);

  return (
    <div 
      ref={containerRef}
      tabIndex={-1} 
      style={{ outline: 'none' }}
      className="h-full"
    >
      <PreviewContext.Provider
        value={{
          isOpen: preview.isOpen,
          documentId: preview.documentId,
          position: preview.position,
          isCtrlPressed,
          show,
          close,
        }}
      >
        {children}
        {shouldShowPreview && (
          <DocumentPreview
            documentId={preview.documentId!}
            position={preview.position!}
            onClose={close}
          />
        )}
      </PreviewContext.Provider>
    </div>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
} 