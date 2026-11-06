const { getDb } = require('./db');

// Sample Base64 digital signature PNG for initial display
const SAMPLE_SIGNATURE_1 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"><path d="M 20 50 Q 50 10, 80 45 T 140 30 Q 170 20, 180 60" fill="none" stroke="%231e293b" stroke-width="3" stroke-linecap="round"/></svg>';
const SAMPLE_SIGNATURE_2 = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="80" viewBox="0 0 200 80"><path d="M 30 40 Q 60 70, 90 20 T 150 50 Q 180 30, 170 65" fill="none" stroke="%231e293b" stroke-width="3" stroke-linecap="round"/></svg>';

async function seedSampleLoans(force = false) {
  const db = await getDb();
  
  if (force) {
    db.run('DELETE FROM loan_details');
    db.run('DELETE FROM loans');
    db.run("UPDATE items SET status = 'TERSEDIA', condition = 'BAIK'");
    db.save();
  } else {
    const existingLoans = db.query('SELECT count(*) as count FROM loans');
    if (existingLoans[0].count > 0) {
      console.log('Database already has loans, skipping sample loan seeding.');
      return;
    }
  }

  console.log('Seeding initial realistic loan transactions...');

  // 1. Transaction 1: Active Loan (DIPINJAM) - Infocus EB-X400 (INF-01) + Cok Sambung 5M (COK-01)
  const loan1Id = db.runWithId(`
    INSERT INTO loans (
      loan_date, day_name, teacher_name, borrower_name, class_name,
      start_time, signature_base64, admin_name, status
    ) VALUES ('06-11-26', 'Jumat', 'Pak Ican', 'Azi', 'XII TJKT 1', '08:15', ?, 'Petugas Kajur', 'DIPINJAM')
  `, [SAMPLE_SIGNATURE_1]);

  db.run(`
    INSERT INTO loan_details (loan_id, item_id, quantity, condition_before, is_complete)
    VALUES (?, 1, 1, 'BAIK', 0)
  `, [loan1Id]);

  db.run(`
    INSERT INTO loan_details (loan_id, item_id, quantity, condition_before, is_complete)
    VALUES (?, 4, 1, 'BAIK', 0)
  `, [loan1Id]);

  db.run("UPDATE items SET status = 'DIPINJAM' WHERE id IN (1, 4)");

  // 2. Transaction 2: Completed Loan (SELESAI) - Infocus IN112x (INF-03)
  const loan2Id = db.runWithId(`
    INSERT INTO loans (
      loan_date, day_name, teacher_name, borrower_name, class_name,
      start_time, end_time, signature_base64, admin_name, status, return_notes
    ) VALUES ('06-11-26', 'Jumat', 'Buk Widya', 'Loby', 'XI TJKT 2', '07:00', '08:45', ?, 'Petugas Kajur', 'SELESAI', 'Dikembalikan lengkap dengan remote dan kabel HDMI')
  `, [SAMPLE_SIGNATURE_2]);

  db.run(`
    INSERT INTO loan_details (loan_id, item_id, quantity, condition_before, condition_after, is_complete, has_remote, has_hdmi, has_power)
    VALUES (?, 3, 1, 'BAIK', 'BAIK', 1, 1, 1, 1)
  `, [loan2Id]);

  db.save();
  console.log('Sample loans seeded successfully!');
}

if (require.main === module) {
  seedSampleLoans(true);
}

module.exports = { seedSampleLoans };
