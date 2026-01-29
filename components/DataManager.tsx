
import React, { useState, useRef } from 'react';
import { Upload, Trash2, RefreshCcw, Check, X, FileUp, AlertCircle, FileText } from 'lucide-react';
import { TopProblem } from '../types';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { parseCSVString, exportToCSV } from '../utils/helpers';
import { ConfirmModal } from './ConfirmModal';
import { EmptyState } from './EmptyState';
import { Loader2, Download } from 'lucide-react';

const EXAMPLE_CSV = `Channel,Rate Plan,Commission,Revenue,Cancel Rate
Booking.com,Package,12621,57495,0.16
Agoda,Special Offer,5400,21000,0.05
Expedia,Member Deal,8500,42000,0.12`;

type ConfirmAction = 'reset' | 'clear' | null;

export const DataManager: React.FC = () => {
  const { topProblems: currentData, updateData, resetData, clearData } = useData();
  const { showToast } = useToast();
  
  const [csvInput, setCsvInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<TopProblem[] | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<ConfirmAction>(null);
  const [isFileLoading, setIsFileLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Handle Text Paste Parse
  const handleManualParse = () => {
    setError(null);
    if (!csvInput.trim()) {
      setError("Please enter CSV data or upload a file.");
      return;
    }
    setIsParsing(true);
    setTimeout(() => {
      try {
        const data = parseCSVString(csvInput);
        setPreviewData(data);
      } catch (err: any) {
        setError(err.message || "Invalid CSV format.");
      } finally {
        setIsParsing(false);
      }
    }, 0);
  };

  // 2. Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setIsFileLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setCsvInput(text);
        const data = parseCSVString(text);
        setPreviewData(data);
      } catch (err: any) {
        setError("Error parsing file: " + (err.message || "Unknown error"));
      } finally {
        setIsFileLoading(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 3. Confirm Import
  const saveImport = () => {
    if (previewData) {
      updateData(previewData);
      const count = previewData.length;
      setPreviewData(null);
      setCsvInput('');
      showToast('success', `Successfully updated dataset with ${count} rows.`);
    }
  };

  // 4. Cancel Preview
  const discardPreview = () => {
    setPreviewData(null);
    setCsvInput('');
    setError(null);
  };

  const handleReset = () => setConfirmOpen('reset');
  const handleClear = () => setConfirmOpen('clear');

  const handleExport = () => {
    if (currentData.length === 0) {
      showToast('info', 'No data to export.');
      return;
    }
    const csv = exportToCSV(currentData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-problems-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('success', `Exported ${currentData.length} rows.`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      setError('Please drop a .csv file.');
      return;
    }
    setIsFileLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        setCsvInput(text);
        const data = parseCSVString(text);
        setPreviewData(data);
      } catch (err: any) {
        setError('Error parsing file: ' + (err.message || 'Unknown error'));
      } finally {
        setIsFileLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const onConfirmAction = () => {
    if (confirmOpen === 'reset') {
      resetData();
      setPreviewData(null);
      showToast('success', 'Reset to default sample data.');
    } else if (confirmOpen === 'clear') {
      clearData();
      setPreviewData(null);
      showToast('info', 'All data cleared.');
    }
    setConfirmOpen(null);
  };

  // Determine which data to show
  const displayData = previewData || currentData;
  const isPreviewMode = previewData !== null;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Upload size={20} className="text-blue-600" />
            Import Top Problems Data
          </h2>
          <div className="text-xs text-gray-500">
            Supports .csv files or copy-paste
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-1 space-y-4">
            
            {/* Drag-drop zone & Upload */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-colors hover:border-blue-400 hover:bg-blue-50/30"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex justify-center items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded text-sm font-medium transition-colors"
              >
                <FileUp size={16} /> Upload CSV File
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">or drag and drop a .csv here</p>
            </div>

            <div className="text-center text-xs text-gray-400 font-medium">OR PASTE TEXT</div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500">
                CSV Header Format: <code className="bg-gray-100 px-1 rounded text-gray-700">Channel, RatePlan, Commission, Revenue, CancelRate</code>
              </p>
              <textarea
                className="w-full h-48 p-3 text-xs font-mono border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                placeholder={EXAMPLE_CSV}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
              />
              {error && (
                <div className="text-red-600 text-xs flex items-center gap-1 bg-red-50 p-2 rounded border border-red-100">
                  <AlertCircle size={12} /> {error}
                </div>
              )}
              
              <button 
                onClick={handleManualParse}
                disabled={isPreviewMode || isParsing}
                className={`w-full flex justify-center items-center gap-2 py-2 rounded text-sm font-medium transition-colors ${
                  isPreviewMode || isParsing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isParsing ? <Loader2 size={16} className="animate-spin" /> : <FileText size={16} />}
                {isParsing ? 'Parsing…' : 'Preview Data'}
              </button>
            </div>
          </div>

          {/* Table Preview Section */}
          <div className="lg:col-span-2 flex flex-col h-[450px]">
            
            {/* Table Header / Toolbar */}
            <div className={`flex justify-between items-center p-3 rounded-t border-t border-l border-r ${
              isPreviewMode ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'
            }`}>
              <div className="flex items-center gap-2">
                {isPreviewMode ? (
                  <div className="flex items-center gap-2 text-amber-700">
                    <AlertCircle size={16} />
                    <span className="font-bold text-sm">Preview Mode: Unsaved Changes</span>
                    <span className="text-xs px-2 py-0.5 bg-amber-200 rounded-full font-mono">
                      {previewData.length} rows
                    </span>
                  </div>
                ) : (
                  <span className="text-sm font-semibold text-gray-700">
                    Current Dataset ({currentData.length} rows)
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {isPreviewMode ? (
                  <>
                    <button 
                      onClick={discardPreview}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 rounded border border-gray-300 transition-colors"
                    >
                      <X size={14} /> Discard
                    </button>
                    <button 
                      onClick={saveImport}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded shadow-sm transition-colors"
                    >
                      <Check size={14} /> Confirm Import
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={handleExport}
                      disabled={currentData.length === 0}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded border border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download size={12} /> Export CSV
                    </button>
                    <button 
                      onClick={handleReset}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded border border-gray-300"
                    >
                      <RefreshCcw size={12} /> Reset Default
                    </button>
                    <button 
                      onClick={handleClear}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200"
                    >
                      <Trash2 size={12} /> Clear
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* The Table */}
            <div className={`flex-1 overflow-auto border-b border-l border-r rounded-b relative ${
              isPreviewMode ? 'border-amber-200 bg-amber-50/10' : 'border-gray-200 bg-white'
            }`}>
              {(isFileLoading || isParsing) ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                  <div className="flex flex-col items-center gap-2 text-gray-600">
                    <Loader2 size={32} className="animate-spin text-blue-600" />
                    <span className="text-sm font-medium">Loading data…</span>
                  </div>
                </div>
              ) : null}
              <table className="w-full text-xs text-left border-collapse">
                <thead className={`sticky top-0 z-10 ${isPreviewMode ? 'bg-amber-100 text-amber-900' : 'bg-gray-50 text-gray-600'}`}>
                  <tr>
                    <th className="p-2 border-b font-semibold">Channel</th>
                    <th className="p-2 border-b font-semibold">Rate Plan</th>
                    <th className="p-2 border-b font-semibold text-right">Comm.</th>
                    <th className="p-2 border-b font-semibold text-right">Revenue</th>
                    <th className="p-2 border-b font-semibold text-right">Cancel %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {displayData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-0 align-top">
                        <EmptyState
                          title="No data available"
                          description={isPreviewMode ? 'Preview has no rows.' : 'Upload a CSV file or paste data above to get started.'}
                        />
                      </td>
                    </tr>
                  ) : (
                    displayData.map((row, idx) => (
                      <tr key={idx} className={`hover:bg-gray-50 ${isPreviewMode ? 'text-gray-600' : ''}`}>
                        <td className="p-2 truncate max-w-[100px] border-r border-transparent">{row.channel}</td>
                        <td className="p-2 truncate max-w-[100px] text-gray-500">{row.ratePlan}</td>
                        <td className="p-2 text-right font-mono">{row.commission.toLocaleString()}</td>
                        <td className="p-2 text-right font-mono">{row.revenue.toLocaleString()}</td>
                        <td className="p-2 text-right">{(row.cancelRate * 100).toFixed(1)}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen === 'reset'}
        title="Reset to default"
        message="Reset to default sample data? Current data will be replaced."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        variant="default"
        onConfirm={onConfirmAction}
        onCancel={() => setConfirmOpen(null)}
      />
      <ConfirmModal
        open={confirmOpen === 'clear'}
        title="Clear all data"
        message="Clear all data? This cannot be undone."
        confirmLabel="Clear"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={onConfirmAction}
        onCancel={() => setConfirmOpen(null)}
      />
    </div>
  );
};
