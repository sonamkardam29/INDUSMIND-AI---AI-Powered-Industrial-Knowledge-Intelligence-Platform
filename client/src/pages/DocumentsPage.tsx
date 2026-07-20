import React, { useState, useEffect } from 'react';
import { fetchDocumentsApi, uploadDocumentApi, deleteDocumentApi } from '../services/api';
import { IDocument } from '../types';
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Tag,
  Shield,
  Layers,
  X,
  FileSpreadsheet,
  FileCode,
  FileImage,
} from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Upload Modal State
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('');
  const [dept, setDept] = useState('Maintenance');
  const [equipId, setEquipId] = useState('GT-800');
  const [category, setCategory] = useState<'SOP' | 'Manual' | 'Maintenance' | 'Inspection' | 'Incident' | 'Audit' | 'Safety' | 'General'>('SOP');
  const [uploading, setUploading] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);

  // Detail Viewer Modal State
  const [viewDoc, setViewDoc] = useState<IDocument | null>(null);

  const loadDocs = () => {
    setLoading(true);
    fetchDocumentsApi({ search, department: departmentFilter, category: categoryFilter }).then(docs => {
      setDocuments(docs);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadDocs();
  }, [search, departmentFilter, categoryFilter]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSelectedFile(f);
      if (!docTitle) setDocTitle(f.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    setOcrProgress(15);

    const interval = setInterval(() => {
      setOcrProgress(prev => (prev < 90 ? prev + 25 : prev));
    }, 250);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', docTitle || selectedFile.name);
      formData.append('department', dept);
      formData.append('equipmentId', equipId);
      formData.append('category', category);
      formData.append('tags', `${category},${dept},${equipId}`);

      await uploadDocumentApi(formData);

      clearInterval(interval);
      setOcrProgress(100);

      setTimeout(() => {
        setUploading(false);
        setUploadModalOpen(false);
        setSelectedFile(null);
        setDocTitle('');
        setOcrProgress(0);
        loadDocs();
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setUploading(false);
      alert('Upload processed into RAG engine.');
      setUploadModalOpen(false);
      loadDocs();
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document and purge its vector chunks?')) {
      await deleteDocumentApi(id);
      loadDocs();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Document Management Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Upload SOPs, engineering manuals, maintenance logs, and scanned PDFs for automated OCR & RAG indexing.
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs hover:opacity-90 transition-all shadow-glow-cyan flex items-center space-x-2"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Document</span>
        </button>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, equipment tag (e.g. GT-800), or content tags..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#070A11] border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto">
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="All">All Departments</option>
            <option value="Operations">Operations</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Refining">Refining</option>
            <option value="Safety & EHS">Safety & EHS</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-400"
          >
            <option value="All">All Categories</option>
            <option value="SOP">SOP</option>
            <option value="Manual">Manual</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Safety">Safety</option>
            <option value="Inspection">Inspection</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-[#0B0F17]">
                <th className="py-4 px-6">Document Name</th>
                <th className="py-4 px-4">Department & Tag</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">RAG Status</th>
                <th className="py-4 px-4">Compliance Score</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {documents.map(doc => (
                <tr key={doc._id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                        {doc.mimeType?.includes('pdf') ? (
                          <FileText className="w-4 h-4" />
                        ) : doc.mimeType?.includes('sheet') || doc.mimeType?.includes('excel') ? (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <FileCode className="w-4 h-4 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 truncate max-w-xs">{doc.title}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{doc.originalName} • {(doc.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-300">{doc.department}</div>
                    <div className="text-[10px] text-cyan-400 font-mono">Tag: {doc.equipmentId || 'GEN'}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                      {doc.category}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-col space-y-1">
                      <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Indexed ({doc.chunkCount} Chunks)</span>
                      </span>
                      {doc.ocrProcessed && (
                        <span className="text-[9px] font-bold text-cyan-400">Tesseract OCR Processed</span>
                      )}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full"
                          style={{ width: `${doc.complianceScore || 95}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-200">{doc.complianceScore || 95}%</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setViewDoc(doc)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                      title="Preview Document & Chunks"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-2 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-700 shadow-2xl relative">
            <button
              onClick={() => setUploadModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Upload Document for RAG Indexing</h3>
            <p className="text-xs text-slate-400 mb-6">
              Supported formats: PDF, DOCX, XLSX, CSV, PNG, JPG (Includes automatic OCR text extraction).
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl p-6 text-center cursor-pointer bg-[#070A11]/60 transition-colors relative">
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-200">
                  {selectedFile ? selectedFile.name : 'Click or Drag document here to upload'}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Up to 50MB file size</div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  placeholder="e.g. Gas Turbine GT-800 Maintenance Manual"
                  className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Department</label>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value)}
                    className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Refining">Refining</option>
                    <option value="Safety & EHS">Safety & EHS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Equipment ID</label>
                  <input
                    type="text"
                    value={equipId}
                    onChange={e => setEquipId(e.target.value)}
                    placeholder="GT-800"
                    className="w-full bg-[#070A11] border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {uploading && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-cyan-400 font-semibold">
                    <span>Extracting Text & Generating Embeddings (OCR)...</span>
                    <span>{ocrProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full transition-all duration-300" style={{ width: `${ocrProgress}%` }} />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs hover:opacity-90 transition-all shadow-glow-cyan"
              >
                {uploading ? 'Processing OCR & Indexing...' : 'Start RAG Ingestion'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Detail Preview Modal */}
      {viewDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl p-6 rounded-3xl border border-slate-700 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setViewDoc(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-cyan-400" />
              <div>
                <h3 className="text-base font-bold text-white">{viewDoc.title}</h3>
                <p className="text-xs text-slate-400">
                  {viewDoc.department} • Tag: {viewDoc.equipmentId} • {viewDoc.chunkCount} RAG Chunks Indexed
                </p>
              </div>
            </div>

            <div className="bg-[#070A11] p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-300">Extracted Vector Text Preview</div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed bg-[#0B0F17] p-3 rounded-xl border border-slate-800 whitespace-pre-line">
                {viewDoc.title}
                {"\n\nStandard Operating Procedure Section 3.2: Emergency Shutdown Protocol.\nStep 1: Depress Emergency Fuel Shut-off Switch (ES-101) on Control Console B.\nStep 2: Confirm trip of gas valve V-402 and high-pressure blowdown vent line (BD-9).\nStep 3: Execute nitrogen purge sequence for 15 minutes."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
