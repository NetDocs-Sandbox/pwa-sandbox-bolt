import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DocumentPreview } from '../components/DocumentPreview';

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

  useEffect(() => {
    if (!isCtrlPressed) {
      setPreview(prev => ({
        isOpen: false,
        documentId: null,
        position: null,
      }));
    }
  }, [isCtrlPressed]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

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

  const shouldShowPreview = isCtrlPressed && preview.isOpen && preview.documentId && preview.position;

  return (
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
          documentId={preview.documentId}
          position={preview.position}
          onClose={close}
        />
      )}
    </PreviewContext.Provider>
  );
}

export function usePreview() {
  const context = useContext(PreviewContext);
  if (!context) {
    throw new Error('usePreview must be used within a PreviewProvider');
  }
  return context;
} 