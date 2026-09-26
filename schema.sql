-- PackWise AI - Database Schema (MySQL 8.0+)
-- Intelligent Food Packaging Material Recommendation System
-- Smart India Hackathon Prototype

CREATE DATABASE IF NOT EXISTS packwise_db;
USE packwise_db;

-- 1. COMMODITIES TABLE
DROP TABLE IF EXISTS recommendation_scores;
DROP TABLE IF EXISTS recommendations;
DROP TABLE IF EXISTS compatibility_rules;
DROP TABLE IF EXISTS packaging_materials;
DROP TABLE IF EXISTS food_properties;
DROP TABLE IF EXISTS commodities;

CREATE TABLE commodities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    perishability ENUM('LOW', 'MEDIUM', 'HIGH', 'ULTRA_HIGH') NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. FOOD SCIENTIFIC PROPERTIES (Reference Knowledge Base)
CREATE TABLE food_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commodity_id INT NOT NULL,
    typical_ph_min DECIMAL(3,1) NOT NULL,
    typical_ph_max DECIMAL(3,1) NOT NULL,
    moisture_content_pct DECIMAL(4,1) NOT NULL,
    moisture_sensitivity ENUM('LOW', 'MODERATE', 'HIGH', 'CRITICAL') NOT NULL,
    respiration_rate ENUM('VERY_LOW', 'LOW', 'MODERATE', 'HIGH', 'EXTREMELY_HIGH') NOT NULL,
    mechanical_sensitivity ENUM('LOW', 'MODERATE', 'HIGH', 'VERY_HIGH') NOT NULL,
    chilling_sensitivity BOOLEAN DEFAULT FALSE,
    optimal_temp_min_c DECIMAL(4,1) NOT NULL,
    optimal_temp_max_c DECIMAL(4,1) NOT NULL,
    optimal_rh_min_pct INT NOT NULL,
    optimal_rh_max_pct INT NOT NULL,
    typical_shelf_life_days INT NOT NULL,
    ethylene_production ENUM('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH') DEFAULT 'LOW',
    key_deterioration_factors VARCHAR(255) NOT NULL,
    packaging_requirements TEXT NOT NULL,
    FOREIGN KEY (commodity_id) REFERENCES commodities(id) ON DELETE CASCADE
);

-- 3. PACKAGING MATERIALS TABLE
CREATE TABLE packaging_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    slug VARCHAR(120) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    moisture_barrier_rating INT NOT NULL COMMENT '1-100 scale',
    oxygen_barrier_rating INT NOT NULL COMMENT '1-100 scale',
    mechanical_protection_rating INT NOT NULL COMMENT '1-100 scale',
    thermal_insulation_rating INT NOT NULL COMMENT '1-100 scale',
    min_temp_c DECIMAL(4,1) NOT NULL,
    max_temp_c DECIMAL(4,1) NOT NULL,
    estimated_cost_inr_per_unit DECIMAL(6,2) NOT NULL,
    recyclability_rating INT NOT NULL COMMENT '1-100 scale',
    biodegradability_rating INT NOT NULL COMMENT '1-100 scale',
    sustainability_score INT NOT NULL COMMENT '1-100 composite',
    food_grade_certified BOOLEAN DEFAULT TRUE,
    compatible_categories VARCHAR(255) NOT NULL,
    primary_advantages TEXT NOT NULL,
    primary_limitations TEXT NOT NULL,
    specifications TEXT NOT NULL
);

-- 4. COMPATIBILITY & REGULATORY RULES
CREATE TABLE compatibility_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_code VARCHAR(50) NOT NULL UNIQUE,
    rule_name VARCHAR(150) NOT NULL,
    condition_description TEXT NOT NULL,
    target_material_slug VARCHAR(120),
    target_category VARCHAR(100),
    action_type ENUM('INCOMPATIBLE', 'PENALTY', 'BONUS') NOT NULL,
    score_adjustment INT DEFAULT 0,
    explanation_template TEXT NOT NULL
);

-- 5. RECOMMENDATIONS AUDIT / LOG
CREATE TABLE recommendations (
    id VARCHAR(64) PRIMARY KEY,
    commodity_id INT NOT NULL,
    source_city VARCHAR(100) NOT NULL,
    dest_city VARCHAR(100) NOT NULL,
    distance_km DECIMAL(7,1) NOT NULL,
    estimated_duration_hours DECIMAL(5,1) NOT NULL,
    storage_type VARCHAR(50) NOT NULL,
    storage_duration_days INT NOT NULL,
    target_shelf_life_days INT,
    transport_mode VARCHAR(50) NOT NULL,
    best_material_id INT NOT NULL,
    overall_score INT NOT NULL,
    is_what_if_simulation BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (commodity_id) REFERENCES commodities(id),
    FOREIGN KEY (best_material_id) REFERENCES packaging_materials(id)
);

-- 6. RECOMMENDATION MATERIAL BREAKDOWN SCORES
CREATE TABLE recommendation_scores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recommendation_id VARCHAR(64) NOT NULL,
    material_id INT NOT NULL,
    rank_order INT NOT NULL,
    compatibility_score DECIMAL(5,2) NOT NULL,
    protection_score DECIMAL(5,2) NOT NULL,
    condition_suitability DECIMAL(5,2) NOT NULL,
    cost_score DECIMAL(5,2) NOT NULL,
    sustainability_score DECIMAL(5,2) NOT NULL,
    overall_score DECIMAL(5,2) NOT NULL,
    pros_json JSON,
    cons_json JSON,
    FOREIGN KEY (recommendation_id) REFERENCES recommendations(id) ON DELETE CASCADE,
    FOREIGN KEY (material_id) REFERENCES packaging_materials(id)
);
