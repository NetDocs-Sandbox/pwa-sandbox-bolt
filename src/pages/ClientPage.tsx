import React from 'react';
import { Matter, Document, Client } from '../types';
import { FiChevronRight } from 'react-icons/fi';
import { DataGrid } from '../components/DataGrid';

interface ClientPageProps {
  matters: Matter[];
  documents: Document[];
  clients: Client[];
  clientId: string;
  selectedFolder: Document | null;
  onMatterClick: (matterId: string) => void;
  onSeeAllMatters: () => void;
  onFolderClick: (folderId: string) => void;
}

export function ClientPage({
  matters,
  documents,
  clients,
  clientId,
  selectedFolder,
  onMatterClick,
  onSeeAllMatters,
  onFolderClick,
}: ClientPageProps) {
  const clientMatters = matters.filter(matter => matter.clientId === clientId);

  // Filter out folders from documents
  const filteredDocuments = documents.filter(doc => 
    doc.clientId === clientId && doc.type === 'file'
  );

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Matters</h2>
          <button
            onClick={onSeeAllMatters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            See all
            <FiChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientMatters.map(matter => (
            <button
              key={matter.id}
              onClick={() => onMatterClick(matter.id)}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
            >
              <h3 className="font-medium text-gray-900">{matter.name}</h3>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Items</h2>
        <DataGrid
          documents={documents}
          clients={clients}
          matters={matters}
          selectedCabinetId={null}
          selectedClientId={clientId}
          selectedMatterId={null}
          selectedFolder={selectedFolder}
          onFolderClick={onFolderClick}
        />
      </section>
    </div>
  );
}