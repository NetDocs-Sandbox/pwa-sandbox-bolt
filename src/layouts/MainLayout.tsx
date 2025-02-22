import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { CabinetPage } from '../pages/CabinetPage';
import { ClientPage } from '../pages/ClientPage';
import { MatterPage } from '../pages/MatterPage';
import { FolderPage } from '../pages/FolderPage';
import { Dashboard } from '../components/Dashboard';
import { SearchModal } from '../components/SearchModal';
import { useAuth } from '../hooks/useAuth';
import { Breadcrumb } from '../components/Breadcrumb';
import { Cabinet, Client, Matter, Document } from '../types';
import { cabinets, clients, matters, documents } from '../data';
import { FiShare2 as Share2, FiUser as UserCircle2, FiLock as Lock, FiMoreHorizontal as MoreHorizontal } from 'react-icons/fi';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<Document | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cabinetId = params.get('cabinet');
    const clientId = params.get('client');
    const matterId = params.get('matter');
    const folderId = params.get('folder');

    if (cabinetId) {
      const cabinet = cabinets.find(c => c.id === cabinetId);
      if (cabinet) setSelectedCabinet(cabinet);
    }

    if (clientId) {
      const client = clients.find(c => c.id === clientId);
      if (client) setSelectedClient(client);
    }

    if (matterId) {
      const matter = matters.find(m => m.id === matterId);
      if (matter) setSelectedMatter(matter);
    }

    if (folderId) {
      const folder = documents.find(d => d.id === folderId);
      if (folder) setSelectedFolder(folder);
    }
  }, [location]);

  // Update URL when selection changes
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (selectedCabinet) {
      params.set('cabinet', selectedCabinet.id);
    }
    
    if (selectedClient) {
      params.set('client', selectedClient.id);
    }
    
    if (selectedMatter) {
      params.set('matter', selectedMatter.id);
    }
    
    if (selectedFolder) {
      params.set('folder', selectedFolder.id);
    }

    const newUrl = params.toString() ? `?${params.toString()}` : location.pathname;
    navigate(newUrl, { replace: true });
  }, [selectedCabinet, selectedClient, selectedMatter, selectedFolder, navigate]);

  // Add debug logs to track search state
  useEffect(() => {
    console.log('Search modal state:', isSearchOpen);
  }, [isSearchOpen]);

  // Add this effect to track state changes
  useEffect(() => {
    console.log('Search modal state changed:', isSearchOpen);
  }, [isSearchOpen]);

  const handleCabinetSelect = (cabinet: Cabinet | null) => {
    setSelectedCabinet(cabinet);
    setSelectedClient(null);
    setSelectedMatter(null);
    setSelectedFolder(null);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleClientSelect = (client: Client | null) => {
    if (client) {
      const cabinet = cabinets.find(c => c.id === client.cabinetId);
      setSelectedCabinet(cabinet || null);
    }
    setSelectedClient(client);
    setSelectedMatter(null);
    setSelectedFolder(null);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleMatterSelect = (matter: Matter | null) => {
    if (matter) {
      const client = clients.find(c => c.id === matter.clientId);
      if (client) {
        const cabinet = cabinets.find(c => c.id === client.cabinetId);
        setSelectedCabinet(cabinet || null);
        setSelectedClient(client);
      }
    }
    setSelectedMatter(matter);
    setSelectedFolder(null);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleFolderSelect = (folderId: string) => {
    const folder = documents.find(d => d.id === folderId);
    if (folder) {
      setSelectedFolder(folder);
    }
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleHomeClick = () => {
    setSelectedCabinet(null);
    setSelectedClient(null);
    setSelectedMatter(null);
    setSelectedFolder(null);
  };

  const handleDocumentClick = (doc: Document) => {
    if (doc.type === 'folder') {
      handleFolderSelect(doc.id);
    }
  };

  // Add debug log to track click handler
  const handleOpenSearch = () => {
    console.log('Opening search modal');
    setIsSearchOpen(true);
  };

  const renderContent = () => {
    if (selectedFolder) {
      return (
        <FolderPage
          documents={documents}
          clients={clients}
          matters={matters}
          folder={selectedFolder}
          onFolderClick={handleFolderSelect}
        />
      );
    }

    if (selectedMatter) {
      return (
        <MatterPage
          documents={documents}
          clients={clients}
          matters={matters}
          matterId={selectedMatter.id}
          onFolderClick={handleFolderSelect}
        />
      );
    }

    if (selectedClient) {
      return (
        <ClientPage
          matters={matters}
          documents={documents}
          clients={clients}
          clientId={selectedClient.id}
          selectedFolder={selectedFolder}
          onMatterClick={(matterId: string) => {
            const matter = matters.find(m => m.id === matterId);
            if (matter) handleMatterSelect(matter);
          }}
          onSeeAllMatters={() => setSelectedMatter(null)}
          onFolderClick={handleFolderSelect}
        />
      );
    }

    if (selectedCabinet) {
      return (
        <CabinetPage
          clients={clients}
          matters={matters}
          documents={documents}
          cabinetId={selectedCabinet.id}
          selectedFolder={selectedFolder}
          onClientClick={(clientId) => {
            const client = clients.find(c => c.id === clientId);
            if (client) handleClientSelect(client);
          }}
          onMatterClick={(matterId: string) => {
            const matter = matters.find(m => m.id === matterId);
            if (matter) handleMatterSelect(matter);
          }}
          onSeeAllClients={() => setSelectedClient(null)}
          onSeeAllMatters={() => setSelectedMatter(null)}
          onFolderClick={handleFolderSelect}
        />
      );
    }

    return (
      <Dashboard
        cabinets={cabinets}
        clients={clients}
        matters={matters}
        documents={documents}
        onCabinetSelect={handleCabinetSelect}
        onClientSelect={handleClientSelect}
        onMatterSelect={handleMatterSelect}
        onFolderSelect={handleFolderSelect}
      />
    );
  };

  return (
    <div className="flex h-screen bg-white">
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity md:hidden ${
        isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setIsSidebarOpen(false)} />
      
      <div className={`fixed md:static inset-y-0 left-0 z-30 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out md:translate-x-0`}>
        <Sidebar
          cabinets={cabinets}
          clients={clients}
          matters={matters}
          documents={documents}
          selectedCabinet={selectedCabinet}
          selectedClient={selectedClient}
          selectedMatter={selectedMatter}
          selectedFolder={selectedFolder}
          onSelectCabinet={handleCabinetSelect}
          onSelectClient={handleClientSelect}
          onSelectMatter={handleMatterSelect}
          onSelectFolder={handleFolderSelect}
          onOpenSearch={handleOpenSearch}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-md md:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5"
                  onClick={() => {}}
                >
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Access</span>
                </button>
                <button
                  className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5"
                  onClick={() => {}}
                >
                  <UserCircle2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Profile</span>
                </button>
                <button
                  className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5"
                  onClick={() => {}}
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                <div className="relative">
                  <button
                    className="px-3 py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors flex items-center gap-1.5"
                    onClick={() => setIsActionsOpen(!isActionsOpen)}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">More Actions</span>
                  </button>
                  
                  {isActionsOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsActionsOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200">
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setIsActionsOpen(false);
                          }}
                        >
                          Download
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setIsActionsOpen(false);
                          }}
                        >
                          Print
                        </button>
                        <button
                          className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setIsActionsOpen(false);
                          }}
                        >
                          Export
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <Breadcrumb
              cabinet={selectedCabinet}
              client={selectedClient}
              matter={selectedMatter}
              folder={selectedFolder}
              onHomeClick={handleHomeClick}
              onCabinetClick={() => {
                setSelectedClient(null);
                setSelectedMatter(null);
                setSelectedFolder(null);
              }}
              onClientClick={() => {
                setSelectedMatter(null);
                setSelectedFolder(null);
              }}
              onMatterClick={() => setSelectedFolder(null)}
              onFolderClick={() => {}}
            />
            {renderContent()}
          </div>
        </main>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          console.log('Closing search modal');
          setIsSearchOpen(false);
        }}
        documents={documents}
        clients={clients}
        matters={matters}
        onDocumentClick={handleDocumentClick}
      />
    </div>
  );
}