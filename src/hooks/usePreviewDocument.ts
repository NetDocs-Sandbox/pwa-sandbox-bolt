import { useState, useCallback } from 'react';

interface PreviewState {
  isOpen: boolean;
  documentId: string | null;
  position: { x: number; y: number } | null;
}

export function usePreviewDocument() {
  const [preview, setPreview] = useState<PreviewState>({
    isOpen: false,
    documentId: null,
    position: null,
  });

  const show = useCallback((documentId: string, x: number, y: number) => {
    console.log('Showing preview:', { documentId, x, y });
    setPreview({
      isOpen: true,
      documentId,
      position: { x, y },
    });
  }, []);

  const close = useCallback(() => {
    console.log('Closing preview');
    setPreview({
      isOpen: false,
      documentId: null,
      position: null,
    });
  }, []);

  return {
    isOpen: preview.isOpen,
    documentId: preview.documentId,
    position: preview.position,
    show,
    close,
  };
} 