-- Migration: Make description field optional in expenses table
ALTER TABLE expenses MODIFY COLUMN description VARCHAR(255);
