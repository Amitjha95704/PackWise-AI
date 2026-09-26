-- PackWise AI - Seed Knowledge Base Data (data.sql)
-- Complete domain data for Food Commodities & Packaging Materials

USE packwise_db;

-- 1. COMMODITIES
INSERT INTO commodities (id, name, slug, category, perishability, description) VALUES
(1, 'Tomato', 'tomato', 'Fresh Produce', 'HIGH', 'Solanaceous berry fruit, climacteric, sensitive to physical bruising and chilling below 10°C.'),
(2, 'Potato', 'potato', 'Root Vegetables', 'LOW', 'Starchy tuber, low respiration when cured, requires dark ventilated storage to prevent solanine greening.'),
(3, 'Apple', 'apple', 'Fresh Produce', 'MEDIUM', 'Pome fruit with moderate respiration, high ethylene sensitivity and skin scuffing vulnerability.'),
(4, 'Banana', 'banana', 'Fresh Produce', 'HIGH', 'Tropical climacteric fruit, rapid ripening, highly chilling sensitive (damages below 13°C), prone to abrasion.'),
(5, 'Mango', 'mango', 'Fresh Produce', 'HIGH', 'Tropical stone fruit, ethylene-driven ripening, high moisture transpiration and fungal vulnerability.'),
(6, 'Onion', 'onion', 'Bulb Vegetables', 'LOW', 'Bulb crop requiring dry, highly ventilated conditions to prevent root emergence and neck rot.'),
(7, 'Leafy Vegetables', 'leafy-vegetables', 'Fresh Produce', 'ULTRA_HIGH', 'Spinach, coriander, fenugreek; extreme transpiration rate, wilting vulnerability, rapid chlorophyll loss.'),
(8, 'Milk', 'milk', 'Dairy Products', 'ULTRA_HIGH', 'Liquid emulsion, high microbial risk, photolytic nutrient degradation, strict cold-chain requirement.'),
(9, 'Bread', 'bread', 'Bakery Products', 'HIGH', 'Starch retrogradation (staling), mold sporing susceptibility, requires moisture equilibrium barrier.'),
(10, 'Biscuits', 'biscuits', 'Dry Packaged Food', 'LOW', 'Crisp baked flour product with very low moisture (2-4%), highly hygroscopic, vulnerable to sogginess and rancidity.'),
(11, 'Rice', 'rice', 'Grains & Pulses', 'LOW', 'Staple grain, requires insect, moisture, and mold prevention during long-term transport.'),
(12, 'Wheat', 'wheat', 'Grains & Pulses', 'LOW', 'Cereal grain prone to moisture absorption, weevil infestation, and fungal mycotoxins if wet.');

-- 2. FOOD SCIENTIFIC PROPERTIES (Reference Knowledge Base)
INSERT INTO food_properties (
    commodity_id, typical_ph_min, typical_ph_max, moisture_content_pct, moisture_sensitivity,
    respiration_rate, mechanical_sensitivity, chilling_sensitivity, optimal_temp_min_c, optimal_temp_max_c,
    optimal_rh_min_pct, optimal_rh_max_pct, typical_shelf_life_days, ethylene_production,
    key_deterioration_factors, packaging_requirements
) VALUES
(1, 4.3, 4.9, 94.0, 'HIGH', 'HIGH', 'HIGH', TRUE, 12.0, 15.0, 85, 90, 10, 'HIGH', 'Compression bruising, chilling injury, mold (Botrytis)', 'Ventilated cushioned trays, corrugated cartons with dividers, perforated films.'),
(2, 5.4, 6.0, 79.0, 'MODERATE', 'VERY_LOW', 'MODERATE', FALSE, 7.0, 10.0, 85, 90, 60, 'VERY_LOW', 'Sprouting, greening (light exposure), condensation rotting', 'Mesh leno bags, breathable paper sacks, light-blocking ventilated crates.'),
(3, 3.3, 4.0, 84.0, 'MODERATE', 'MODERATE', 'MODERATE', FALSE, 0.0, 4.0, 90, 95, 30, 'HIGH', 'Bruising, moisture loss, physiological internal browning', 'Molded fiber trays inside telescopic corrugated boxes, micro-perforated liners.'),
(4, 4.5, 5.2, 75.0, 'HIGH', 'HIGH', 'VERY_HIGH', TRUE, 13.0, 14.5, 90, 95, 7, 'HIGH', 'Peel scarring, rapid softening, chilling injury below 13°C', 'Kraft cartons with polyethylene bag liners, cluster cushioning pads.'),
(5, 3.8, 4.5, 83.0, 'HIGH', 'HIGH', 'HIGH', TRUE, 11.0, 13.0, 85, 90, 12, 'HIGH', 'Sapburn, fruit fly, anthracnose, mechanical softening', 'Cell-pack corrugated containers, foam sleeves, ventilated export cartons.'),
(6, 5.3, 5.8, 86.0, 'CRITICAL', 'VERY_LOW', 'LOW', FALSE, 0.0, 4.0, 65, 70, 90, 'VERY_LOW', 'High humidity rotting, sprouting, skin slipping', 'Open-mesh polypropylene or jute bags with maximum airflow, no moisture-trapping films.'),
(7, 5.5, 6.8, 92.0, 'CRITICAL', 'EXTREMELY_HIGH', 'VERY_HIGH', FALSE, 0.0, 2.0, 95, 98, 4, 'LOW', 'Wilting, yellowing, tissue collapse, microbial slime', 'Perforated polybags, MAP trays with controlled O2/CO2 transmission, ice-packs.'),
(8, 6.5, 6.7, 87.5, 'CRITICAL', 'VERY_LOW', 'HIGH', FALSE, 2.0, 4.0, 70, 80, 5, 'VERY_LOW', 'Lactic bacterial acidification, lipid oxidation, light off-flavor', 'Hermetic aseptic liquid cartons, multi-layer HDPE/LDPE pouches with UV barrier.'),
(9, 5.0, 5.8, 38.0, 'HIGH', 'LOW', 'HIGH', FALSE, 18.0, 24.0, 50, 60, 5, 'VERY_LOW', 'Crust sogginess or hardening, mold growth (Aspergillus)', 'Wax-coated paperboard, micro-perforated LDPE or oriented PP bags.'),
(10, 6.0, 7.0, 3.0, 'CRITICAL', 'VERY_LOW', 'VERY_HIGH', FALSE, 15.0, 25.0, 30, 45, 180, 'VERY_LOW', 'Moisture uptake (loss of crunch), lipid rancidity, breakage', 'Metallized biaxially-oriented PP (BOPP/Met-PET) pouches, corrugated shipping outers.'),
(11, 6.0, 6.8, 12.0, 'HIGH', 'VERY_LOW', 'LOW', FALSE, 15.0, 22.0, 50, 65, 365, 'VERY_LOW', 'Grain weevils, mold if RH > 70%, moisture migration', 'Multiwall paper sacks, woven polypropylene (WPP) bags, vacuum-sealed barrier bags.'),
(12, 6.0, 6.5, 11.5, 'HIGH', 'VERY_LOW', 'LOW', FALSE, 15.0, 22.0, 50, 65, 365, 'VERY_LOW', 'Moisture condensation, insect infestation, odor absorption', 'High-density woven polypropylene sacks or hermetic grain storage liners.');

-- 3. PACKAGING MATERIALS
INSERT INTO packaging_materials (
    id, name, slug, category, moisture_barrier_rating, oxygen_barrier_rating, mechanical_protection_rating,
    thermal_insulation_rating, min_temp_c, max_temp_c, estimated_cost_inr_per_unit, recyclability_rating,
    biodegradability_rating, sustainability_score, food_grade_certified, compatible_categories,
    primary_advantages, primary_limitations, specifications
) VALUES
(1, 'Corrugated Fiberboard', 'corrugated-fiberboard', 'Paper & Board', 45, 20, 88, 65, -15.0, 50.0, 18.50, 95, 88, 92, TRUE, 'Fresh Produce, Bakery Products, Dry Packaged Food, Grains & Pulses', 'Superb stacking strength, shock absorption, biodegradable, high recyclability, custom printing.', 'Weak barrier against standing liquid or high humidity unless wax/resin coated.', '3-ply or 5-ply fluted kraft paperboard (B/C flute), burst factor 16-24.'),
(2, 'Plastic Tray (PET/RPET)', 'plastic-tray', 'Rigid Plastic', 80, 65, 78, 30, -20.0, 60.0, 12.00, 82, 10, 55, TRUE, 'Fresh Produce, Bakery Products', 'High clarity for visual inspection, rigid structure protects soft fruits from crushing, stackable.', 'Non-biodegradable; requires organized municipal sorting for circular recycling.', 'Thermoformed 350-500 micron virgin or food-grade recycled PET with venting slots.'),
(3, 'Polyethylene Terephthalate (PET)', 'pet', 'Rigid Plastic', 88, 76, 82, 35, -20.0, 65.0, 14.50, 88, 5, 58, TRUE, 'Dairy Products, Beverages, Dry Packaged Food', 'High tensile strength, good aroma barrier, transparent, shatter-proof alternative to glass.', 'Lower thermal resistance than glass; single-use plastic regulatory scrutiny.', 'Biaxially oriented bottle or jar grade PET, density 1.38 g/cm³, OTR 50 cc/m²/day.'),
(4, 'High-Density Polyethylene (HDPE)', 'hdpe', 'Rigid/Flexible Plastic', 92, 40, 85, 45, -40.0, 80.0, 9.80, 85, 10, 60, TRUE, 'Dairy Products, Fresh Produce, Grains & Pulses', 'Excellent moisture and chemical resistance, high stiffness-to-density ratio, impact resistant.', 'Poor oxygen gas barrier; translucent rather than crystal clear.', 'Extruded bottle or crate grade HDPE, density 0.95 g/cm³, WVTR 3-5 g/m²/day.'),
(5, 'Low-Density Polyethylene (LDPE)', 'ldpe', 'Flexible Film', 84, 25, 45, 20, -50.0, 65.0, 4.20, 75, 10, 52, TRUE, 'Fresh Produce, Bakery Products, Grains & Pulses', 'Highly flexible, great heat-sealability, cost-effective moisture barrier, waterproof.', 'Very low gas barrier (high oxygen transmission), prone to stretching under heavy loads.', 'Blown film 25-75 microns, OTR > 2000 cc/m²/day, suitable for liners and bread bags.'),
(6, 'Polypropylene (PP)', 'pp', 'Rigid/Woven Plastic', 90, 48, 86, 50, -10.0, 105.0, 8.50, 80, 10, 58, TRUE, 'Fresh Produce, Dry Packaged Food, Grains & Pulses', 'High melting point, microwaveable, resistant to flex fatigue, woven mesh allows maximum breathing.', 'Poor low-temperature impact strength (brittle below freezing).', 'Oriented or woven PP, high tensile mesh or injection-molded reusable crates.'),
(7, 'Glass Container', 'glass', 'Rigid Glass', 100, 100, 68, 40, -30.0, 180.0, 28.00, 95, 0, 72, TRUE, 'Dairy Products, Preserved Foods, Beverages', 'Absolute 100% impermeable barrier to moisture, gases, and odors; chemically inert; infinitely recyclable.', 'Heavy tare weight increases shipping emissions, brittle and prone to catastrophic shattering.', 'Type III soda-lime silicate glass, annealed to resist thermal shock up to 42°C delta.'),
(8, 'Aluminum Foil / Barrier Laminate', 'aluminum', 'Metal / Flexible Laminate', 100, 100, 75, 55, -40.0, 120.0, 22.00, 90, 0, 68, TRUE, 'Dry Packaged Food, Dairy Products, Beverages', 'Zero permeability to light, oxygen, moisture, and microbes; extended ambient shelf life.', 'Pinhole vulnerability if creased repeatedly; high primary smelting carbon footprint.', 'Tri-laminate PET/Alu/PE (12µm / 7µm / 50µm), WVTR < 0.01 g/m²/day, OTR < 0.01 cc/m²/day.'),
(9, 'Paperboard / Folding Carton', 'paperboard', 'Paper & Board', 50, 25, 65, 45, -10.0, 70.0, 7.50, 92, 90, 90, TRUE, 'Bakery Products, Dry Packaged Food', 'Renewable wood pulp base, compostable, flat-packing transport efficiency, high print surface.', 'Low moisture resistance without lining; limited heavy-load compressive strength.', 'Solid bleached sulfate (SBS) or folding boxboard (FBB) 250-400 gsm.'),
(10, 'Compostable Packaging (PLA/PBAT)', 'compostable-packaging', 'Bio-based Plastic', 70, 55, 68, 35, -10.0, 45.0, 24.00, 40, 98, 88, TRUE, 'Fresh Produce, Bakery Products, Dry Packaged Food', 'Certified industrially biodegradable (EN 13432), plant-derived (cornstarch/sugarcane), zero microplastics.', 'Lower thermal tolerance (< 45°C), higher unit price, requires commercial composting stream.', 'Bio-polymer film blend PLA/PBAT 30-50 micron, composts within 90-180 days.'),
(11, 'Modified Atmosphere Packaging (MAP)', 'map', 'Specialized Barrier System', 92, 88, 80, 50, -15.0, 50.0, 26.50, 60, 20, 62, TRUE, 'Fresh Produce, Dairy Products, Bakery Products', 'Tailored gas blend (N2/CO2/O2) doubles or triples shelf-life, retards microbial spoilage.', 'Requires specialized gas-flushing machinery; puncture voids the protective atmosphere.', 'EVOH high-barrier multi-layer tray with anti-fog heat-sealable top barrier film.'),
(12, 'Vacuum Packaging', 'vacuum-packaging', 'Specialized Barrier System', 95, 96, 72, 35, -25.0, 60.0, 19.00, 65, 15, 64, TRUE, 'Dry Packaged Food, Grains & Pulses', 'Total oxygen evacuation prevents lipid oxidation, insect hatching, and volumetric bulk.', 'Tight cling can crush soft fruits/berries or damage delicate bakery crusts.', 'Coextruded PA/PE multi-layer pouches (20µm Polyamide / 70µm Polyethylene).');

-- 4. COMPATIBILITY & REGULATORY RULES
INSERT INTO compatibility_rules (rule_code, rule_name, condition_description, target_material_slug, target_category, action_type, score_adjustment, explanation_template) VALUES
('RULE_MILK_PAPER_UNLINED', 'Liquid Dairy in Unlined Paper', 'Liquid milk requires aseptic barrier or liquid-tight pouch', 'paperboard', 'Dairy Products', 'INCOMPATIBLE', -100, 'Unlined paperboard absorbs liquid instantly, leading to carton collapse and spoilage.'),
('RULE_MOIST_CRITICAL_CORR', 'Critical Moisture on Unlined Corrugated', 'Commodity with critical moisture sensitivity exposed to high RH', 'corrugated-fiberboard', 'Fresh Produce', 'PENALTY', -25, 'Unlined corrugated fiberboard softens under high ambient moisture, compromising stacking strength.'),
('RULE_VACUUM_SOFT_FRUIT', 'Vacuum Packaging on Soft Fruit', 'Soft climacteric fruit placed under vacuum', 'vacuum-packaging', 'Fresh Produce', 'INCOMPATIBLE', -90, 'Vacuum packaging applies atmospheric crush pressure that destroys soft fruit cell integrity.'),
('RULE_ONION_AIRFLOW', 'Low Airflow Packaging for Onions', 'Onions packaged in hermetic non-breathable barrier', 'vacuum-packaging', 'Bulb Vegetables', 'INCOMPATIBLE', -100, 'Onions require continuous airflow; sealing in low-oxygen bags triggers anaerobic fermentation and neck rot.'),
('RULE_BISCUIT_HIGH_BARRIER', 'Moisture Barrier Requirement for Biscuits', 'Hygroscopic biscuits in poor moisture barrier', 'ldpe', 'Dry Packaged Food', 'PENALTY', -35, 'LDPE has high moisture vapor transmission for ultra-crisp biscuits, risking soggy texture within days.'),
('RULE_ROAD_SHOCK_ABSORPTION', 'Road Transit Mechanical Cushioning', 'Fragile produce in long road transit requires high mechanical protection', 'corrugated-fiberboard', 'Fresh Produce', 'BONUS', 15, 'Corrugated fluting acts as natural shock-absorbing suspension during road vibration and transit jolts.'),
('RULE_SUSTAINABILITY_PREFERENCE', 'Compostable for Organic Produce', 'High sustainability eco-credentials for fresh organic harvest', 'compostable-packaging', 'Fresh Produce', 'BONUS', 12, 'Compostable biopolymers align with consumer circularity and zero-plastic retail requirements.');
