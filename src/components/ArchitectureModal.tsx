import React, { useState } from 'react';
import { X, Database, Cpu, Layers, FileCode, Check } from 'lucide-react';
import { COMMODITIES, PACKAGING_MATERIALS } from '../../server/db/knowledgeBase.js';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'commodities' | 'packaging' | 'algorithm' | 'schema'>('commodities');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(`-- MySQL Schema DDL available in /schema.sql`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                PackWise AI Engineering & Knowledge Base Explorer
              </h2>
              <p className="text-xs text-slate-500">
                Relational MySQL Schema, Multi-Criteria Algorithm, and Commodity Benchmark Datasets.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('commodities')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'commodities'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            12 Validated Commodities
          </button>

          <button
            onClick={() => setActiveTab('packaging')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'packaging'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            12 Packaging Materials
          </button>

          <button
            onClick={() => setActiveTab('algorithm')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'algorithm'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            MCDA Decision Algorithm
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'schema'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            MySQL Schema & Spring Boot Architecture
          </button>
        </div>

        {/* Tab 1: Commodities */}
        {activeTab === 'commodities' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <p className="text-xs text-slate-500">
              Structured physiological reference standards stored in the knowledge base (retrieved upon visual recognition):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMMODITIES.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{c.name}</h4>
                    <span className="font-semibold text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                      {c.category}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-600 pt-1">
                    <div>pH: <strong>{c.properties.typicalPhMin}-{c.properties.typicalPhMax}</strong></div>
                    <div>Moisture: <strong>{c.properties.moistureContentPct}%</strong></div>
                    <div>Resp: <strong>{c.properties.respirationRate}</strong></div>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 pt-0.5">
                    <strong>Packaging:</strong> {c.properties.packagingRequirements}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Packaging Materials */}
        {activeTab === 'packaging' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <p className="text-xs text-slate-500">
              Technical barrier ratings, unit costs in ₹ INR, and recyclability scores:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PACKAGING_MATERIALS.map((m) => (
                <div key={m.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                    <span className="font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      ₹{m.estimatedCostInrPerUnit.toFixed(2)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-600 pt-1">
                    <div>Moist: <strong>{m.moistureBarrierRating}/100</strong></div>
                    <div>Oxygen: <strong>{m.oxygenBarrierRating}/100</strong></div>
                    <div>Mech: <strong>{m.mechanicalProtectionRating}/100</strong></div>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 pt-0.5">
                    {m.primaryAdvantages}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: MCDA Algorithm */}
        {activeTab === 'algorithm' && (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-1 text-xs text-slate-700">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
              <h4 className="font-bold text-emerald-950 text-sm">
                Multi-Criteria Decision Analysis (MCDA) Scoring Equation
              </h4>
              <p className="font-mono text-xs bg-white p-3 rounded-lg border border-emerald-300 text-emerald-900">
                Overall Score = (0.30 × Compatibility) + (0.25 × Protection) + (0.20 × Condition_Suitability) + (0.10 × Cost_Score) + (0.15 × Sustainability)
              </p>
            </div>

            <div className="space-y-2">
              <h5 className="font-bold text-slate-900">Execution Pipeline:</h5>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                <li><strong>Hard Incompatibility Gate:</strong> Disqualifies physics/chemical violations (e.g. liquid dairy in unlined paperboard, vacuum packaging on soft fruits).</li>
                <li><strong>Compatibility Engine (30%):</strong> Food moisture transpiration vs moisture barrier, respiration vs micro-perforations, contact pH stability.</li>
                <li><strong>Mechanical Protection (25%):</strong> Commodity bruising threshold vs packaging burst factor, compressive stiffness, road vibration dampening.</li>
                <li><strong>Condition Suitability (20%):</strong> Thermal delta between transit forecast (Open-Meteo) and commodity limits, rain/moisture barrier.</li>
                <li><strong>Unit Economics (10%):</strong> Inverted packaging cost curve (₹ INR / unit).</li>
                <li><strong>Sustainability Index (15%):</strong> Circular recyclability rating and industrial compostability.</li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 4: Schema */}
        {activeTab === 'schema' && (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                MySQL Relational Schema (available in /schema.sql & /data.sql)
              </span>
              <button
                onClick={handleCopySchema}
                className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'schema.sql'}</span>
              </button>
            </div>

            <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed">
{`-- Relational Tables in packwise_db:
CREATE TABLE commodities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(100) NOT NULL,
    perishability ENUM('LOW', 'MEDIUM', 'HIGH', 'ULTRA_HIGH') NOT NULL
);

CREATE TABLE food_properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commodity_id INT NOT NULL,
    typical_ph_min DECIMAL(3,1) NOT NULL,
    typical_ph_max DECIMAL(3,1) NOT NULL,
    moisture_content_pct DECIMAL(4,1) NOT NULL,
    respiration_rate ENUM('VERY_LOW','LOW','MODERATE','HIGH','EXTREMELY_HIGH'),
    mechanical_sensitivity ENUM('LOW','MODERATE','HIGH','VERY_HIGH'),
    optimal_temp_min_c DECIMAL(4,1),
    optimal_temp_max_c DECIMAL(4,1),
    FOREIGN KEY (commodity_id) REFERENCES commodities(id)
);

CREATE TABLE packaging_materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    moisture_barrier_rating INT NOT NULL,
    oxygen_barrier_rating INT NOT NULL,
    mechanical_protection_rating INT NOT NULL,
    estimated_cost_inr_per_unit DECIMAL(6,2),
    sustainability_score INT NOT NULL
);

CREATE TABLE recommendations (
    id VARCHAR(64) PRIMARY KEY,
    commodity_id INT NOT NULL,
    source_city VARCHAR(100),
    dest_city VARCHAR(100),
    distance_km DECIMAL(7,1),
    best_material_id INT NOT NULL,
    overall_score INT NOT NULL
);`}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
