import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import DesktopDashboard from './components/DesktopDashboard';
import NewLoanPage from './components/NewLoanPage';
import ReturnPage from './components/ReturnPage';
import CameraScannerModal from './components/CameraScannerModal';
import QrLabelGenerator from './components/QrLabelGenerator';
import PrintOfficialReport from './components/PrintOfficialReport';
import MasterDataManager from './components/MasterDataManager';
import MobileAccessPage from './components/MobileAccessPage';
import { api, connectRealtime } from './utils/api';
import { playChime } from './utils/sound';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [loans, setLoans] = useState([]);
  const [items, setItems] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState(null);
  const [networkInfo, setNetworkInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(false);

  const [newLoanItemCode, setNewLoanItemCode] = useState('');
  const [returnTargetLoan, setReturnTargetLoan] = useState(null);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('kajurin_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeNotification, setActiveNotification] = useState(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('kajurin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('kajurin_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  useEffect(() => {
    loadInitialData();

    const params = new URLSearchParams(window.location.search);
    const itemCode = params.get('item');
    if (itemCode) {
      handleItemScanned(itemCode);
    }
  }, []);

  useEffect(() => {
    const disconnect = connectRealtime((message) => {
      if (message.type === 'CONNECTED') {
        setIsRealtimeConnected(true);
      } else if (message.type === 'LOAN_CREATED') {
        playChime('loan');
        setActiveNotification({
          type: 'LOAN_CREATED',
          message: message.message || 'Peminjaman baru telah dicatat.'
        });
        refreshData();
      } else if (message.type === 'LOAN_RETURNED') {
        playChime('return');
        setActiveNotification({
          type: 'LOAN_RETURNED',
          message: message.message || 'Pengembalian barang berhasil diselesaikan.'
        });
        refreshData();
      } else if (message.type === 'ITEMS_UPDATED') {
        refreshData();
      }
    });

    return () => {
      disconnect();
    };
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      const [loansRes, itemsRes, teachersRes, classesRes, statsRes, netRes] = await Promise.all([
        api.getLoans(),
        api.getItems(),
        api.getTeachers(),
        api.getClasses(),
        api.getStats(),
        api.getNetworkInfo()
      ]);
      setLoans(loansRes);
      setItems(itemsRes);
      setTeachers(teachersRes);
      setClasses(classesRes);
      setStats(statsRes);
      setNetworkInfo(netRes);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshData() {
    try {
      const [loansRes, itemsRes, teachersRes, classesRes, statsRes] = await Promise.all([
        api.getLoans(),
        api.getItems(),
        api.getTeachers(),
        api.getClasses(),
        api.getStats()
      ]);
      setLoans(loansRes);
      setItems(itemsRes);
      setTeachers(teachersRes);
      setClasses(classesRes);
      setStats(statsRes);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  }

  const handleItemScanned = async (code) => {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();
    try {
      const statusRes = await api.getActiveLoanByItem(cleanCode);
      if (statusRes.isBorrowed && statusRes.loan) {
        setReturnTargetLoan(statusRes.loan);
        setCurrentView('return-loan');
      } else {
        setNewLoanItemCode(cleanCode);
        setCurrentView('new-loan');
      }
    } catch (err) {
      console.warn('Scan lookup error:', err);
      setNewLoanItemCode(cleanCode);
      setCurrentView('new-loan');
    }
  };

  const handleOpenNewLoan = (itemCode = '') => {
    setNewLoanItemCode(itemCode);
    setCurrentView('new-loan');
  };

  const handleOpenReturn = (loan) => {
    setReturnTargetLoan(loan);
    setCurrentView('return-loan');
  };

  const activeLoansCount = loans.filter(l => l.status === 'DIPINJAM').length;

  const getViewTitle = () => {
    switch (currentView) {
      case 'new-loan': return 'Catat Peminjaman Inventaris';
      case 'return-loan': return 'Konfirmasi Pengembalian Barang';
      case 'qr-labels': return 'Generator Stiker Label QR Barang';
      case 'reports': return 'Dokumen Resmi Formulir Fisik Kajur';
      case 'master-data': return 'Manajemen Master Data Inventaris';
      case 'scanner': return 'Pemindai Kamera QR Code';
      case 'mobile-access': return 'Akses HP Petugas (Wi-Fi)';
      default: return 'Sirkulasi & Monitoring Peminjaman';
    }
  };

  return (
    <div className="min-h-screen bg-neu-base flex flex-row font-sans text-neu-text antialiased overflow-x-hidden transition-colors duration-200">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        activeLoansCount={activeLoansCount}
        networkInfo={networkInfo}
        isRealtimeConnected={isRealtimeConnected}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <TopHeader
          currentViewTitle={getViewTitle()}
          onOpenNewLoan={() => handleOpenNewLoan()}
          onQuickScanSubmit={handleItemScanned}
          isDark={isDark}
          onToggleTheme={toggleTheme}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-stone-500" role="status">
              <div className="w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="font-bold text-xs text-stone-600 dark:text-stone-400">Menghubungkan ke workstation KAJURIN...</p>
            </div>
          ) : currentView === 'dashboard' ? (
            <DesktopDashboard
              loans={loans}
              items={items}
              stats={stats}
              onOpenReturn={handleOpenReturn}
              onOpenScanner={() => setCurrentView('scanner')}
              onOpenNewLoan={handleOpenNewLoan}
              activeNotification={activeNotification}
              onDismissNotification={() => setActiveNotification(null)}
            />
          ) : currentView === 'new-loan' ? (
            <NewLoanPage
              onClose={() => setCurrentView('dashboard')}
              onSuccess={() => {
                refreshData();
                setCurrentView('dashboard');
              }}
              prefilledItemCode={newLoanItemCode}
              allItems={items}
              teachers={teachers}
              classes={classes}
            />
          ) : currentView === 'return-loan' ? (
            <ReturnPage
              loan={returnTargetLoan}
              onClose={() => setCurrentView('dashboard')}
              onSuccess={() => {
                refreshData();
                setCurrentView('dashboard');
              }}
            />
          ) : currentView === 'qr-labels' ? (
            <QrLabelGenerator
              items={items}
              networkInfo={networkInfo}
              onClose={() => setCurrentView('dashboard')}
            />
          ) : currentView === 'reports' ? (
            <PrintOfficialReport
              loans={loans}
              items={items}
              onClose={() => setCurrentView('dashboard')}
            />
          ) : currentView === 'master-data' ? (
            <MasterDataManager
              onClose={() => setCurrentView('dashboard')}
              onDataChange={refreshData}
            />
          ) : currentView === 'scanner' ? (
            <CameraScannerModal
              isOpen={true}
              onClose={() => setCurrentView('dashboard')}
              onScanSuccess={(code) => {
                handleItemScanned(code);
              }}
            />
          ) : currentView === 'mobile-access' ? (
            <MobileAccessPage
              networkInfo={networkInfo}
              onClose={() => setCurrentView('dashboard')}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
