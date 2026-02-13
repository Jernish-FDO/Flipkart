-- Initialize FlipKart Clone Database
-- This script runs on first container startup

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas for multi-schema support
CREATE SCHEMA IF NOT EXISTS base;
CREATE SCHEMA IF NOT EXISTS shop;

-- Grant permissions
GRANT ALL ON SCHEMA base TO postgres;
GRANT ALL ON SCHEMA shop TO postgres;

-- Set default search path
ALTER DATABASE flipkart_dev SET search_path TO base, shop, public;

-- Log initialization
DO $$
BEGIN
    RAISE NOTICE 'FlipKart Clone Database initialized successfully!';
    RAISE NOTICE 'Extensions: uuid-ossp, pgcrypto';
    RAISE NOTICE 'Schemas: base, shop';
END $$;
