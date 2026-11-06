const BASE_URL = '/api';

export const api = {
  // Stats & Network
  async getStats() {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    return res.json();
  },
  async getNetworkInfo() {
    const res = await fetch(`${BASE_URL}/network-info`);
    return res.json();
  },

  // Items
  async getItems(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/items${query ? '?' + query : ''}`);
    return res.json();
  },
  async getItemByCode(code) {
    const res = await fetch(`${BASE_URL}/items/${encodeURIComponent(code)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Barang tidak ditemukan');
    }
    return res.json();
  },
  async createItem(data) {
    const res = await fetch(`${BASE_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menambah barang');
    }
    return res.json();
  },
  async updateItem(id, data) {
    const res = await fetch(`${BASE_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal mengubah barang');
    }
    return res.json();
  },
  async deleteItem(id) {
    const res = await fetch(`${BASE_URL}/items/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menghapus barang');
    }
    return res.json();
  },

  // Teachers
  async getTeachers() {
    const res = await fetch(`${BASE_URL}/teachers`);
    return res.json();
  },
  async createTeacher(data) {
    const res = await fetch(`${BASE_URL}/teachers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menambah guru');
    }
    return res.json();
  },
  async deleteTeacher(id) {
    const res = await fetch(`${BASE_URL}/teachers/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Classes
  async getClasses() {
    const res = await fetch(`${BASE_URL}/classes`);
    return res.json();
  },
  async createClass(data) {
    const res = await fetch(`${BASE_URL}/classes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menambah kelas');
    }
    return res.json();
  },
  async deleteClass(id) {
    const res = await fetch(`${BASE_URL}/classes/${id}`, { method: 'DELETE' });
    return res.json();
  },

  // Loans
  async getLoans(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${BASE_URL}/loans${query ? '?' + query : ''}`);
    return res.json();
  },
  async getActiveLoanByItem(itemCode) {
    const res = await fetch(`${BASE_URL}/loans/active-by-item/${encodeURIComponent(itemCode)}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal memeriksa status barang');
    }
    return res.json();
  },
  async createLoan(data) {
    const res = await fetch(`${BASE_URL}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menyimpan peminjaman');
    }
    return res.json();
  },
  async returnLoan(loanId, data) {
    const res = await fetch(`${BASE_URL}/loans/${loanId}/return`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Gagal menyelesaikan pengembalian');
    }
    return res.json();
  }
};

// WebSocket connection utility
export function connectRealtime(onMessage) {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws`;

  let ws = null;
  let retryTimer = null;

  function connect() {
    try {
      ws = new WebSocket(wsUrl);

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (e) {
          console.error('WS parse error:', e);
        }
      };

      ws.onclose = () => {
        clearTimeout(retryTimer);
        retryTimer = setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (err) {
      retryTimer = setTimeout(connect, 3000);
    }
  }

  connect();

  return () => {
    clearTimeout(retryTimer);
    if (ws) ws.close();
  };
}

