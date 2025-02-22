import React from 'react';
import { Document, Client, Matter } from '../types';
import { DataGrid } from '../components/DataGrid';
import { FaBalanceScale as Scale } from 'react-icons/fa';

interface MatterPageProps {
  documents: Document[];
  clients: Client[];
  matters: Matter[];
  matterId: string;
  onFolderClick: (folderId: string) => void;
}

export function MatterPage({ 
  documents, 
  clients, 
  matters, 
  matterId,
  onFolderClick
}: MatterPageProps) {
  const matter = matters.find(m => m.id === matterId);
  const client = clients.find(c => c.id === matter?.clientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <Scale className="w-6 h-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{matter?.name}</h1>
          {client && (
            <p className="text-sm text-gray-500 mt-1">
              Client: {client.name}
            </p>
          )}
        </div>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Items</h2>
        <DataGrid
          documents={documents}
          clients={clients}
          matters={matters}
          selectedCabinetId={null}
          selectedClientId={null}
          selectedMatterId={matterId}
          onFolderClick={onFolderClick}
        />
      </section>
    </div>
  );
}