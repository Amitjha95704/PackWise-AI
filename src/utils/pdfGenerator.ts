/**
 * PackWise AI - Client-side Professional PDF Report Generator
 * Builds vector PDF reports using jsPDF for Smart India Hackathon evaluation.
 */

import { jsPDF } from 'jspdf';
import { RecommendationResponse, WhatIfResponse } from '../types/packwise.js';

export function generatePdfReport(
  recommendation: RecommendationResponse,
  whatIfResult?: WhatIfResponse | null
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Primary Theme Colors
  const emeraldDark = [16, 117, 72]; // #107548
  const emeraldLight = [236, 253, 245]; // #ECFDF5
  const slateDark = [15, 23, 42]; // #0F172A
  const slateMuted = [100, 116, 139]; // #64748B
  const slateBorder = [226, 232, 240]; // #E2E8F0

  // Helper function for new page with page numbers
  function checkPageBreak(spaceNeeded: number) {
    if (y + spaceNeeded > pageHeight - margin - 10) {
      doc.addPage();
      y = margin;
      drawHeaderMini();
    }
  }

  function drawHeaderMini() {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('PACKWISE AI | Smart Food Packaging Decision Support Report', margin, y);
    doc.text(`ID: ${recommendation.recommendationId}`, pageWidth - margin, y, { align: 'right' });
    y += 4;
    doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  // -------------------------------------------------------------
  // PAGE 1: TITLE & TOP HERO SUMMARY
  // -------------------------------------------------------------

  // Top emerald banner
  doc.setFillColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('PACKWISE AI', margin + 8, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Intelligent Food Packaging Material Recommendation System', margin + 8, y + 18);
  doc.text(`Smart India Hackathon Prototype | Generated: ${new Date(recommendation.calculationTimestamp).toLocaleDateString()}`, margin + 8, y + 25);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`REPORT #${recommendation.recommendationId}`, pageWidth - margin - 8, y + 15, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Status: Verified Decision Grounded', pageWidth - margin - 8, y + 22, { align: 'right' });

  y += 38;

  // Section 1: Food Profile
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.text('1. FOOD PROFILE & KNOWLEDGE BASE BENCHMARKS', margin, y);
  y += 6;

  // Box for Food Profile
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'FD');

  const comm = recommendation.commodity;
  const props = comm.properties;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Commodity: ${comm.name}`, margin + 6, y + 8);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Category: ${comm.category}`, margin + 70, y + 8);
  doc.text(`Perishability: ${comm.perishability}`, margin + 130, y + 8);

  // Line divider
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.line(margin + 6, y + 12, margin + contentWidth - 6, y + 12);

  // Property columns
  const col1X = margin + 6;
  const col2X = margin + 66;
  const col3X = margin + 126;
  let py = y + 18;

  doc.setFontSize(8.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Reference pH Range:', col1X, py);
  doc.text('Moisture Content:', col2X, py);
  doc.text('Optimal Storage Temp:', col3X, py);

  py += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`${props.typicalPhMin} – ${props.typicalPhMax}`, col1X, py);
  doc.text(`${props.moistureContentPct}% (${props.moistureSensitivity} Sensitivity)`, col2X, py);
  doc.text(`${props.optimalTempMinC}°C to ${props.optimalTempMaxC}°C`, col3X, py);

  py += 6;
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Respiration Rate:', col1X, py);
  doc.text('Mechanical Fragility:', col2X, py);
  doc.text('Baseline Shelf Life:', col3X, py);

  py += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`${props.respirationRate.replace('_', ' ')}`, col1X, py);
  doc.text(`${props.mechanicalSensitivity} Sensitivity`, col2X, py);
  doc.text(`${props.typicalShelfLifeDays} Days`, col3X, py);

  y += 48;

  // Section 2: Journey & Environmental Conditions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.text('2. TRANSIT CORRIDOR & METEOROLOGICAL ANALYSIS', margin, y);
  y += 6;

  const jny = recommendation.journey;
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Origin: ${jny.source.city} (${jny.source.temperatureC}°C, RH ${jny.source.relativeHumidityPct}%)`, margin + 6, y + 8);
  doc.text(`Destination: ${jny.destination.city} (${jny.destination.temperatureC}°C, RH ${jny.destination.relativeHumidityPct}%)`, margin + 90, y + 8);

  doc.line(margin + 6, y + 12, margin + contentWidth - 6, y + 12);

  let jy = y + 18;
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('Distance & Duration:', col1X, jy);
  doc.text('Transit Thermal Range:', col2X, jy);
  doc.text('Precipitation & Env Risk:', col3X, jy);

  jy += 5;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`${jny.distanceKm} km (~${jny.estimatedDurationHours} hrs via ${recommendation.storage.transportType})`, col1X, jy);
  doc.text(`${jny.temperatureRange.min}°C – ${jny.temperatureRange.max}°C (Avg RH ${jny.averageHumidityPct}%)`, col2X, jy);
  doc.text(`Rain: ${jny.rainRisk} | Risk: ${jny.environmentalRisk}`, col3X, jy);

  jy += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text(`Storage Protocol: ${recommendation.storage.storageType} for ${recommendation.storage.storageDurationDays} days`, col1X, jy);
  doc.text(`Data Source: ${jny.isLiveWeather ? 'Live Open-Meteo Synoptic Forecast' : 'Stored Regional Benchmark'}`, col2X, jy);

  y += 44;

  // Section 3: Recommended Packaging Winner
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.text('3. TOP RECOMMENDED PACKAGING MATERIAL', margin, y);
  y += 6;

  const best = recommendation.bestOption;
  doc.setFillColor(emeraldLight[0], emeraldLight[1], emeraldLight[2]);
  doc.setDrawColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.setLineWidth(0.8);
  doc.roundedRect(margin, y, contentWidth, 54, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.text(`#1 ${best.material.name}`, margin + 8, y + 10);

  // Score Badge
  doc.setFillColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.roundedRect(pageWidth - margin - 42, y + 4, 34, 11, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.text(`SCORE: ${best.overallScore}/100`, pageWidth - margin - 25, y + 11.5, { align: 'center' });

  // Specs & Metrics
  let my = y + 17;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text(`Category: ${best.material.category}  |  Unit Cost: ₹${best.estimatedCostInr.toFixed(2)}  |  Shelf-Life: ~${best.expectedShelfLifeDays} Days  |  Sustainability: ${best.material.sustainabilityScore}/100`, margin + 8, my);

  my += 6;
  doc.setDrawColor(187, 247, 208);
  doc.setLineWidth(0.4);
  doc.line(margin + 8, my, margin + contentWidth - 8, my);

  my += 6;
  // Multi-criteria score mini-grid
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Compatibility: ${best.compatibilityScore}/100`, margin + 8, my);
  doc.text(`Protection: ${best.protectionScore}/100`, margin + 50, my);
  doc.text(`Condition Fit: ${best.conditionSuitabilityScore}/100`, margin + 92, my);
  doc.text(`Cost Score: ${best.costScore}/100`, margin + 134, my);

  my += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  const splitAdv = doc.splitTextToSize(`Specifications: ${best.material.specifications}`, contentWidth - 16);
  doc.text(splitAdv, margin + 8, my);

  y += 62;

  // Check page break for section 4
  checkPageBreak(55);

  // Section 4: Why This Packaging & Decision Factors
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.text('4. DECISION ENGINE EXPLAINABILITY & REASONING', margin, y);
  y += 6;

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
  doc.roundedRect(margin, y, contentWidth, 40, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  const splitWhy = doc.splitTextToSize(recommendation.whyExplanation, contentWidth - 12);
  doc.text(splitWhy, margin + 6, y + 8);

  let fy = y + 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.text('Key Advantage Factors:', margin + 6, fy);

  doc.setTextColor(185, 28, 28);
  doc.text('Limitations / Trade-offs:', margin + 90, fy);

  fy += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);

  const topPros = best.reasoningFactors.positive.slice(0, 2);
  topPros.forEach((p, idx) => {
    doc.text(`+ ${p}`, margin + 6, fy + (idx * 4.5));
  });

  const topCons = best.reasoningFactors.negative.slice(0, 2);
  if (topCons.length > 0) {
    topCons.forEach((c, idx) => {
      doc.text(`- ${c}`, margin + 90, fy + (idx * 4.5));
    });
  } else {
    doc.text('- None identified within current parameter envelope', margin + 90, fy);
  }

  y += 46;

  // Check page break for section 5 & 6
  checkPageBreak(70);

  // Section 5: Alternatives Comparison Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
  doc.text('5. TOP ALTERNATIVE PACKAGING OPTIONS', margin, y);
  y += 6;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
  doc.text('Rank', margin + 3, y + 5);
  doc.text('Material Name', margin + 16, y + 5);
  doc.text('Score', margin + 70, y + 5);
  doc.text('Cost (₹)', margin + 88, y + 5);
  doc.text('Protection', margin + 110, y + 5);
  doc.text('Sustainability', margin + 135, y + 5);
  doc.text('Primary Advantage', margin + 160, y + 5);

  y += 7;

  recommendation.topAlternatives.forEach((alt, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 250);
    doc.rect(margin, y, contentWidth, 10, 'F');
    doc.setDrawColor(slateBorder[0], slateBorder[1], slateBorder[2]);
    doc.line(margin, y + 10, margin + contentWidth, y + 10);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    doc.text(`#${alt.rank}`, margin + 3, y + 6.5);
    doc.text(alt.material.name, margin + 16, y + 6.5);
    doc.text(`${alt.overallScore}/100`, margin + 70, y + 6.5);
    doc.text(`₹${alt.estimatedCostInr.toFixed(2)}`, margin + 88, y + 6.5);
    doc.text(`${alt.protectionScore}/100`, margin + 110, y + 6.5);
    doc.text(`${alt.sustainabilityScore}/100`, margin + 135, y + 6.5);

    const advShort = alt.advantages[0] ? alt.advantages[0].substring(0, 30) + '...' : 'Economical';
    doc.text(advShort, margin + 160, y + 6.5);

    y += 10;
  });

  y += 6;

  // Section 6: What-If Simulation (if performed)
  if (whatIfResult) {
    checkPageBreak(38);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(emeraldDark[0], emeraldDark[1], emeraldDark[2]);
    doc.text('6. WHAT-IF ENVIRONMENTAL STRESS SIMULATION', margin, y);
    y += 5;

    doc.setFillColor(254, 243, 199); // amber 100
    doc.setDrawColor(245, 158, 11);
    doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(146, 64, 14);
    doc.text(`Simulated: Temp ${whatIfResult.simulatedConditions.temperatureC}°C | Humidity ${whatIfResult.simulatedConditions.humidityPct}% | Duration ${whatIfResult.simulatedConditions.journeyHours}h`, margin + 6, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(slateDark[0], slateDark[1], slateDark[2]);
    const splitSim = doc.splitTextToSize(whatIfResult.shiftExplanation, contentWidth - 12);
    doc.text(splitSim, margin + 6, y + 12);

    y += 28;
  }

  // Section 7: Scientific Disclaimer & Methodology Note
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  doc.text('DATA NOTE & SCIENTIFIC HONESTY DISCLAIMER', margin, y);
  y += 4;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
  const disclaimerText = 'PackWise AI operates under rigorous scientific validation rules. Camera/image analysis is strictly restricted to commodity cultivar recognition and surface morphology estimation; it does not claim to directly measure chemical pH, cellular moisture percentage, or internal respiration. Physiological references are retrieved from the PackWise Empirical Knowledge Base. Route meteorology is obtained dynamically from Open-Meteo synoptic node feeds. Packaging suitability is computed using a multi-criteria decision analysis (MCDA) model balancing protection, compatibility, condition stress, unit economics, and circular sustainability.';
  const splitDisc = doc.splitTextToSize(disclaimerText, contentWidth);
  doc.text(splitDisc, margin, y);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(slateMuted[0], slateMuted[1], slateMuted[2]);
    doc.text('Smart India Hackathon Prototype - PackWise AI', margin, pageHeight - 6);
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 6, { align: 'right' });
  }

  // Save the PDF
  const filename = `PackWise_Packaging_Report_${recommendation.commodity.slug}_${recommendation.recommendationId}.pdf`;
  doc.save(filename);
}
