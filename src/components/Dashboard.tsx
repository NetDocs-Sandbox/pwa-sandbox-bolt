import React from 'react';
import { Cabinet, Client, Matter, Document } from '../types';
import { DataGrid } from './DataGrid';

interface DashboardProps {
  cabinets: Cabinet[];
  clients: Client[];
  matters: Matter[];
  documents: Document[];
  onCabinetSelect: (cabinet: Cabinet) => void;
  onClientSelect: (client: Client) => void;
  onMatterSelect: (matter: Matter) => void;
  onFolderSelect: (folderId: string) => void;
}

export function Dashboard({
  cabinets,
  clients,
  matters,
  documents,
  onCabinetSelect,
  onClientSelect,
  onMatterSelect,
  onFolderSelect,
}: DashboardProps) {
  const recentDocuments = [...documents]
    .filter(doc => doc.type === 'file')
    .sort((a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime());

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Items
        </h2>
        <DataGrid
          documents={recentDocuments}
          clients={clients}
          matters={matters}
          selectedCabinetId={null}
          selectedClientId={null}
          selectedMatterId={null}
          onFolderClick={onFolderSelect}
        />
      </section>
    </div>
  );
}