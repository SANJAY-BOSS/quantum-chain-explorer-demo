-- Drop the existing foreign key constraint
ALTER TABLE blockchain_audit DROP CONSTRAINT blockchain_audit_record_id_fkey;

-- Add the foreign key constraint with CASCADE DELETE
ALTER TABLE blockchain_audit ADD CONSTRAINT blockchain_audit_record_id_fkey 
FOREIGN KEY (record_id) REFERENCES data_records(id) ON DELETE CASCADE;