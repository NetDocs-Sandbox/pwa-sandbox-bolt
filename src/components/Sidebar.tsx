import React, { useState } from 'react';
import { Cabinet, Client, Matter, Document } from '../types';
import {
  FolderClosed,
  ChevronLeft,
  ChevronRight,
  Scale,
  LogOut,
  Settings,
  Search,
} from 'lucide-react';
import { SearchableDropdown } from './SearchableDropdown';
import { currentUser, organizations } from '../data';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  cabinets: Cabinet[];
  clients: Client[];
  matters: Matter[];
  documents: Document[];
  selectedCabinet: Cabinet | null;
  selectedClient: Client | null;
  selectedMatter: Matter | null;
  selectedFolder: Document | null;
  onSelectCabinet: (cabinet: Cabinet | null) => void;
  onSelectClient: (client: Client | null) => void;
  onSelectMatter: (matter: Matter | null) => void;
  onSelectFolder: (folderId: string) => void;
  onOpenSearch: () => void;
}

export function Sidebar({
  cabinets,
  clients,
  matters,
  documents,
  selectedCabinet,
  selectedClient,
  selectedMatter,
  selectedFolder,
  onSelectCabinet,
  onSelectClient,
  onSelectMatter,
  onSelectFolder,
  onOpenSearch,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const organization = organizations.find(org => org.id === currentUser.organizationId);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredClients = clients.filter(
    (client) => !selectedCabinet || client.cabinetId === selectedCabinet.id
  );

  const filteredMatters = matters.filter(
    (matter) => !selectedClient || matter.clientId === selectedClient.id
  );

  const getFolderHierarchy = (folder: Document): Document[] => {
    const hierarchy: Document[] = [folder];
    let currentFolder = folder;

    while (currentFolder.parentId) {
      const parentFolder = documents.find(d => d.id === currentFolder.parentId);
      if (parentFolder) {
        hierarchy.unshift(parentFolder);
        currentFolder = parentFolder;
      } else {
        break;
      }
    }

    return hierarchy;
  };

  const renderFolders = () => {
    if (selectedClient && !selectedMatter) {
      return null;
    }

    const folders = documents.filter(
      doc => 
        doc.type === 'folder' && 
        (selectedMatter ? doc.matterId === selectedMatter.id :
         selectedCabinet ? doc.cabinetId === selectedCabinet.id : false)
    );

    const folderMap = new Map<string | null, Document[]>();
    folders.forEach(folder => {
      const parentId = folder.parentId;
      if (!folderMap.has(parentId)) {
        folderMap.set(parentId, []);
      }
      folderMap.get(parentId)!.push(folder);
    });

    const folderHierarchy = selectedFolder ? getFolderHierarchy(selectedFolder) : [];
    const hierarchyIds = new Set(folderHierarchy.map(f => f.id));

    const renderFolderLevel = (parentId: string | null = null, level: number = 0) => {
      const levelFolders = folderMap.get(parentId) || [];
      return levelFolders.map(folder => {
        const isSelected = selectedFolder?.id === folder.id;
        const isInHierarchy = hierarchyIds.has(folder.id);
        const hasChildren = folderMap.has(folder.id);

        return (
          <div key={folder.id}>
            <button
              onClick={() => onSelectFolder(folder.id)}
              className={`w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors ${
                isSelected ? 'bg-blue-50 text-blue-700' : 
                isInHierarchy ? 'bg-gray-50 text-gray-900' :
                'text-gray-700 hover:bg-gray-50'
              }`}
              style={{ paddingLeft: `${(level * 12) + 8}px` }}
            >
              <FolderClosed className={`w-4 h-4 mr-2 ${
                isSelected ? 'text-blue-500' : 
                isInHierarchy ? 'text-yellow-600' :
                'text-yellow-500'
              }`} />
              <span className="truncate">{folder.name}</span>
            </button>
            {(hasChildren && (isSelected || isInHierarchy)) && renderFolderLevel(folder.id, level + 1)}
          </div>
        );
      });
    };

    return (
      <div>
        {renderFolderLevel()}
      </div>
    );
  };

  return (
    <div
      className={`bg-gray-50 border-r border-gray-200 h-screen flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-12' : 'w-64'
      }`}
    >
      <div className="border-b border-gray-200">
        <div
          className={`flex items-center ${
            isCollapsed ? 'justify-center p-2' : 'px-4 py-3'
          }`}
        >
          {organization?.logo ? (
            <img
              src={organization.logo}
              alt={organization.name}
              className={`${isCollapsed ? 'w-6 h-6' : 'w-7 h-7'} rounded-md`}
            />
          ) : (
            <Scale
              className={`text-blue-600 ${isCollapsed ? 'w-6 h-6' : 'w-7 h-7'}`}
            />
          )}
          {!isCollapsed && (
            <h1 className="ml-2 text-gray-900 truncate">
              {organization?.name}
            </h1>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full p-2 hover:bg-gray-100 border-t border-gray-200 flex items-center justify-center"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isCollapsed ? (
          <div className="p-2">
            <button
              onClick={onOpenSearch}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <div className="relative">
              <button
                onClick={onOpenSearch}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                <Search className="w-4 h-4 text-gray-500" />
                <span className="flex-1 text-left">Search...</span>
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
                  ⌘K
                </kbd>
              </button>
            </div>

            <div>
              <SearchableDropdown
                options={cabinets}
                value={selectedCabinet}
                onChange={onSelectCabinet}
                placeholder="Select a Cabinet"
                label=""
              />
            </div>

            <div>
              <SearchableDropdown
                options={filteredClients}
                value={selectedClient}
                onChange={onSelectClient}
                placeholder="Select a Client"
                label=""
              />
            </div>

            <div>
              <SearchableDropdown
                options={filteredMatters}
                value={selectedMatter}
                onChange={onSelectMatter}
                placeholder="Select a Matter"
                label=""
              />
            </div>

            {(selectedCabinet || selectedMatter) && (
              <div className="mt-4">
                <div className="space-y-0.5">
                  {renderFolders()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`border-t border-gray-200 ${isCollapsed ? 'p-2' : 'p-4'}`}>
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-2">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full"
            />
            <button className="p-1 hover:bg-gray-100 rounded-md" title="Settings">
              <Settings className="w-4 h-4 text-gray-600" />
            </button>
            <button 
              className="p-1 hover:bg-gray-100 rounded-md" 
              title="Sign out"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.role}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="p-1 hover:bg-gray-100 rounded-md"
                title="Settings"
              >
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded-md"
                title="Sign out"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}