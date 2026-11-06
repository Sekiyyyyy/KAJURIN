const express = require('express');
const os = require('os');

function getDayNameIndonesian(date) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  return days[date.getDay()];
}

function formatDateDDMMYY(date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
}

function formatTimeHHmm(date) {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
}

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // skip internal (i.e. 127.0.0.1) and non-ipv4
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({ interface: name, address: iface.address });
      }
    }
  }
  return addresses;
}

function createApiRouter(db, broadcast) {
  const router = express.Router();

  // Network info for Wi-Fi QR connection
  router.get('/network-info', (req, res) => {
    const ips = getLocalIpAddresses();
    const port = process.env.PORT || 3000;
    const urls = ips.map(ip => `http://${ip.address}:${port}`);
    res.json({
      ips,
      port,
      primaryUrl: urls.length > 0 ? urls[0] : `http://localhost:${port}`,
      urls
    });
  });

  // Dashboard Stats & Real-time Analytics
  router.get('/dashboard/stats', (req, res) => {
    const totalItems = db.queryOne('SELECT count(*) as count FROM items').count;
    const activeLoans = db.queryOne("SELECT count(*) as count FROM loans WHERE status = 'DIPINJAM'").count;
    const availableItems = db.queryOne("SELECT count(*) as count FROM items WHERE status = 'TERSEDIA'").count;
    const todayStr = formatDateDDMMYY(new Date());
    const returnedToday = db.queryOne("SELECT count(*) as count FROM loans WHERE status = 'SELESAI' AND loan_date = ?", [todayStr]).count;

    // Category breakdown
    const categories = db.query(`
      SELECT 
        category,
        count(*) as total,
        sum(case when status = 'TERSEDIA' then 1 else 0 end) as available,
        sum(case when status = 'DIPINJAM' then 1 else 0 end) as borrowed
      FROM items
      GROUP BY category
    `);

    // Top teachers borrowing
    const topTeachers = db.query(`
      SELECT teacher_name, count(*) as count
      FROM loans
      GROUP BY teacher_name
      ORDER BY count DESC
      LIMIT 5
    `);

    // Top classes borrowing
    const topClasses = db.query(`
      SELECT class_name, count(*) as count
      FROM loans
      GROUP BY class_name
      ORDER BY count DESC
      LIMIT 5
    `);

    // Hourly distribution
    const allLoans = db.query('SELECT start_time FROM loans');
    const hourlyBuckets = {
      '07:00': 0,
      '08:00': 0,
      '09:00': 0,
      '10:00': 0,
      '11:00': 0,
      '12:00': 0,
      '13:00': 0,
      '14:00': 0
    };
    allLoans.forEach(l => {
      if (l.start_time) {
        const h = l.start_time.split(':')[0];
        const key = `${h.padStart(2, '0')}:00`;
        if (hourlyBuckets[key] !== undefined) {
          hourlyBuckets[key]++;
        } else {
          hourlyBuckets['08:00']++;
        }
      }
    });

    const hourlyActivity = Object.keys(hourlyBuckets).map(time => ({
      time,
      count: hourlyBuckets[time]
    }));

    // Current rack slots with borrower info
    const rackSlots = db.query(`
      SELECT 
        i.id,
        i.item_code,
        i.name,
        i.category,
        i.status,
        i.condition,
        l.borrower_name,
        l.teacher_name,
        l.class_name,
        l.start_time,
        l.id as active_loan_id
      FROM items i
      LEFT JOIN (
        SELECT ld.item_id, l.id, l.borrower_name, l.teacher_name, l.class_name, l.start_time
        FROM loan_details ld
        JOIN loans l ON l.id = ld.loan_id
        WHERE l.status = 'DIPINJAM'
      ) l ON l.item_id = i.id
      ORDER BY i.category DESC, i.item_code ASC
    `);

    res.json({
      totalItems,
      activeLoans,
      availableItems,
      returnedToday,
      categories,
      topTeachers,
      topClasses,
      hourlyActivity,
      rackSlots
    });
  });

  // Master Items
  router.get('/items', (req, res) => {
    const { status, category } = req.query;
    let sql = 'SELECT * FROM items WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    sql += ' ORDER BY category DESC, item_code ASC';

    const items = db.query(sql, params);
    res.json(items);
  });

  router.get('/items/:code', (req, res) => {
    const item = db.queryOne('SELECT * FROM items WHERE item_code = ?', [req.params.code.toUpperCase()]);
    if (!item) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }
    res.json(item);
  });

  router.post('/items', (req, res) => {
    const { item_code, name, category, condition } = req.body;
    if (!item_code || !name || !category) {
      return res.status(400).json({ error: 'Kode barang, nama, dan kategori wajib diisi' });
    }

    const code = item_code.trim().toUpperCase();
    const existing = db.queryOne('SELECT id FROM items WHERE item_code = ?', [code]);
    if (existing) {
      return res.status(400).json({ error: `Kode barang ${code} sudah terdaftar` });
    }

    const id = db.runWithId(
      'INSERT INTO items (item_code, name, category, condition, status) VALUES (?, ?, ?, ?, ?)',
      [code, name.trim(), category, condition || 'BAIK', 'TERSEDIA']
    );

    const newItem = db.queryOne('SELECT * FROM items WHERE id = ?', [id]);
    broadcast({ type: 'ITEMS_UPDATED', item: newItem });
    res.status(201).json(newItem);
  });

  router.put('/items/:id', (req, res) => {
    const { item_code, name, category, condition, status } = req.body;
    const id = parseInt(req.params.id, 10);

    const existing = db.queryOne('SELECT * FROM items WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    db.run(
      'UPDATE items SET item_code = ?, name = ?, category = ?, condition = ?, status = ? WHERE id = ?',
      [
        item_code ? item_code.toUpperCase().trim() : existing.item_code,
        name ? name.trim() : existing.name,
        category || existing.category,
        condition || existing.condition,
        status || existing.status,
        id
      ]
    );

    const updated = db.queryOne('SELECT * FROM items WHERE id = ?', [id]);
    broadcast({ type: 'ITEMS_UPDATED', item: updated });
    res.json(updated);
  });

  router.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const existing = db.queryOne('SELECT * FROM items WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Barang tidak ditemukan' });
    }

    if (existing.status === 'DIPINJAM') {
      return res.status(400).json({ error: 'Barang sedang dipinjam, tidak dapat dihapus' });
    }

    db.run('DELETE FROM items WHERE id = ?', [id]);
    broadcast({ type: 'ITEMS_UPDATED' });
    res.json({ success: true, message: 'Barang berhasil dihapus' });
  });

  // Master Teachers
  router.get('/teachers', (req, res) => {
    const teachers = db.query('SELECT * FROM teachers ORDER BY name ASC');
    res.json(teachers);
  });

  router.post('/teachers', (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nama guru wajib diisi' });
    }
    const cleanName = name.trim();
    const existing = db.queryOne('SELECT id FROM teachers WHERE LOWER(name) = LOWER(?)', [cleanName]);
    if (existing) {
      return res.status(400).json({ error: 'Nama guru sudah ada' });
    }

    const id = db.runWithId('INSERT INTO teachers (name) VALUES (?)', [cleanName]);
    res.status(201).json({ id, name: cleanName });
  });

  router.delete('/teachers/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.run('DELETE FROM teachers WHERE id = ?', [id]);
    res.json({ success: true });
  });

  // Master Classes
  router.get('/classes', (req, res) => {
    const classes = db.query('SELECT * FROM classes ORDER BY name ASC');
    res.json(classes);
  });

  router.post('/classes', (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Nama kelas wajib diisi' });
    }
    const cleanName = name.trim().toUpperCase();
    const existing = db.queryOne('SELECT id FROM classes WHERE LOWER(name) = LOWER(?)', [cleanName]);
    if (existing) {
      return res.status(400).json({ error: 'Kelas sudah ada' });
    }

    const id = db.runWithId('INSERT INTO classes (name) VALUES (?)', [cleanName]);
    res.status(201).json({ id, name: cleanName });
  });

  router.delete('/classes/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    db.run('DELETE FROM classes WHERE id = ?', [id]);
    res.json({ success: true });
  });

  // Active Loan lookup by Item Code (Essential for Scan 2 Pengembalian)
  router.get('/loans/active-by-item/:code', (req, res) => {
    const code = req.params.code.toUpperCase().trim();
    const item = db.queryOne('SELECT * FROM items WHERE item_code = ?', [code]);
    if (!item) {
      return res.status(404).json({ error: `Barang dengan kode ${code} tidak ditemukan` });
    }

    if (item.status === 'TERSEDIA') {
      return res.json({
        isBorrowed: false,
        item,
        loan: null
      });
    }

    // Find the active loan for this item
    const loanDetail = db.queryOne(`
      SELECT ld.*, l.* 
      FROM loan_details ld
      JOIN loans l ON l.id = ld.loan_id
      WHERE ld.item_id = ? AND l.status = 'DIPINJAM'
      ORDER BY l.id DESC
      LIMIT 1
    `, [item.id]);

    if (!loanDetail) {
      return res.json({
        isBorrowed: false,
        item,
        loan: null
      });
    }

    // Get all items in this loan
    const details = db.query(`
      SELECT ld.*, i.item_code, i.name as item_name, i.category
      FROM loan_details ld
      JOIN items i ON i.id = ld.item_id
      WHERE ld.loan_id = ?
    `, [loanDetail.loan_id]);

    res.json({
      isBorrowed: true,
      item,
      loan: {
        id: loanDetail.loan_id,
        loan_date: loanDetail.loan_date,
        day_name: loanDetail.day_name,
        teacher_name: loanDetail.teacher_name,
        borrower_name: loanDetail.borrower_name,
        class_name: loanDetail.class_name,
        start_time: loanDetail.start_time,
        signature_base64: loanDetail.signature_base64,
        admin_name: loanDetail.admin_name,
        status: loanDetail.status,
        details
      }
    });
  });

  // Get Loans with details
  router.get('/loans', (req, res) => {
    const { status, date, category } = req.query;
    let sql = 'SELECT * FROM loans WHERE 1=1';
    const params = [];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (date) {
      sql += ' AND loan_date = ?';
      params.push(date);
    }
    sql += ' ORDER BY id DESC';

    const loans = db.query(sql, params);

    // Fetch details and items for each loan
    const enrichedLoans = loans.map(loan => {
      const details = db.query(`
        SELECT ld.*, i.item_code, i.name as item_name, i.category
        FROM loan_details ld
        JOIN items i ON i.id = ld.item_id
        WHERE ld.loan_id = ?
      `, [loan.id]);

      // Categorize items
      const projectorDetails = details.filter(d => d.category === 'PROYEKTOR');
      const toolDetails = details.filter(d => d.category === 'ALAT_BEBAS');

      return {
        ...loan,
        details,
        projectorDetails,
        toolDetails,
        hasProjector: projectorDetails.length > 0,
        hasTools: toolDetails.length > 0
      };
    });

    // Optional category filter
    let results = enrichedLoans;
    if (category === 'PROYEKTOR') {
      results = results.filter(l => l.hasProjector);
    } else if (category === 'ALAT_BEBAS') {
      results = results.filter(l => l.hasTools);
    }

    res.json(results);
  });

  // Create Loan (Scan 1: Peminjaman)
  router.post('/loans', (req, res) => {
    try {
      const {
        primaryItemCode,
        additionalItems = [], // [{ itemId, quantity }]
        teacherName,
        className,
        borrowerName,
        conditionBefore = 'BAIK',
        signatureBase64,
        adminName = 'Petugas Kajur'
      } = req.body;

      if (!primaryItemCode || !teacherName || !className || !borrowerName) {
        return res.status(400).json({ error: 'Lengkapi semua field penting peminjaman' });
      }

      // Check primary item
      const primaryItem = db.queryOne('SELECT * FROM items WHERE item_code = ?', [primaryItemCode.toUpperCase()]);
      if (!primaryItem) {
        return res.status(404).json({ error: `Barang ${primaryItemCode} tidak ditemukan` });
      }

      if (primaryItem.status === 'DIPINJAM') {
        return res.status(400).json({ error: `Barang ${primaryItem.name} (${primaryItem.item_code}) sedang dipinjam!` });
      }

      // Prepare date & time
      const now = new Date();
      const loanDate = formatDateDDMMYY(now);
      const dayName = getDayNameIndonesian(now);
      const startTime = formatTimeHHmm(now);

      // Create loan record
      const loanId = db.runWithId(`
        INSERT INTO loans (
          loan_date, day_name, teacher_name, borrower_name, class_name,
          start_time, signature_base64, admin_name, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DIPINJAM')
      `, [
        loanDate,
        dayName,
        teacherName.trim(),
        borrowerName.trim(),
        className.trim(),
        startTime,
        signatureBase64 || null,
        adminName.trim()
      ]);

      // Insert primary item detail
      db.run(`
        INSERT INTO loan_details (loan_id, item_id, quantity, condition_before, is_complete)
        VALUES (?, ?, 1, ?, 0)
      `, [loanId, primaryItem.id, conditionBefore]);

      // Update primary item status
      db.run("UPDATE items SET status = 'DIPINJAM' WHERE id = ?", [primaryItem.id]);

      // Insert additional items
      if (Array.isArray(additionalItems) && additionalItems.length > 0) {
        for (const add of additionalItems) {
          const item = db.queryOne('SELECT * FROM items WHERE id = ?', [add.itemId || add.id]);
          if (item) {
            db.run(`
              INSERT INTO loan_details (loan_id, item_id, quantity, condition_before, is_complete)
              VALUES (?, ?, ?, 'BAIK', 0)
            `, [loanId, item.id, add.quantity || 1]);

            db.run("UPDATE items SET status = 'DIPINJAM' WHERE id = ?", [item.id]);
          }
        }
      }

      // Fetch created loan for response
      const createdLoan = db.queryOne('SELECT * FROM loans WHERE id = ?', [loanId]);
      const details = db.query(`
        SELECT ld.*, i.item_code, i.name as item_name, i.category
        FROM loan_details ld
        JOIN items i ON i.id = ld.item_id
        WHERE ld.loan_id = ?
      `, [loanId]);

      const fullLoan = {
        ...createdLoan,
        details,
        projectorDetails: details.filter(d => d.category === 'PROYEKTOR'),
        toolDetails: details.filter(d => d.category === 'ALAT_BEBAS'),
        hasProjector: details.some(d => d.category === 'PROYEKTOR'),
        hasTools: details.some(d => d.category === 'ALAT_BEBAS')
      };

      // Real-time broadcast
      broadcast({
        type: 'LOAN_CREATED',
        message: `Peminjaman baru oleh ${borrowerName} (${className})`,
        loan: fullLoan
      });

      res.status(201).json(fullLoan);
    } catch (err) {
      console.error('Error creating loan:', err);
      res.status(500).json({ error: err.message || 'Gagal menyimpan peminjaman' });
    }
  });

  // Return Loan (Scan 2: Pengembalian)
  router.post('/loans/:id/return', (req, res) => {
    try {
      const loanId = parseInt(req.params.id, 10);
      const {
        conditionAfter = 'BAIK',
        isComplete = true,
        hasRemote = false,
        hasHdmi = false,
        hasPower = false,
        returnNotes = ''
      } = req.body;

      const loan = db.queryOne('SELECT * FROM loans WHERE id = ?', [loanId]);
      if (!loan) {
        return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });
      }

      if (loan.status === 'SELESAI') {
        return res.status(400).json({ error: 'Peminjaman ini sudah diselesaikan sebelumnya' });
      }

      const now = new Date();
      const endTime = formatTimeHHmm(now);

      // Update loan record
      db.run(`
        UPDATE loans
        SET status = 'SELESAI', end_time = ?, return_notes = ?
        WHERE id = ?
      `, [endTime, returnNotes || null, loanId]);

      // Update all loan details
      db.run(`
        UPDATE loan_details
        SET condition_after = ?, is_complete = ?, has_remote = ?, has_hdmi = ?, has_power = ?
        WHERE loan_id = ?
      `, [
        conditionAfter,
        isComplete ? 1 : 0,
        hasRemote ? 1 : 0,
        hasHdmi ? 1 : 0,
        hasPower ? 1 : 0,
        loanId
      ]);

      // Get items involved and set status to TERSEDIA (and update condition if damaged)
      const details = db.query('SELECT * FROM loan_details WHERE loan_id = ?', [loanId]);
      for (const d of details) {
        const cond = conditionAfter === 'RUSAK' ? 'RUSAK' : 'BAIK';
        db.run('UPDATE items SET status = \'TERSEDIA\', condition = ? WHERE id = ?', [cond, d.item_id]);
      }

      const updatedLoan = db.queryOne('SELECT * FROM loans WHERE id = ?', [loanId]);
      const updatedDetails = db.query(`
        SELECT ld.*, i.item_code, i.name as item_name, i.category
        FROM loan_details ld
        JOIN items i ON i.id = ld.item_id
        WHERE ld.loan_id = ?
      `, [loanId]);

      const fullLoan = {
        ...updatedLoan,
        details: updatedDetails,
        projectorDetails: updatedDetails.filter(d => d.category === 'PROYEKTOR'),
        toolDetails: updatedDetails.filter(d => d.category === 'ALAT_BEBAS'),
        hasProjector: updatedDetails.some(d => d.category === 'PROYEKTOR'),
        hasTools: updatedDetails.some(d => d.category === 'ALAT_BEBAS')
      };

      // Real-time broadcast
      broadcast({
        type: 'LOAN_RETURNED',
        message: `Pengembalian selesai: ${loan.borrower_name} (${loan.class_name})`,
        loan: fullLoan
      });

      res.json(fullLoan);
    } catch (err) {
      console.error('Error returning loan:', err);
      res.status(500).json({ error: err.message || 'Gagal menyelesaikan pengembalian' });
    }
  });

  return router;
}

module.exports = { createApiRouter };

