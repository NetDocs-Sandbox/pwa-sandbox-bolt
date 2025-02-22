import React, { useState, useMemo } from 'react';
import { Document, Client, Matter } from '../types';
import { File, FolderClosed, ChevronDown, ChevronUp, Star, MoreHorizontal } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  clients: Client[];
  matters: Matter[];
  selectedCabinetId: string | null;
  selectedClientId: string | null;
  selectedMatterId: string | null;
  selectedFolder?: Document | null;
}

type SortField = 'name' | 'totalVersions' | 'client' | 'matter' | 'lastActiveAt';
type SortDirection = 'asc' | 'desc';

export function DocumentList({ 
  documents, 
  clients,
  matters,
  selectedCabinetId,
  selectedClientId,
  selectedMatterId,
  selectedFolder
}: DocumentListProps) {
  const [sortField, setSortField] = useState<SortField>('lastActiveAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      // Filter by folder if selected
      if (selectedFolder) {
        return doc.parentId === selectedFolder.id;
      }

      // Filter by matter/client/cabinet
      if (selectedMatterId) {
        return doc.matterId === selectedMatterId;
      }
      if (selectedClientId) {
        return doc.clientId === selectedClientId;
      }
      if (selectedCabinetId) {
        return doc.cabinetId === selectedCabinetId;
      }
      return true;
    });

    return filtered.sort((a, b) => {
      switch (sortField) {
        case 'name':
          return sortDirection === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        case 'totalVersions':
          return sortDirection === 'asc'
            ? a.totalVersions - b.totalVersions
            : b.totalVersions - a.totalVersions;
        case 'client': {
          const clientA = clients.find(c => c.id === a.clientId)?.name || '';
          const clientB = clients.find(c => c.id === b.clientId)?.name || '';
          return sortDirection === 'asc'
            ? clientA.localeCompare(clientB)
            : clientB.localeCompare(clientA);
        }
        case 'matter': {
          const matterA = matters.find(m => m.id === a.matterId)?.name || '';
          const matterB = matters.find(m => m.id === b.matterId)?.name || '';
          return sortDirection === 'asc'
            ? matterA.localeCompare(matterB)
            : matterB.localeCompare(matterA);
        }
        case 'lastActiveAt':
          return sortDirection === 'asc'
            ? new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime()
            : new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
        default:
          return 0;
      }
    });
  }, [documents, selectedCabinetId, selectedClientId, selectedMatterId, selectedFolder, sortField, sortDirection, clients, matters]);

  const totalPages = Math.ceil(filteredAndSortedDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredAndSortedDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-gray-400" />;
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-3 h-3 text-blue-600" />
      : <ChevronDown className="w-3 h-3 text-blue-600" />;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 3;
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(currentPage - 1, 1);
    let endPage = Math.min(startPage + 2, totalPages);
    
    if (endPage - startPage + 1 < 3 && endPage > 2) {
      startPage = Math.max(endPage - 2, 1);
    }
    
    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) {
        pageNumbers.push('ellipsis');
      }
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push('ellipsis');
      }
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className="space-y-2">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-3 py-1.5 text-left">
                <button
                  className="flex items-center gap-1 hover:text-gray-700 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  onClick={() => handleSort('name')}
                >
                  Name
                  <SortIcon field="name" />
                </button>
              </th>
              <th scope="col" className="px-3 py-1.5 text-left">
                <button
                  className="flex items-center gap-1 hover:text-gray-700 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  onClick={() => handleSort('totalVersions')}
                >
                  Versions
                  <SortIcon field="totalVersions" />
                </button>
              </th>
              <th scope="col" className="px-3 py-1.5 text-left">
                <button
                  className="flex items-center gap-1 hover:text-gray-700 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  onClick={() => handleSort('client')}
                >
                  Client
                  <SortIcon field="client" />
                </button>
              </th>
              <th scope="col" className="px-3 py-1.5 text-left">
                <button
                  className="flex items-center gap-1 hover:text-gray-700 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  onClick={() => handleSort('matter')}
                >
                  Matter
                  <SortIcon field="matter" />
                </button>
              </th>
              <th scope="col" className="px-3 py-1.5 text-left">
                <button
                  className="flex items-center gap-1 hover:text-gray-700 text-xs font-medium text-gray-500 uppercase tracking-wider"
                  onClick={() => handleSort('lastActiveAt')}
                >
                  Last Active
                  <SortIcon field="lastActiveAt" />
                </button>
              </th>
              <th scope="col" className="px-3 py-1.5 text-left">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedDocuments.map((doc) => {
              const client = clients.find(c => c.id === doc.clientId);
              const matter = matters.find(m => m.id === doc.matterId);
              
              return (
                <tr key={doc.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center">
                      {doc.type === 'folder' ? (
                        <FolderClosed className="w-4 h-4 text-yellow-500 mr-2" />
                      ) : (
                        <File className="w-4 h-4 text-blue-500 mr-2" />
                      )}
                      <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray -2 whitespace-nowrap text-sm text-gray-500">
                    {doc.totalVersions}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {client?.name || '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {matter?.name || '-'}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    {new Date(doc.lastActiveAt).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-gray-400 hover:text-yellow-500"
                      title="Add to favorites"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="px-3 py-2 flex items-center justify-between border-t border-gray-200 bg-gray-50">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-1 text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-2 py-1 text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedDocuments.length)}
                </span>{' '}
                of <span className="font-medium">{filteredAndSortedDocuments.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(page => Math.max(page - 1, 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {getPageNumbers().map((page, index) => (
                  page === 'ellipsis' ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="relative inline-flex items-center px-3 py-1 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`relative inline-flex items-center px-3 py-1 border text-sm font-medium ${
                        currentPage === page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                <button
                  onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}