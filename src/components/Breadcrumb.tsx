import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Cabinet, Client, Matter, Document } from '../types';

interface BreadcrumbProps {
  cabinet: Cabinet | null;
  client: Client | null;
  matter: Matter | null;
  folder: Document | null;
  onCabinetClick: () => void;
  onClientClick: () => void;
  onMatterClick: () => void;
  onFolderClick: () => void;
  onHomeClick: () => void;
}

export function Breadcrumb({
  cabinet,
  client,
  matter,
  folder,
  onCabinetClick,
  onClientClick,
  onMatterClick,
  onFolderClick,
  onHomeClick,
}: BreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
      <button
        onClick={onHomeClick}
        className="hover:text-blue-600 transition-colors"
      >
        Home
      </button>
      
      {cabinet && (
        <>
          <FiChevronRight className="w-4 h-4" />
          <button
            onClick={onCabinetClick}
            className="hover:text-blue-600 transition-colors"
          >
            {cabinet.name}
          </button>
        </>
      )}
      
      {client && (
        <>
          <FiChevronRight className="w-4 h-4" />
          <button
            onClick={onClientClick}
            className="hover:text-blue-600 transition-colors"
          >
            {client.name}
          </button>
        </>
      )}
      
      {matter && (
        <>
          <FiChevronRight className="w-4 h-4" />
          <button
            onClick={onMatterClick}
            className="hover:text-blue-600 transition-colors"
          >
            {matter.name}
          </button>
        </>
      )}

      {folder && (
        <>
          <FiChevronRight className="w-4 h-4" />
          <button
            onClick={onFolderClick}
            className="hover:text-blue-600 transition-colors"
          >
            {folder.name}
          </button>
        </>
      )}
    </nav>
  );
}