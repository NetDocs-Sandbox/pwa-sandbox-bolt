import { Cabinet, Client, Matter, Document, User, Organization } from './types';

export const organizations: Organization[] = [
  {
    id: '1',
    name: 'Anderson & Partners LLP',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100&h=100'
  },
  {
    id: '2',
    name: 'Global Legal Solutions',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=100&h=100'
  }
];

export const cabinets: Cabinet[] = [
  { id: '1', name: 'Corporate Law' },
  { id: '2', name: 'Real Estate' },
  { id: '3', name: 'Intellectual Property' },
  { id: '4', name: 'Litigation' },
  { id: '5', name: 'Employment Law' },
];

export const clients: Client[] = [
  // Corporate Law Clients
  { id: '1', name: 'Acme Corporation', cabinetId: '1' },
  { id: '2', name: 'TechStart Inc', cabinetId: '1' },
  { id: '3', name: 'Global Innovations Ltd', cabinetId: '1' },
  { id: '4', name: 'Future Enterprises', cabinetId: '1' },
  
  // Real Estate Clients
  { id: '5', name: 'Global Properties LLC', cabinetId: '2' },
  { id: '6', name: 'Urban Development Co', cabinetId: '2' },
  { id: '7', name: 'Landmark Holdings', cabinetId: '2' },
  
  // IP Clients
  { id: '8', name: 'Innovation Labs', cabinetId: '3' },
  { id: '9', name: 'Tech Patents Inc', cabinetId: '3' },
  { id: '10', name: 'Digital Rights Group', cabinetId: '3' },

  // Litigation Clients
  { id: '11', name: 'Defense Dynamics', cabinetId: '4' },
  { id: '12', name: 'Legal Shield Corp', cabinetId: '4' },

  // Employment Law Clients
  { id: '13', name: 'HR Solutions Inc', cabinetId: '5' },
  { id: '14', name: 'Workforce Management', cabinetId: '5' },
];

export const matters: Matter[] = [
  // Acme Corporation Matters
  { id: '1', name: 'Corporate Restructuring', clientId: '1' },
  { id: '2', name: 'Annual Compliance', clientId: '1' },
  { id: '3', name: 'Board Governance', clientId: '1' },
  
  // TechStart Inc Matters
  { id: '4', name: 'Seed Funding Round', clientId: '2' },
  { id: '5', name: 'Series A Financing', clientId: '2' },
  { id: '6', name: 'Employee Stock Options', clientId: '2' },
  
  // Global Properties Matters
  { id: '7', name: 'Property Acquisition - Downtown', clientId: '5' },
  { id: '8', name: 'Commercial Lease Agreements', clientId: '5' },
  { id: '9', name: 'Property Development Project', clientId: '5' },
  
  // Innovation Labs Matters
  { id: '10', name: 'Patent Filing - AI Technology', clientId: '8' },
  { id: '11', name: 'Software Licensing', clientId: '8' },
  { id: '12', name: 'IP Strategy Review', clientId: '8' },

  // Defense Dynamics Matters
  { id: '13', name: 'Commercial Dispute', clientId: '11' },
  { id: '14', name: 'Contract Enforcement', clientId: '11' },

  // HR Solutions Matters
  { id: '15', name: 'Employment Policy Review', clientId: '13' },
  { id: '16', name: 'Workplace Investigation', clientId: '13' },
];

const users = [
  {
    id: '1',
    name: 'Sarah Anderson',
    email: 'sarah.anderson@law.com',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
    role: 'Senior Partner',
    organizationId: '1'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@law.com',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
    role: 'Associate',
    organizationId: '1'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@law.com',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
    role: 'Partner',
    organizationId: '2'
  }
];

export const currentUser = users[0];

// Helper function to generate random dates within a range
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to get a random user
const getRandomUser = () => users[Math.floor(Math.random() * users.length)];

// Helper function to generate a random activity
const generateActivity = () => {
  const actions = ['created', 'edited', 'viewed'] as const;
  return {
    action: actions[Math.floor(Math.random() * actions.length)],
    date: randomDate(new Date(2023, 0, 1), new Date()).toISOString()
  };
};

// Helper function to generate a sequence of documents
const generateDocuments = (count: number, prefix: string, parentId: string | null, matterId: string, clientId: string, cabinetId: string): Document[] => {
  return Array.from({ length: count }, (_, i) => {
    const addedBy = getRandomUser();
    const lastModifiedBy = getRandomUser();
    return {
      id: `${prefix}-${i + 1}`,
      name: `${prefix}-document-${i + 1}.pdf`,
      type: 'file',
      matterId,
      clientId,
      cabinetId,
      parentId,
      path: `/${prefix}/document-${i + 1}.pdf`,
      createdAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      updatedAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      totalVersions: Math.floor(Math.random() * 5) + 1,
      lastActiveAt: randomDate(new Date(2023, 0, 1), new Date()).toISOString(),
      addedBy,
      lastModifiedBy,
      yourActivity: generateActivity()
    };
  });
};

const folderBase = {
  addedBy: users[0],
  lastModifiedBy: users[0],
  yourActivity: {
    action: 'created' as const,
    date: '2024-01-01T00:00:00Z'
  }
};

export const documents: Document[] = [
  {
    id: 'folder-templates',
    name: 'Templates',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '1',
    parentId: null,
    path: '/templates',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-contracts',
    name: 'Contracts',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '1',
    parentId: 'folder-templates',
    path: '/templates/contracts',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-policies',
    name: 'Policies',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '1',
    parentId: 'folder-templates',
    path: '/templates/policies',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-corporate-governance',
    name: 'Corporate Governance',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '1',
    parentId: null,
    path: '/corporate-governance',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-board-materials',
    name: 'Board Materials',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '1',
    parentId: 'folder-corporate-governance',
    path: '/corporate-governance/board-materials',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-compliance',
    name: 'Compliance',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '1',
    parentId: null,
    path: '/compliance',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-property-docs',
    name: 'Property Documents',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '2',
    parentId: null,
    path: '/property-documents',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-leases',
    name: 'Lease Agreements',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '2',
    parentId: 'folder-property-docs',
    path: '/property-documents/leases',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-purchase-agreements',
    name: 'Purchase Agreements',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '2',
    parentId: 'folder-property-docs',
    path: '/property-documents/purchase-agreements',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-zoning',
    name: 'Zoning & Land Use',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '2',
    parentId: null,
    path: '/zoning',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-permits',
    name: 'Permits & Approvals',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '2',
    parentId: 'folder-zoning',
    path: '/zoning/permits',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-patents',
    name: 'Patents',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '3',
    parentId: null,
    path: '/patents',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-patent-templates',
    name: 'Patent Templates',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '3',
    parentId: 'folder-patents',
    path: '/patents/templates',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-trademarks',
    name: 'Trademarks',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '3',
    parentId: null,
    path: '/trademarks',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-trademark-filings',
    name: 'Trademark Filings',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '3',
    parentId: 'folder-trademarks',
    path: '/trademarks/filings',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-copyright',
    name: 'Copyright',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '3',
    parentId: null,
    path: '/copyright',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-pleadings',
    name: 'Pleadings',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '4',
    parentId: null,
    path: '/pleadings',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-motions',
    name: 'Motions',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '4',
    parentId: 'folder-pleadings',
    path: '/pleadings/motions',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-discovery',
    name: 'Discovery',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '4',
    parentId: null,
    path: '/discovery',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-depositions',
    name: 'Depositions',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '4',
    parentId: 'folder-discovery',
    path: '/discovery/depositions',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-policies-procedures',
    name: 'Policies & Procedures',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '5',
    parentId: null,
    path: '/policies-procedures',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-handbooks',
    name: 'Employee Handbooks',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '5',
    parentId: 'folder-policies-procedures',
    path: '/policies-procedures/handbooks',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-compliance-training',
    name: 'Compliance Training',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '5',
    parentId: null,
    path: '/compliance-training',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-investigations',
    name: 'Investigations',
    type: 'folder',
    matterId: '',
    clientId: '',
    cabinetId: '5',
    parentId: null,
    path: '/investigations',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-due-diligence',
    name: 'Due Diligence',
    type: 'folder',
    matterId: '1',
    clientId: '1',
    cabinetId: '1',
    parentId: null,
    path: '/due-diligence',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-financial',
    name: 'Financial Reports',
    type: 'folder',
    matterId: '1',
    clientId: '1',
    cabinetId: '1',
    parentId: 'folder-due-diligence',
    path: '/due-diligence/financial',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },
  {
    id: 'folder-legal',
    name: 'Legal Analysis',
    type: 'folder',
    matterId: '1',
    clientId: '1',
    cabinetId: '1',
    parentId: 'folder-due-diligence',
    path: '/due-diligence/legal',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    totalVersions: 1,
    lastActiveAt: '2024-01-01T00:00:00Z',
    ...folderBase
  },

  // Generate documents with the new fields using the updated generateDocuments function
  ...generateDocuments(50, 'contracts', 'folder-contracts', '', '', '1'),
  ...generateDocuments(50, 'policies', 'folder-policies', '', '', '1'),
  ...generateDocuments(50, 'financial', 'folder-financial', '1', '1', '1'),
  ...generateDocuments(50, 'legal', 'folder-legal', '1', '1', '1'),
  ...generateDocuments(50, 'leases', 'folder-leases', '', '', '2'),
  ...generateDocuments(50, 'patents', 'folder-patents', '', '', '3'),
  ...generateDocuments(20, 'board-materials', 'folder-board-materials', '', '', '1'),
  ...generateDocuments(20, 'compliance', 'folder-compliance', '', '', '1'),
  ...generateDocuments(20, 'purchase-agreements', 'folder-purchase-agreements', '', '', '2'),
  ...generateDocuments(20, 'permits', 'folder-permits', '', '', '2'),
  ...generateDocuments(20, 'patent-templates', 'folder-patent-templates', '', '', '3'),
  ...generateDocuments(20, 'trademark-filings', 'folder-trademark-filings', '', '', '3'),
  ...generateDocuments(20, 'motions', 'folder-motions', '', '', '4'),
  ...generateDocuments(20, 'depositions', 'folder-depositions', '', '', '4'),
  ...generateDocuments(20, 'handbooks', 'folder-handbooks', '', '', '5'),
  ...generateDocuments(20, 'investigations', 'folder-investigations', '', '', '5')
];