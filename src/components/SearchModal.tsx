import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { Document, Client, Matter } from '../types';
import { 
  NDDialog as Modal,
  NDText as Text,
  NDButton as Button,
  NDDivider as Divider,
  NDTag as Tag,
} from '@netdocuments/atticus';
import { FiFile, FiFolder, FiX, FiClock, FiSearch } from 'react-icons/fi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  clients: Client[];
  matters: Matter[];
  onDocumentClick: (doc: Document) => void;
}

interface SearchEvent {
  target: { value: string };
}

export function SearchModal({
  isOpen,
  onClose,
  documents,
  clients,
  matters,
  onDocumentClick,
}: SearchModalProps) {
  console.log('SearchModal render:', { isOpen, documents: documents.length });

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Document[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchBoxRef = useRef<any>(null);

  // Reset search when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('');
      setResults([]);
      setSelectedIndex(0);
      // Manually reset the search box value
      if (searchBoxRef.current) {
        searchBoxRef.current.value = '';
      }
    }
  }, [isOpen]);

  // Handle search results
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const filtered = documents.filter(doc => {
        const client = clients.find(c => c.id === doc.clientId);
        const matter = matters.find(m => m.id === doc.matterId);
        
        return (
          doc.name.toLowerCase().includes(searchLower) ||
          client?.name.toLowerCase().includes(searchLower) ||
          matter?.name.toLowerCase().includes(searchLower)
        );
      });
      setResults(filtered.slice(0, 10));
    } else {
      setResults([]);
    }
  }, [searchTerm, documents, clients, matters]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % results.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (results.length > 0) {
            onDocumentClick(results[selectedIndex]);
            onClose();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onDocumentClick, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div 
          className="fixed inset-0 bg-black bg-opacity-25" 
          onClick={onClose}
        />
        <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <Text variant="xLarge" block>Search Documents</Text>
            <Button
              icon={<FiX />}
              variant="subtle"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search documents, clients, or matters..."
              value={searchTerm}
              onChange={handleSearchChange}
              autoFocus
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mt-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((doc, index) => (
                  <SearchResult 
                    key={doc.id}
                    doc={doc}
                    client={clients.find(c => c.id === doc.clientId)}
                    matter={matters.find(m => m.id === doc.matterId)}
                    isSelected={index === selectedIndex}
                    onClick={() => {
                      onDocumentClick(doc);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  />
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-12">
                <Text variant="large" block className="text-gray-500">
                  No results found for "{searchTerm}"
                </Text>
                <Text variant="small" className="text-gray-400 mt-2">
                  Try adjusting your search terms
                </Text>
              </div>
            ) : (
              <div className="text-center py-12">
                <Text variant="large" block className="text-gray-500">
                  Start typing to search...
                </Text>
                <Text variant="small" className="text-gray-400 mt-2">
                  Search across documents, clients, and matters
                </Text>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchResult({ 
  doc, 
  client, 
  matter, 
  isSelected, 
  onClick, 
  onMouseEnter 
}: { 
  doc: Document;
  client?: Client;
  matter?: Matter;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <div
      className={`p-4 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex items-start gap-4">
        {doc.type === 'folder' ? (
          <FiFolder className="w-5 h-5 text-yellow-500 mt-1" />
        ) : (
          <FiFile className="w-5 h-5 text-blue-500 mt-1" />
        )}
        <div className="flex-1 min-w-0">
          <Text block truncate weight="semibold">
            {doc.name}
          </Text>
          
          <div className="flex items-center gap-2 mt-2">
            {client && (
              <Tag 
                variant="info" 
                size="small"
                className="flex items-center gap-1"
              >
                {client.name}
              </Tag>
            )}
            {matter && (
              <Tag 
                variant="success" 
                size="small"
                className="flex items-center gap-1"
              >
                {matter.name}
              </Tag>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3">
            <FiClock className="w-4 h-4 text-gray-400" />
            <Text variant="caption" className="text-gray-500">
              Last modified {new Date(doc.lastActiveAt).toLocaleDateString()}
            </Text>
          </div>
        </div>
      </div>
      <Divider className="mt-4" />
    </div>
  );
}