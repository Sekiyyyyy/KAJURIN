const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_FILE = path.join(__dirname, '..', 'kajurin.db');

let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;

  const SQL = await initSqlJs();
  let db;

  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Helper to persist to file
  const save = () => {
    try {
      const data = db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(DB_FILE, buffer);
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  };

  // Helper to run query returning array of objects
  const query = (sql, params = []) => {
    const stmt = db.prepare(sql);
    if (params && params.length > 0) {
      stmt.bind(params);
    }
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  };

  const queryOne = (sql, params = []) => {
    const results = query(sql, params);
    return results.length > 0 ? results[0] : null;
  };

  const run = (sql, params = []) => {
    db.run(sql, params);
    save();
  };

  const runWithId = (sql, params = []) => {
    db.run(sql, params);
    const row = queryOne('SELECT last_insert_rowid() as id');
    save();
    return row ? row.id : null;
  };

  // Initialize tables
  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('PROYEKTOR', 'ALAT_BEBAS')),
      condition TEXT NOT NULL DEFAULT 'BAIK' CHECK(condition IN ('BAIK', 'RUSAK')),
      status TEXT NOT NULL DEFAULT 'TERSEDIA' CHECK(status IN ('TERSEDIA', 'DIPINJAM')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_date TEXT NOT NULL,
      day_name TEXT NOT NULL,
      teacher_name TEXT NOT NULL,
      borrower_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      signature_base64 TEXT,
      admin_name TEXT DEFAULT 'Petugas Kajur',
      status TEXT NOT NULL DEFAULT 'DIPINJAM' CHECK(status IN ('DIPINJAM', 'SELESAI')),
      return_notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS loan_details (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      loan_id INTEGER NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
      item_id INTEGER NOT NULL REFERENCES items(id),
      quantity INTEGER NOT NULL DEFAULT 1,
      condition_before TEXT NOT NULL DEFAULT 'BAIK',
      condition_after TEXT,
      is_complete INTEGER NOT NULL DEFAULT 0,
      has_remote INTEGER DEFAULT 0,
      has_hdmi INTEGER DEFAULT 0,
      has_power INTEGER DEFAULT 0
    );
  `);

  // Check if initial items exist, if not seed defaults
  const itemCount = queryOne('SELECT count(*) as count FROM items');
  if (!itemCount || itemCount.count === 0) {
    console.log('Seeding initial data for KAJURIN...');

    // Master Items
    const defaultItems = [
      ['INF-01', 'Proyektor Epson EB-X400 (Utama)', 'PROYEKTOR', 'BAIK', 'TERSEDIA'],
      ['INF-02', 'Proyektor BenQ MX535 (Cadangan 1)', 'PROYEKTOR', 'BAIK', 'TERSEDIA'],
      ['INF-03', 'Proyektor InFocus IN112x', 'PROYEKTOR', 'BAIK', 'TERSEDIA'],
      ['COK-01', 'Cok Sambung 5M (A)', 'ALAT_BEBAS', 'BAIK', 'TERSEDIA'],
      ['COK-02', 'Cok Sambung 10M (B)', 'ALAT_BEBAS', 'BAIK', 'TERSEDIA'],
      ['COK-03', 'Cok Sambung Gulung 15M', 'ALAT_BEBAS', 'BAIK', 'TERSEDIA'],
      ['KBL-01', 'Kabel HDMI 10 Meter (Hitam)', 'ALAT_BEBAS', 'BAIK', 'TERSEDIA'],
      ['KBL-02', 'Kabel VGA to HDMI Converter', 'ALAT_BEBAS', 'BAIK', 'TERSEDIA'],
      ['SPK-01', 'Speaker Portable Wireless Advance', 'ALAT_BEBAS', 'BAIK', 'TERSEDIA'],
      ['MIC-01', 'Mic Wireless Clip-On + Receiver', 'ALAT_BEBAS', 'BAIK', 'TERSEDIA'],
      ['PTR-01', 'Laser Pointer Logitech Wireless', 'ALAT_BEBAS', 'BAIK', 'TERSEDIA']
    ];

    for (const item of defaultItems) {
      db.run('INSERT INTO items (item_code, name, category, condition, status) VALUES (?, ?, ?, ?, ?)', item);
    }

    // Master Teachers
    const defaultTeachers = [
      'Buk Widya',
      'Buk Yuli',
      'Pak Ican',
      'Bunda',
      'Pak Dani',
      'Buk Rina',
      'Pak Hendra',
      'Buk Maya'
    ];
    for (const teacher of defaultTeachers) {
      db.run('INSERT INTO teachers (name) VALUES (?)', [teacher]);
    }

    // Master Classes
    const defaultClasses = [
      'X TJKT 1',
      'X TJKT 2',
      'XI TJKT 1',
      'XI TJKT 2',
      'XII TJKT 1',
      'XII TJKT 2',
      'X PPLG 1',
      'XI PPLG 1'
    ];
    for (const cls of defaultClasses) {
      db.run('INSERT INTO classes (name) VALUES (?)', [cls]);
    }

    save();
    console.log('Seeding completed successfully!');
  }

  dbInstance = {
    db,
    save,
    query,
    queryOne,
    run,
    runWithId
  };

  return dbInstance;
}

module.exports = { getDb };

