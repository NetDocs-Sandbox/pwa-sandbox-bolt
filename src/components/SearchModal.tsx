import React, { useEffect, useState } from 'react';
import { FiSearch, FiX, FiFolder, FiFile } from 'react-icons/fi'
import { Document, Client, Matter } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  clients: Client[];
  matters: Matter[];
  onDocumentClick: (doc: Document) => void;
}

export function SearchModal({
  isOpen,
  onClose,
  documents,
  clients,
  matters,
  onDocumentClick,
}: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Document[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % results.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
      }
      if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        const selectedDoc = results[selectedIndex];
        onDocumentClick(selectedDoc);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, results, selectedIndex, onDocumentClick]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = documents.filter(doc => {
        const client = clients.find(c => c.id === doc.clientId);
        const matter = matters.find(m => m.id === doc.matterId);
        
        return (
          doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          matter?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setResults(filtered.slice(0, 10));
    } else {
      setResults([]);
    }
  }, [searchTerm, documents, clients, matters]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" onClick={handleBackdropClick}>
      <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4" onClick={handleBackdropClick}>
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="flex items-center p-4 border-b border-gray-200">
            <FiSearch className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              className="flex-1 px-4 py-1 text-base bg-transparent border-none focus:outline-none focus:ring-0"
              placeholder="Search documents, clients, or matters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="p-2">
              {results.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {results.map((doc, index) => {
                    const client = clients.find(c => c.id === doc.clientId);
                    const matter = matters.find(m => m.id === doc.matterId);

                    return (
                      <button
                        key={doc.id}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left
                          ${index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        onClick={() => {
                          onDocumentClick(doc);
                          onClose();
                        }}
                        onMouseEnter={(e) => {
                          setSelectedIndex(index);
                        }}
                      >
                        {doc.type === 'folder' ? (
                          <FiFolder className="h-4 w-4 text-gray-400" />
                        ) : (
                          <FiFile className="h-4 w-4 text-gray-400" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">
                            {client?.name} {matter && `• ${matter.name}`}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            Last modified {new Date(doc.lastActiveAt).toLocaleDateString()}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : searchTerm ? (
                <div className="p-4 text-center text-gray-500">
                  No results found for "{searchTerm}"
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}