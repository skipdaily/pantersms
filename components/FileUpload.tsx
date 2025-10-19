
import React, { useCallback, useState } from 'react';
import { UploadIcon, XCircleIcon } from './icons';

interface FileUploadProps {
  onFileLoaded: (data: string[][]) => void;
  onReset: () => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded, onReset, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.trim()).filter(row => row);
        const data = rows.map(row => row.split(',').map(cell => cell.trim().replace(/"/g, '')));
        onFileLoaded(data);
      };
      reader.readAsText(file);
    }
  }, [onFileLoaded]);

  const handleLocalReset = () => {
    setFileName(null);
    onReset();
    // Reset the input field value
    const input = document.getElementById('csv-upload') as HTMLInputElement;
    if(input) input.value = '';
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-1">Step 1: Upload Recipients</h3>
      <p className="text-sm text-slate-500 mb-4">Upload a CSV file with a 'phone' or 'number' column.</p>
      
      {!disabled ? (
        <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-10 hover:border-indigo-500 transition-colors">
          <div className="text-center">
            <UploadIcon className="mx-auto h-12 w-12 text-slate-400" />
            <div className="mt-4 flex text-sm leading-6 text-slate-600">
              <label
                htmlFor="csv-upload"
                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
              >
                <span>Upload a file</span>
                <input id="csv-upload" name="csv-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-slate-500">CSV up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="mt-2 flex items-center justify-between bg-slate-100 rounded-lg p-4 border border-slate-200">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-800">File loaded:</span>
              <span className="text-sm text-indigo-600 truncate">{fileName}</span>
            </div>
          <button onClick={handleLocalReset} className="text-slate-500 hover:text-red-600 transition-colors">
            <XCircleIcon className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
