import React from 'react';
import { Document } from '../types';
import { FolderClosed } from 'lucide-react';

interface FolderPaneProps {
  documents: Document[];
  cabinetId: string;
  onFolderClick: (folderId: string) => void;
  selectedFolderId: string | null;
}

export function FolderPane({
  documents,
  cabinetId,
  onFolderClick,
  selectedFolderId,
}: FolderPaneProps) {
  const folders = documents.filter(
    doc => doc.type === 'folder' && doc.cabinetId === cabinetId
  );

  return (
    <div className="w-64 border-r border-gray-200 bg-white overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
          Folders
        </h2>
        <div className="space-y-1">
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => onFolderClick(folder.id)}
              className={`w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors ${
                selectedFolderId === folder.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FolderClosed className={`w-4 h-4 mr-2 ${
                selectedFolderId === folder.id
                  ? 'text-blue-500'
                  : 'text-yellow-500'
              }`} />
              {folder.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}