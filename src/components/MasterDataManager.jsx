import React, { useState, useEffect } from 'react';
import { Package, Users, GraduationCap, Plus, Trash2, Edit3, X, Check, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../utils/api';

export default function MasterDataManager({ onClose, onDataChange }) {
  const [activeTab, setActiveTab] = useState('items'); // 'items' | 'teachers' | 'classes'
  const [items, setItems] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Item form
  const [itemCode, setItemCode] = useState('');
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('PROYEKTOR');
  const [itemCondition, setItemCondition] = useState('BAIK');
  const [editingItemId, setEditingItemId] = useState(null);

  // Teacher form
  const [newTeacherName, setNewTeacherName] = useState('');

  // Class form
  const [newClassName, setNewClassName] = useState('');

  useEffect(() => {
    loadAll();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [it, tc, cl] = await Promise.all([
        api.getItems(),
        api.getTeachers(),
        api.getClasses()
      ]);
      setItems(it);
      setTeachers(tc);
      setClasses(cl);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleSaveItem = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingItemId) {
        await api.updateItem(editingItemId, {
          item_code: itemCode,
          name: itemName,
          category: itemCategory,
          condition: itemCondition
        });
      } else {
        await api.createItem({
          item_code: itemCode,
          name: itemName,
          category: itemCategory,
          condition: itemCondition
        });
      }
      resetItemForm();
      await loadAll();
      if (onDataChange) onDataChange();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetItemForm = () => {
    setItemCode('');
    setItemName('');
    setItemCategory('PROYEKTOR');
    setItemCondition('BAIK');
    setEditingItemId(null);
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setItemCode(item.item_code);
    setItemName(item.name);
    setItemCategory(item.category);
    setItemCondition(item.condition);
  };

  const handleDeleteItem = async (id) => {
    if (!confirm('Yakin ingin menghapus data barang ini?')) return;
    try {
      await api.deleteItem(id);
      await loadAll();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddTeacher = async (e) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;
    try {
      await api.createTeacher({ name: newTeacherName });
      setNewTeacherName('');
      await loadAll();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTeacher = async (id) => {
    if (!confirm('Hapus nama guru ini?')) return;
    try {
      await api.deleteTeacher(id);
      await loadAll();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddClass = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    try {
      await api.createClass({ name: newClassName });
      setNewClassName('');
      await loadAll();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!confirm('Hapus kelas ini?')) return;
    try {
      await api.deleteClass(id);
      await loadAll();
      if (onDataChange) onDataChange();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#d8e1eb] dark:border-[#242832]">
        <div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neu-base neu-flat-xs hover:neu-flat-sm active:neu-inset-xs text-slate-700 dark:text-slate-300 text-xs font-bold transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Sirkulasi</span>
          </button>
          <h2 id="master-data-title" className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-display">
            Manajemen Master Data KAJURIN
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Kelola data inventaris barang, data guru pengampu, dan daftar kelas SMK Negeri 1 Beringin
          </p>
        </div>
      </div>

      <div className="relative w-full bg-neu-base rounded-2xl neu-flat border border-white/60 dark:border-white/10 overflow-hidden text-slate-800 dark:text-slate-100">

        {/* Tab Switcher */}
        <div className="p-3 bg-neu-base border-b border-[#d8e1eb] dark:border-[#242832]">
          <div className="inline-flex p-1 bg-neu-base neu-inset-sm rounded-xl gap-1 text-xs font-bold" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'items'}
              onClick={() => setActiveTab('items')}
              className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'items'
                  ? 'bg-neu-base neu-flat-sm text-teal-900 dark:text-teal-300 font-bold border border-white/60 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              Master Barang ({items.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'teachers'}
              onClick={() => setActiveTab('teachers')}
              className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'teachers'
                  ? 'bg-neu-base neu-flat-sm text-teal-900 dark:text-teal-300 font-bold border border-white/60 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              Master Guru ({teachers.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'classes'}
              onClick={() => setActiveTab('classes')}
              className={`py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition ${
                activeTab === 'classes'
                  ? 'bg-neu-base neu-flat-sm text-teal-900 dark:text-teal-300 font-bold border border-white/60 dark:border-white/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              Master Kelas ({classes.length})
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-4 mt-3 p-3 bg-rose-50 border border-rose-300 text-rose-900 rounded-lg text-xs flex items-center gap-2" role="alert">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-5 max-h-[65vh] overflow-y-auto">
          {/* TAB 1: MASTER BARANG */}
          {activeTab === 'items' && (
            <div className="space-y-5">
              {/* Form Input Barang */}
              <form onSubmit={handleSaveItem} className="p-4 bg-stone-50 rounded-lg border border-stone-300">
                <h3 className="font-bold text-xs text-stone-800 uppercase tracking-wider mb-3">
                  {editingItemId ? 'Edit Data Barang Inventaris' : 'Tambah Barang Baru'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label htmlFor="item-code-input" className="block font-bold text-stone-700 mb-1">Kode Barang</label>
                    <input
                      id="item-code-input"
                      type="text"
                      placeholder="Contoh: INF-04, COK-04"
                      value={itemCode}
                      onChange={(e) => setItemCode(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded uppercase font-mono bg-white"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="item-name-input" className="block font-bold text-stone-700 mb-1">Nama Barang</label>
                    <input
                      id="item-name-input"
                      type="text"
                      placeholder="Contoh: Proyektor Epson EB-E500"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="item-cat-select" className="block font-bold text-stone-700 mb-1">Kategori</label>
                    <select
                      id="item-cat-select"
                      value={itemCategory}
                      onChange={(e) => setItemCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded font-medium bg-white"
                    >
                      <option value="PROYEKTOR">PROYEKTOR</option>
                      <option value="ALAT_BEBAS">ALAT_BEBAS</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-700">Kondisi Fisik:</span>
                    <button
                      type="button"
                      onClick={() => setItemCondition(itemCondition === 'BAIK' ? 'RUSAK' : 'BAIK')}
                      className={`px-3 py-1 rounded text-xs font-bold border transition ${
                        itemCondition === 'BAIK'
                          ? 'bg-green-100 text-green-900 border-green-300'
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}
                    >
                      {itemCondition}
                    </button>
                  </div>

                  <div className="flex gap-2">
                    {editingItemId && (
                      <button
                        type="button"
                        onClick={resetItemForm}
                        className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 rounded text-xs font-medium"
                      >
                        Batal
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded text-xs font-bold flex items-center gap-1 shadow-xs transition"
                    >
                      <Check className="w-3.5 h-3.5" aria-hidden="true" />
                      {editingItemId ? 'Simpan Perubahan' : 'Tambah Barang'}
                    </button>
                  </div>
                </div>
              </form>

              {/* Table of Items */}
              <div className="rounded-lg border border-stone-300 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-100 font-bold text-stone-800 border-b border-stone-300">
                    <tr>
                      <th scope="col" className="py-2.5 px-3">Kode</th>
                      <th scope="col" className="py-2.5 px-3">Nama Barang</th>
                      <th scope="col" className="py-2.5 px-3">Kategori</th>
                      <th scope="col" className="py-2.5 px-3">Kondisi</th>
                      <th scope="col" className="py-2.5 px-3">Status</th>
                      <th scope="col" className="py-2.5 px-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {items.map(item => (
                      <tr key={item.id} className="hover:bg-stone-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-stone-900">{item.item_code}</td>
                        <td className="py-2.5 px-3 font-medium text-stone-900">{item.name}</td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-stone-300 bg-stone-100 text-stone-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.condition === 'BAIK' ? 'text-green-900 bg-green-100' : 'text-rose-900 bg-rose-100'
                          }`}>
                            {item.condition}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'TERSEDIA' ? 'text-green-900 bg-green-100' : 'text-orange-900 bg-orange-100'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => handleEditItem(item)}
                            className="p-1 text-teal-700 hover:bg-teal-50 rounded"
                            title="Edit data"
                            aria-label={`Edit ${item.name}`}
                          >
                            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            disabled={item.status === 'DIPINJAM'}
                            className="p-1 text-rose-700 hover:bg-rose-50 rounded disabled:opacity-30"
                            title="Hapus data"
                            aria-label={`Hapus ${item.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: MASTER GURU */}
          {activeTab === 'teachers' && (
            <div className="space-y-4">
              <form onSubmit={handleAddTeacher} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik Nama Guru baru (contoh: Pak Ican, Buk Maya)..."
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Tambah Guru
                </button>
              </form>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {teachers.map(teacher => (
                  <div key={teacher.id} className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs">
                    <span className="font-bold text-stone-800">{teacher.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteTeacher(teacher.id)}
                      className="p-1 text-rose-700 hover:bg-rose-100 rounded"
                      title="Hapus"
                      aria-label={`Hapus ${teacher.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MASTER KELAS */}
          {activeTab === 'classes' && (
            <div className="space-y-4">
              <form onSubmit={handleAddClass} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ketik Nama Kelas baru (contoh: XII TJKT 2)..."
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-lg text-xs uppercase focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition"
                >
                  <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  Tambah Kelas
                </button>
              </form>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {classes.map(cls => (
                  <div key={cls.id} className="flex items-center justify-between p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs">
                    <span className="font-bold text-stone-800">{cls.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteClass(cls.id)}
                      className="p-1 text-rose-700 hover:bg-rose-100 rounded"
                      title="Hapus"
                      aria-label={`Hapus ${cls.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
