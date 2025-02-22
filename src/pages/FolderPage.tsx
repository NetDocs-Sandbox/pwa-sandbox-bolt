import React from 'react';
import { Document, Client, Matter } from '../types';
import { DataGrid } from '../components/DataGrid';
import { FiFolder } from 'react-icons/fi';

interface FolderPageProps {
  documents: Document[];
  clients: Client[];
  matters: Matter[];
  folder: Document;
  onFolderClick: (folderId: string) => void;
}

export function FolderPage({
  documents,
  clients,
  matters,
  folder,
  onFolderClick,
}: FolderPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <FiFolder className="w-6 h-6 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{folder.name}</h1>
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Documents</h2>
        <DataGrid
          documents={documents}
          clients={clients}
          matters={matters}
          selectedCabinetId={folder.cabinetId}
          selectedClientId={folder.clientId}
          selectedMatterId={folder.matterId}
          selectedFolder={folder}
          onFolderClick={onFolderClick}
        />
      </section>
    </div>
  );
}