/* QRScannerPage.tsx */
'use client';

import { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

export default function Page() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && scanning) {
      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: 250 },
        false
      );

      scanner.render(
        (decodedText: string) => {
          setScannedData(decodedText);
          setScanning(false);
          scanner.clear();
        },
        (error: any) => {
          console.warn(error);
        }
      );
    }
  }, [scanning]);

  return (
    <div className="min-h-screen bg-[#1e120a] text-white font-serif px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">QR Code Scanner</h1>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Data Section */}
        <div className={`w-full md:w-1/2 bg-white/10 p-6 rounded-lg ${!scannedData ? 'hidden md:block' : ''}`}>
          <h2 className="text-2xl font-semibold mb-4">Scanned Data</h2>
          {scannedData ? (
            <p className="text-white/90 break-words">{scannedData}</p>
          ) : (
            <p className="text-white/50">Scan a QR code to see the data here.</p>
          )}
        </div>

        {/* Scanner Section */}
        {scanning ? (
          <div className="w-full md:w-1/2 bg-white/10 p-4 rounded-lg">
            <div id="qr-reader" className="w-full h-96" />
          </div>
        ) : (
          <div className="w-full md:w-1/2 bg-white/10 p-6 rounded-lg md:hidden">
            <h2 className="text-2xl font-semibold mb-4">Scanned Data</h2>
            <p className="text-white/90 break-words">{scannedData}</p>
          </div>
        )}
      </div>
    </div>
  );
}