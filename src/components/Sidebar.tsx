import React, { useState, useEffect } from 'react';
import { Cabinet, Client, Matter, Document } from '../types';
import {
  HiOutlineFolderOpen,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCog6Tooth,
} from 'react-icons/hi2';
import { FaBalanceScale as Scale } from 'react-icons/fa';
import { RiLogoutBoxLine as LogOut } from 'react-icons/ri';
import { SearchableDropdown } from './SearchableDropdown';
import { currentUser, organizations } from '../data';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import {
  NDButton as Button,
  NDText as Text,
  NDDivider as Divider,
  NDAvatar as Avatar,
  NDTooltip as Tooltip,
  NDTreeItem as TreeItem,
} from '@netdocuments/atticus';

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
            <Button
              onClick={() => onSelectFolder(folder.id)}
              variant={isSelected ? "primary" : "subtle"}
              className={`w-full justify-start text-left ${
                isInHierarchy ? 'bg-gray-50' : ''
              }`}
              style={{ paddingLeft: `${(level * 12) + 8}px` }}
            >
              <div className="flex items-center">
                <HiOutlineFolderOpen 
                  className={`w-4 h-4 mr-2 ${
                    isSelected ? 'text-blue-500' : 
                    isInHierarchy ? 'text-yellow-600' :
                    'text-yellow-500'
                  }`} 
                />
                <Text 
                  variant="body"
                  className={`truncate ${
                    isSelected ? 'text-blue-700' : 
                    isInHierarchy ? 'text-gray-900' :
                    'text-gray-700'
                  }`}
                >
                  {folder.name}
                </Text>
              </div>
            </Button>
            {(hasChildren && (isSelected || isInHierarchy)) && (
              <div className="ml-2">
                {renderFolderLevel(folder.id, level + 1)}
              </div>
            )}
          </div>
        );
      });
    };

    return (
      <div className="mt-2 space-y-0.5">
        {renderFolderLevel()}
      </div>
    );
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenSearch();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenSearch]);

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
            <Text variant="large" block className="ml-2 text-gray-900 truncate">
              {organization?.name}
            </Text>
          )}
        </div>
        <Button
          onClick={() => setIsCollapsed(!isCollapsed)}
          variant="subtle"
          className="w-full p-2 hover:bg-gray-100 border-t border-gray-200 flex items-center justify-center"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          icon={isCollapsed ? <HiOutlineChevronRight /> : <HiOutlineChevronLeft />}
        />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isCollapsed ? (
          <div className="p-2">
            <Tooltip content="Search (⌘K)" placement="right">
              <Button
                onClick={onOpenSearch}
                variant="subtle"
                icon={<FiSearch />}
                className="w-8 h-8"
              />
            </Tooltip>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            <Button
              onClick={onOpenSearch}
              variant="outline"
              className="w-full justify-between"
              icon={<FiSearch />}
            >
              <span className="flex-1 text-left">Search...</span>
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-gray-500 bg-gray-100 rounded">
                ⌘K
              </kbd>
            </Button>

            <Divider />

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
                onChange={(option) => onSelectClient(option as Client | null)}
                placeholder="Select a Client"
                label=""
              />
            </div>

            <div>
              <SearchableDropdown
                options={filteredMatters}
                value={selectedMatter}
                onChange={(option) => onSelectMatter(option as Matter | null)}
                placeholder="Select a Matter"
                label=""
              />
            </div>

            {(selectedCabinet || selectedMatter) && (
              <div className="mt-4">
                <Divider />
                <div className="space-y-0.5">
                  {renderFolders()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Divider />
      
      <div className={`${isCollapsed ? 'p-2' : 'p-4'}`}>
        {isCollapsed ? (
          <div className="flex flex-col items-center space-y-2">
            <Avatar
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              size="small"
            />
            <Tooltip content="Settings" placement="right">
              <Button
                variant="subtle"
                icon={<HiOutlineCog6Tooth />}
                className="p-1"
              />
            </Tooltip>
            <Tooltip content="Sign out" placement="right">
              <Button
                variant="subtle"
                icon={<LogOut />}
                className="p-1"
                onClick={handleLogout}
              />
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Avatar
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              size="medium"
            />
            <div className="flex-1 min-w-0">
              <Text variant="body" weight="semibold" block className="truncate">
                {currentUser.name}
              </Text>
              <Text variant="caption" className="text-gray-500 truncate">
                {currentUser.role}
              </Text>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="subtle"
                icon={<HiOutlineCog6Tooth />}
                title="Settings"
              />
              <Button
                variant="subtle"
                icon={<LogOut />}
                title="Sign out"
                onClick={handleLogout}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}