ALTER TABLE returns
ADD CONSTRAINT fk_returns_loans
FOREIGN KEY (loan_id) REFERENCES loans(loan_id)
ON DELETE CASCADE;
