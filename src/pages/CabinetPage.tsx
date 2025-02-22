import React from 'react';
import { Client, Matter, Document } from '../types';
import { ChevronRight } from 'lucide-react';
import { DataGrid } from '../components/DataGrid';

interface CabinetPageProps {
  clients: Client[];
  matters: Matter[];
  documents: Document[];
  cabinetId: string;
  selectedFolder: Document | null;
  onClientClick: (clientId: string) => void;
  onMatterClick: (matterId: string) => void;
  onSeeAllClients: () => void;
  onSeeAllMatters: () => void;
  onFolderClick: (folderId: string) => void;
}

export function CabinetPage({
  clients,
  matters,
  documents,
  cabinetId,
  selectedFolder,
  onClientClick,
  onMatterClick,
  onSeeAllClients,
  onSeeAllMatters,
  onFolderClick,
}: CabinetPageProps) {
  const recentClients = clients
    .filter(client => client.cabinetId === cabinetId)
    .slice(0, 5);

  const recentMatters = matters.filter(
    (matter) => 
      clients.some(client => 
        client.cabinetId === cabinetId && client.id === matter.clientId
      )
    )
    .slice(0, 5);

  // Filter out folders from the document list
  const filteredDocuments = documents.filter(doc => 
    doc.cabinetId === cabinetId && doc.type !== 'folder'
  );

  return (
    <div className="space-y-6">
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Clients</h2>
          <button
            onClick={onSeeAllClients}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            See all
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentClients.map(client => (
            <button
              key={client.id}
              onClick={() => onClientClick(client.id)}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
            >
              <h3 className="font-medium text-gray-900">{client.name}</h3>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Matters</h2>
          <button
            onClick={onSeeAllMatters}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            See all
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentMatters.map(matter => (
            <button
              key={matter.id}
              onClick={() => onMatterClick(matter.id)}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
            >
              <h3 className="font-medium text-gray-900">{matter.name}</h3>
              <p className="text-sm text-gray-500">
                {clients.find(c => c.id === matter.clientId)?.name}
              </p>
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
          selectedCabinetId={cabinetId}
          selectedClientId={null}
          selectedMatterId={null}
          selectedFolder={selectedFolder}
          onFolderClick={onFolderClick}
        />
      </section>
    </div>
  );
}