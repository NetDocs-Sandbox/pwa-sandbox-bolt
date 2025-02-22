import React, { useEffect, useState } from 'react';
import { Search, X, FolderClosed, File } from 'lucide-react';
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-25 transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="flex items-center p-4 border-b border-gray-200">
            <Search className="w-5 h-5 text-gray-400" />
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
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="p-2">
              {results.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {results.map((doc) => {
                    const client = clients.find(c => c.id === doc.clientId);
                    const matter = matters.find(m => m.id === doc.matterId);

                    return (
                      <button
                        key={doc.id}
                        className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        onClick={() => {
                          onDocumentClick(doc);
                          onClose();
                        }}
                      >
                        {doc.type === 'folder' ? (
                          <FolderClosed className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <File className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
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