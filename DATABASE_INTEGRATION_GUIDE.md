# Database Integration Guide for UPSOSB Bot

## Current Status: Mock Database (In-Memory)

Currently using a JavaScript object for demo/testing purposes.

### Demo Credentials (Share with users for testing):
```
📌 Registration Number: 12345
📅 Date of Birth: 01/01/2000
👤 Name: Rahul Kumar
📚 Class: 10
```

---

## Future: SQL Database Integration

### Option 1: MySQL/MariaDB

#### 1. Install MySQL Package
```bash
npm install mysql2
```

#### 2. Create Database Schema
```sql
CREATE DATABASE upsosb_db;

USE upsosb_db;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    class INT NOT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE student_subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(20),
    subject_name VARCHAR(100),
    FOREIGN KEY (registration_number) REFERENCES students(registration_number)
);

-- Insert demo data
INSERT INTO students (registration_number, name, class, dob) 
VALUES ('12345', 'Rahul Kumar', 10, '2000-01-01');

INSERT INTO student_subjects (registration_number, subject_name) VALUES
('12345', 'गणित'),
('12345', 'विज्ञान'),
('12345', 'सामाजिक विज्ञान');
```

#### 3. Update Bot Code

Replace the `studentDatabase` section in `telegram-bot-complete.js`:

```javascript
// At the top of file
const mysql = require('mysql2/promise');

// Database connection pool
const pool = mysql.createPool({
    host: 'localhost',           // या आपका database server
    user: 'upsosb_user',         // database username
    password: 'your_password',    // database password
    database: 'upsosb_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Replace studentDatabase object with this function
async function getStudentData(regNum, dobString) {
    try {
        // Convert DD/MM/YYYY to YYYY-MM-DD for SQL
        const [day, month, year] = dobString.split('/');
        const sqlDate = `${year}-${month}-${day}`;
        
        // Get student info
        const [students] = await pool.execute(
            'SELECT * FROM students WHERE registration_number = ? AND dob = ?',
            [regNum, sqlDate]
        );
        
        if (students.length === 0) {
            return null;
        }
        
        const student = students[0];
        
        // Get student subjects
        const [subjects] = await pool.execute(
            'SELECT subject_name FROM student_subjects WHERE registration_number = ?',
            [regNum]
        );
        
        return {
            name: student.name,
            class: student.class,
            dob: dobString,
            subjects: subjects.map(s => s.subject_name)
        };
    } catch (error) {
        console.error('Database error:', error);
        return null;
    }
}
```

#### 4. Update Login Handler

In the message handler where authentication happens:

```javascript
// Replace this line:
// if (studentDatabase[regNum]) {

// With this:
const studentExists = await getStudentData(regNum, '01/01/2000'); // temporary check
if (studentExists) {
    // ... rest of code
}

// And replace this:
// const studentData = studentDatabase[regNum];
// if (studentData && studentData.dob === dob) {

// With this:
const studentData = await getStudentData(regNum, dob);
if (studentData) {
    // Login successful
    // ... rest of code
}
```

---

### Option 2: MongoDB

#### 1. Install MongoDB Package
```bash
npm install mongodb
```

#### 2. Update Bot Code

```javascript
const { MongoClient } = require('mongodb');

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'upsosb_db';
let db;

// Connect to MongoDB
async function connectDB() {
    const client = await MongoClient.connect(mongoUrl);
    db = client.db(dbName);
    console.log('Connected to MongoDB');
}

// Call on bot start
connectDB();

// Get student data
async function getStudentData(regNum, dob) {
    try {
        const student = await db.collection('students').findOne({
            registration_number: regNum,
            dob: dob
        });
        
        return student;
    } catch (error) {
        console.error('MongoDB error:', error);
        return null;
    }
}
```

---

### Option 3: PostgreSQL

#### 1. Install Package
```bash
npm install pg
```

#### 2. Update Bot Code

```javascript
const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    user: 'upsosb_user',
    password: 'your_password',
    database: 'upsosb_db',
    port: 5432,
});

async function getStudentData(regNum, dob) {
    try {
        const result = await pool.query(
            'SELECT * FROM students WHERE registration_number = $1 AND dob = $2',
            [regNum, dob]
        );
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (error) {
        console.error('PostgreSQL error:', error);
        return null;
    }
}
```

---

## Important Notes

### Security Considerations:
1. **Never** store database credentials in code
2. Use environment variables:
   ```bash
   npm install dotenv
   ```
   
   Create `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=upsosb_user
   DB_PASSWORD=your_secure_password
   DB_NAME=upsosb_db
   ```
   
   In code:
   ```javascript
   require('dotenv').config();
   
   const pool = mysql.createPool({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME
   });
   ```

3. Add `.env` to `.gitignore`
4. Use prepared statements (already shown above) to prevent SQL injection
5. Hash passwords if storing user passwords (use bcrypt)

### Performance Tips:
- Use connection pooling (shown in examples)
- Add indexes on frequently queried columns (registration_number, dob)
- Consider caching frequently accessed data
- Use async/await for better error handling

### Migration Steps:
1. Keep mock database during testing
2. Set up real database on server
3. Import existing student data (if any)
4. Test database queries thoroughly
5. Update bot code gradually
6. Deploy with database connection
7. Monitor for errors

---

## Current Testing Workflow

**For now, share these credentials with users:**

```
🧪 Testing Account:
━━━━━━━━━━━━━━━━━━━
📌 Registration: 12345
📅 DOB: 01/01/2000
👤 Name: Rahul Kumar
📚 Class: 10
━━━━━━━━━━━━━━━━━━━

Users ko ye details dein for testing!
```

---

## Questions?

Contact: Your Tech Team
Last Updated: December 13, 2025
