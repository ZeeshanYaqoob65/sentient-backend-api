-- Query to change uatid to AUTO_INCREMENT in user_attendance table
-- This will also ensure uatid is set as PRIMARY KEY if not already

-- Option 1: If uatid is already PRIMARY KEY, use this:
ALTER TABLE `user_attendance` 
MODIFY `uatid` int NOT NULL AUTO_INCREMENT;

-- Option 2: If uatid is NOT PRIMARY KEY yet, use this (uncomment if needed):
-- ALTER TABLE `user_attendance` 
-- MODIFY `uatid` int NOT NULL AUTO_INCREMENT,
-- ADD PRIMARY KEY (`uatid`);

-- Option 3: If another column is PRIMARY KEY and you need to change it:
-- First, drop existing primary key (if any):
-- ALTER TABLE `user_attendance` DROP PRIMARY KEY;
-- Then modify uatid:
-- ALTER TABLE `user_attendance` 
-- MODIFY `uatid` int NOT NULL AUTO_INCREMENT,
-- ADD PRIMARY KEY (`uatid`);

