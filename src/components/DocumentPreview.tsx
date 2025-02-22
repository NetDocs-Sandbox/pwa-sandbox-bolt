import React from 'react';
import { Document } from '../types';
import { 
  NDText as Text,
  NDCard as Card,
  NDDivider as Divider,
  tokens
} from '@netdocuments/atticus';

// Let's log the available tokens to see what we can use
console.log('Available tokens:', tokens);

interface DocumentPreviewProps {
  documentId: string;
  position: { x: number; y: number };
  onClose: () => void;
}

export function DocumentPreview({ documentId, position, onClose }: DocumentPreviewProps) {
  return (
    <div 
      className="fixed inset-y-0 right-0 bg-white shadow-2xl border-l border-gray-200"
      style={{
        width: '500px', // Slightly narrower
        pointerEvents: 'none',
        zIndex: 1000,
        transform: 'translateZ(0)', // Force GPU acceleration
        transition: 'opacity 150ms ease-in-out',
        opacity: 1,
      }}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Text variant="large" block>Document Preview</Text>
          <Text variant="small" block className="text-gray-500">
            Document ID: {documentId}
          </Text>
        </div>
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Text variant="xxLarge" block className="text-center">
              LEGAL SERVICES AGREEMENT
            </Text>

            <Text block>
              THIS AGREEMENT is made on this day of [DATE], by and between:
            </Text>

            <Text>WHEREAS, the Client wishes to engage the services of the Attorney for legal representation;</Text>

            <div className="space-y-4">
              <Text variant="xLarge">1. SCOPE OF SERVICES</Text>
              <Text>1.1 The Attorney shall provide legal services to the Client in connection with [MATTER DESCRIPTION].</Text>
              <Text>1.2 The scope of services includes, but is not limited to:</Text>
              <ul className="list-disc list-inside pl-4">
                <li><Text>Legal consultation and advice</Text></li>
                <li><Text>Document preparation and review</Text></li>
                <li><Text>Representation in negotiations</Text></li>
                <li><Text>Court appearances, if necessary</Text></li>
              </ul>
            </div>

            <Divider />

            <div className="space-y-4">
              <Text variant="xLarge">2. FEES AND PAYMENT</Text>
              <Text>2.1 The Client agrees to pay the Attorney for legal services at the rate of [RATE] per hour.</Text>
              <Text>2.2 The Client shall be responsible for all costs and expenses incurred in connection with the matter.</Text>
            </div>

            <Divider />

            <div className="space-y-4">
              <Text variant="xLarge">3. CONFIDENTIALITY</Text>
              <Text>3.1 The Attorney shall maintain strict confidentiality of all information provided by the Client.</Text>
              <Text>3.2 This obligation shall survive the termination of this Agreement.</Text>
            </div>

            <Divider />

            <div className="mt-12 pt-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Text variant="subtitle">CLIENT:</Text>
                  <div className="border-b border-gray-400 w-48 h-8 mt-4"></div>
                  <Text variant="caption" className="mt-2">Date: _____________</Text>
                </div>
                <div>
                  <Text variant="subtitle">ATTORNEY:</Text>
                  <div className="border-b border-gray-400 w-48 h-8 mt-4"></div>
                  <Text variant="caption" className="mt-2">Date: _____________</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 