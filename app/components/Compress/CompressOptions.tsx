

import React from 'react';
import type { OutputType, CompressionOptions } from '../../types';
import { Slider } from '@/components/ui/slider';

interface CompressionOptionsProps {
  options: CompressionOptions;
  outputType: OutputType;
  onOptionsChange: (options: CompressionOptions) => void;
  onOutputTypeChange: (type: OutputType) => void;
}

export function CompressionOptions({
  options,
  outputType,
  onOptionsChange,
  onOutputTypeChange,
}: CompressionOptionsProps) {
  return (
    <div className="w-[600px] space-y-6 rounded-lg shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-2">
          Output Format
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['avif', 'jpeg', 'jxl', 'png', 'webp'] as const).map((format) => (
            <button
              key={format}
              className={`px-4 py-2 rounded-md text-sm font-medium uppercase ${
                outputType === format
                  ? 'bg-green-400 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onOutputTypeChange(format)}
            >
              {format}
            </button>
          ))}
        </div>
      </div>

      {outputType !== 'png' && (
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">
            Quality: {options.quality}%
          </label>
          <Slider defaultValue={[33]} max={100} step={1} value={[options.quality]} onValueChange={(val) => onOptionsChange({ quality: Number(val) })}/>

        </div>
      )}
    </div>
  );
}