import React from 'react';
import { Document } from '../types';

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
        width: '800px',
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="text-lg font-medium text-gray-900">
            Legal Document Preview
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">LEGAL SERVICES AGREEMENT</h1>
              <p className="text-gray-600">Document ID: {documentId}</p>
            </div>

            <p className="text-sm text-gray-800 leading-relaxed">
              THIS AGREEMENT is made on this day of [DATE], by and between:
            </p>

            <p className="text-sm text-gray-800 leading-relaxed">
              WHEREAS, the Client wishes to engage the services of the Attorney for legal representation;
            </p>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">1. SCOPE OF SERVICES</h2>
              <p className="text-sm text-gray-800 leading-relaxed">
                1.1 The Attorney shall provide legal services to the Client in connection with [MATTER DESCRIPTION].
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                1.2 The scope of services includes, but is not limited to:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800 leading-relaxed pl-4">
                <li>Legal consultation and advice</li>
                <li>Document preparation and review</li>
                <li>Representation in negotiations</li>
                <li>Court appearances, if necessary</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">2. FEES AND PAYMENT</h2>
              <p className="text-sm text-gray-800 leading-relaxed">
                2.1 The Client agrees to pay the Attorney for legal services at the rate of [RATE] per hour.
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                2.2 The Client shall be responsible for all costs and expenses incurred in connection with the matter.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold">3. CONFIDENTIALITY</h2>
              <p className="text-sm text-gray-800 leading-relaxed">
                3.1 The Attorney shall maintain strict confidentiality of all information provided by the Client.
              </p>
              <p className="text-sm text-gray-800 leading-relaxed">
                3.2 This obligation shall survive the termination of this Agreement.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-semibold mb-4">CLIENT:</p>
                  <div className="border-b border-gray-400 w-48 h-8"></div>
                  <p className="text-sm text-gray-600 mt-2">Date: _____________</p>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-4">ATTORNEY:</p>
                  <div className="border-b border-gray-400 w-48 h-8"></div>
                  <p className="text-sm text-gray-600 mt-2">Date: _____________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 