
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode } from 'lucide-react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  title?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 200, 
  title = "QR Code" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      generateQRCode(value, canvasRef.current, size);
    }
  }, [value, size]);

  // Simple QR code generation (in production, use a proper QR library like 'qrcode')
  const generateQRCode = (text: string, canvas: HTMLCanvasElement, size: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Simple pattern generation (placeholder for real QR code)
    const modules = 25;
    const moduleSize = size / modules;
    
    ctx.fillStyle = '#000000';
    
    // Generate a simple pattern based on the hash
    for (let i = 0; i < modules; i++) {
      for (let j = 0; j < modules; j++) {
        const hash = text.charCodeAt((i * modules + j) % text.length);
        if (hash % 2 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Add corner markers (QR code style)
    const markerSize = moduleSize * 7;
    
    // Top-left marker
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(moduleSize, moduleSize, markerSize - 2 * moduleSize, markerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(2 * moduleSize, 2 * moduleSize, markerSize - 4 * moduleSize, markerSize - 4 * moduleSize);

    // Top-right marker
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - markerSize, 0, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size - markerSize + moduleSize, moduleSize, markerSize - 2 * moduleSize, markerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - markerSize + 2 * moduleSize, 2 * moduleSize, markerSize - 4 * moduleSize, markerSize - 4 * moduleSize);

    // Bottom-left marker
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, size - markerSize, markerSize, markerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(moduleSize, size - markerSize + moduleSize, markerSize - 2 * moduleSize, markerSize - 2 * moduleSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(2 * moduleSize, size - markerSize + 2 * moduleSize, markerSize - 4 * moduleSize, markerSize - 4 * moduleSize);
  };

  return (
    <Card className="w-fit">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <canvas 
          ref={canvasRef}
          className="border rounded-lg"
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <p className="text-xs text-gray-500 text-center max-w-xs break-all font-mono">
          {value}
        </p>
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;
