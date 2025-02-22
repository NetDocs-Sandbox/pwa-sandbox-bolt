import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { Document, Client, Matter } from '../types';
import { FiFile, FiFolder, FiChevronDown, FiChevronUp, FiSearch, FiSettings, FiFilter } from 'react-icons/fi';
interface DataGridProps {
  documents: Document[];
  clients: Client[];
  matters: Matter[];
  selectedCabinetId: string | null;
  selectedClientId: string | null;
  selectedMatterId: string | null;
  selectedFolder?: Document | null;
  onFolderClick: (folderId: string) => void;
}

type SortField = 'name' | 'totalVersions' | 'client' | 'matter' | 'lastActiveAt' | 'addedBy' | 'lastModifiedBy';
type SortDirection = 'asc' | 'desc';

interface Column {
  field: string;
  label: string;
  width: number;
  wrap?: boolean;
}

const ITEMS_PER_PAGE = 20;
const MIN_COLUMN_WIDTH = 20;

export function DataGrid({ 
  documents, 
  clients,
  matters,
  selectedCabinetId,
  selectedClientId,
  selectedMatterId,
  selectedFolder,
  onFolderClick
}: DataGridProps) {
  const [sortField, setSortField] = useState<SortField>('lastActiveAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [resizing, setResizing] = useState<{ index: number; startX: number } | null>(null);
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const tableRef = useRef<HTMLDivElement>(null);

  const getColumns = (): Column[] => {
    // Only return name column for mobile
    if (window.innerWidth < 640) {
      return [{ field: 'name', label: 'Name', width: columnWidths['name'] || 200, wrap: true }];
    }

    if (selectedMatterId) {
      return [
        { field: 'name', label: 'Name', width: columnWidths['name'] || 200, wrap: true },
        { field: 'totalVersions', label: 'Versions', width: columnWidths['totalVersions'] || 100 },
        { field: 'addedBy', label: 'Added By', width: columnWidths['addedBy'] || 200, wrap: true },
        { field: 'lastModifiedBy', label: 'Last Modified By', width: columnWidths['lastModifiedBy'] || 200, wrap: true },
        { field: 'lastActiveAt', label: 'Date Modified', width: columnWidths['lastActiveAt'] || 150 },
      ];
    }
    if (selectedClientId) {
      return [
        { field: 'name', label: 'Name', width: columnWidths['name'] || 200, wrap: true },
        { field: 'totalVersions', label: 'Versions', width: columnWidths['totalVersions'] || 100 },
        { field: 'matter', label: 'Matter', width: columnWidths['matter'] || 200, wrap: true },
        { field: 'lastActiveAt', label: 'Your Activity', width: columnWidths['lastActiveAt'] || 150 },
      ];
    }
    return [
      { field: 'name', label: 'Name', width: columnWidths['name'] || 200, wrap: true },
      { field: 'totalVersions', label: 'Versions', width: columnWidths['totalVersions'] || 100 },
      { field: 'client', label: 'Client', width: columnWidths['client'] || 200, wrap: true },
      { field: 'matter', label: 'Matter', width: columnWidths['matter'] || 200, wrap: true },
      { field: 'lastActiveAt', label: 'Your Activity', width: columnWidths['lastActiveAt'] || 150 },
    ];
  };

  const handleResizeStart = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setResizing({ index, startX: e.pageX });
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!resizing) return;

    const columns = getColumns();
    const column = columns[resizing.index];
    const diff = e.pageX - resizing.startX;
    const newWidth = Math.max(MIN_COLUMN_WIDTH, (columnWidths[column.field] || column.width) + diff);

    setColumnWidths(prev => ({
      ...prev,
      [column.field]: newWidth
    }));

    setResizing(prev => prev ? { ...prev, startX: e.pageX } : null);
  }, [resizing, columnWidths]);

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (resizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizing, handleResizeMove, handleResizeEnd]);

  const formatActivity = (doc: Document) => {
    const activity = doc.yourActivity;
    if (!activity) return '-';
    
    const date = new Date(activity.date);
    const month = date.toLocaleString('default', { month: 'short' });
    const day = date.getDate();
    
    return `${activity.action} ${month} ${day}`;
  };

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      if (selectedFolder) {
        return doc.parentId === selectedFolder.id;
      }
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
        case 'addedBy':
          return sortDirection === 'asc'
            ? a.addedBy.name.localeCompare(b.addedBy.name)
            : b.addedBy.name.localeCompare(a.addedBy.name);
        case 'lastModifiedBy':
          return sortDirection === 'asc'
            ? a.lastModifiedBy.name.localeCompare(b.lastModifiedBy.name)
            : b.lastModifiedBy.name.localeCompare(a.lastModifiedBy.name);
        case 'lastActiveAt':
          return sortDirection === 'asc'
            ? new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime()
            : new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime();
        default:
          return 0;
      }
    });
  }, [documents, selectedCabinetId, selectedClientId, selectedMatterId, selectedFolder, sortField, sortDirection, clients, matters]);

  const displayedDocuments = useMemo(() => {
    return filteredAndSortedDocuments.slice(0, displayCount);
  }, [filteredAndSortedDocuments, displayCount]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const loadMore = useCallback(() => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setTimeout(() => {
      setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, filteredAndSortedDocuments.length));
      loadingRef.current = false;
    }, 100);
  }, [filteredAndSortedDocuments.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayCount < filteredAndSortedDocuments.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loadMore, displayCount, filteredAndSortedDocuments.length]);

  useEffect(() => {
    setDisplayCount(ITEMS_PER_PAGE);
  }, [selectedCabinetId, selectedClientId, selectedMatterId, selectedFolder]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <FiChevronDown className="w-3 h-3 text-gray-400" />;
    return sortDirection === 'asc' 
      ? <FiChevronUp className="w-3 h-3 text-blue-600" />
      : <FiChevronDown className="w-3 h-3 text-blue-600" />;
  };

  const handleRowClick = (doc: Document) => {
    if (doc.type === 'folder') {
      onFolderClick(doc.id);
    }
  };

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedItems(new Set(displayedDocuments.map(doc => doc.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const toggleSelectItem = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    e.stopPropagation();
    const newSelected = new Set(selectedItems);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedItems(newSelected);
  };

  const columns = getColumns();

  if (filteredAndSortedDocuments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <FiFolder className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">No items found</h3>
        <p className="mt-2 text-sm text-gray-500">
          This location is empty. Items you add will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="mb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            Showing {displayedDocuments.length} of {filteredAndSortedDocuments.length} items
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700"
              title="Filter"
            >
              <FiFilter className="w-4 h-4" />
            </button>
            <button
              className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-gray-700"
              title="Settings"
            >
              <FiSettings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div ref={tableRef} className="overflow-x-auto" style={{ cursor: resizing ? 'col-resize' : 'default' }}>
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-4 px-3 py-2 first:pl-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      checked={selectedItems.size === displayedDocuments.length && displayedDocuments.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                {columns.map((column, index) => (
                  <th 
                    key={column.field} 
                    scope="col" 
                    className="px-3 py-2 text-left last:pr-4 relative"
                    style={{ width: column.width }}
                  >
                    <button
                      className="flex items-center gap-1 hover:text-gray-700 text-xs font-medium text-gray-500 uppercase tracking-wider"
                      onClick={() => handleSort(column.field as SortField)}
                    >
                      {column.label}
                      <SortIcon field={column.field as SortField} />
                    </button>
                    {index < columns.length - 1 && (
                      <div
                        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 hover:w-1"
                        onMouseDown={(e) => handleResizeStart(index, e)}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedDocuments.map((doc, index) => {
                const client = clients.find(c => c.id === doc.clientId);
                const matter = matters.find(m => m.id === doc.matterId);
                
                return (
                  <tr 
                    key={doc.id} 
                    className={`${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-blue-50 transition-colors ${
                      doc.type === 'folder' ? 'cursor-pointer' : ''
                    }`}
                  >
                    <td className="w-4 px-3 py-2 first:pl-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          checked={selectedItems.has(doc.id)}
                          onChange={(e) => toggleSelectItem(e, doc.id)}
                        />
                      </div>
                    </td>
                    <td 
                      className="px-3 py-2" 
                      onClick={() => handleRowClick(doc)}
                      style={{ 
                        width: columns[0].width,
                        maxWidth: columns[0].width,
                      }}
                    >
                      <div className="flex items-center">
                        {doc.type === 'folder' ? (
                          <FiFolder className="flex-shrink-0 w-4 h-4 text-yellow-500 mr-2" />
                        ) : (
                          <FiFile className="flex-shrink-0 w-4 h-4 text-blue-500 mr-2" />
                        )}
                        <div className="text-sm font-medium text-gray-900 truncate">{doc.name}</div>
                      </div>
                    </td>
                    {window.innerWidth >= 640 && (
                      <>
                        <td 
                          className="px-3 py-2 text-sm text-gray-500"
                          style={{ 
                            width: columns[1].width,
                            maxWidth: columns[1].width,
                          }}
                        >
                          {doc.totalVersions}
                        </td>
                        {selectedMatterId ? (
                          <>
                            <td 
                              className="px-3 py-2"
                              style={{ 
                                width: columns[2].width,
                                maxWidth: columns[2].width,
                              }}
                            >
                              <div className="flex items-center">
                                <img src={doc.addedBy.avatarUrl} alt="" className="flex-shrink-0 w-6 h-6 rounded-full mr-2" />
                                <span className="text-sm text-gray-900 truncate">{doc.addedBy.name}</span>
                              </div>
                            </td>
                            <td 
                              className="px-3 py-2"
                              style={{ 
                                width: columns[3].width,
                                maxWidth: columns[3].width,
                              }}
                            >
                              <div className="flex items-center">
                                <img src={doc.lastModifiedBy.avatarUrl} alt="" className="flex-shrink-0 w-6 h-6 rounded-full mr-2" />
                                <span className="text-sm text-gray-900 truncate">{doc.lastModifiedBy.name}</span>
                              </div>
                            </td>
                            <td 
                              className="px-3 py-2 text-sm text-gray-500 last:pr-4"
                              style={{ 
                                width: columns[4].width,
                                maxWidth: columns[4].width,
                              }}
                            >
                              {new Date(doc.lastActiveAt).toLocaleDateString()}
                            </td>
                          </>
                        ) : selectedClientId ? (
                          <>
                            <td 
                              className="px-3 py-2 text-sm text-gray-500"
                              style={{ 
                                width: columns[2].width,
                                maxWidth: columns[2].width,
                              }}
                            >
                              <div className="truncate">{matter?.name || '-'}</div>
                            </td>
                            <td 
                              className="px-3 py-2 text-sm text-gray-500 last:pr-4"
                              style={{ 
                                width: columns[3].width,
                                maxWidth: columns[3].width,
                              }}
                            >
                              {formatActivity(doc)}
                            </td>
                          </>
                        ) : (
                          <>
                            <td 
                              className="px-3 py-2 text-sm text-gray-500"
                              style={{ 
                                width: columns[2].width,
                                maxWidth: columns[2].width,
                              }}
                            >
                              <div className="truncate">{client?.name || '-'}</div>
                            </td>
                            <td 
                              className="px-3 py-2 text-sm text-gray-500"
                              style={{ 
                                width: columns[3].width,
                                maxWidth: columns[3].width,
                              }}
                            >
                              <div className="truncate">{matter?.name || '-'}</div>
                            </td>
                            <td 
                              className="px-3 py-2 text-sm text-gray-500 last:pr-4"
                              style={{ 
                                width: columns[4].width,
                                maxWidth: columns[4].width,
                              }}
                            >
                              {formatActivity(doc)}
                            </td>
                          </>
                        )}
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {displayCount < filteredAndSortedDocuments.length && (
          <div 
            ref={observerTarget}
            className="py-4 text-center text-sm text-gray-500"
          >
            Loading more items...
          </div>
        )}
      </div>
    </div>
  );
}