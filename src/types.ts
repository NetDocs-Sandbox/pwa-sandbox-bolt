import React from 'react';

export interface Organization {
  id: string;
  name: string;
  logo?: string;
}

export interface Cabinet {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  name: string;
  cabinetId: string;
}

export interface Matter {
  id: string;
  name: string;
  clientId: string;
}

export interface Document {
  id: string;
  name: string;
  type: 'file' | 'folder';
  matterId: string;
  clientId: string;
  cabinetId: string;
  path: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  totalVersions: number;
  lastActiveAt: string;
  addedBy: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  lastModifiedBy: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  yourActivity: {
    action: 'created' | 'edited' | 'viewed';
    date: string;
  };
}

export interface FavoriteItem {
  id: string;
  type: 'cabinet' | 'client' | 'matter' | 'document';
  itemId: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
  organizationId: string;
}