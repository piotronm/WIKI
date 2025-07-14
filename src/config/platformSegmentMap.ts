// src/config/platformSegmentMap.ts

export const platformSegmentMap: Record<string, string[]> = {
    Advisory: ["Advisory", "MEAC", "FSA", "WMB", "MLSN", "MFSA"],
    "Private Bank": [],
    "GWIM Call Center": ["RBCC", "WMCS", "WMBS"],
    "Consumer Contact Center": ["Home Loans", "EricaAssist", "Sales", "Outbound", "Servicing", "Fraud", "Chat"],
    "Consumer Financial Center": [],
  };
  
  // Export all platform names as an array for dropdown usage
  export const platformOptions: string[] = Object.keys(platformSegmentMap);
  
  // Optionally export all unique segments (flattened)
  // Useful for filters or validation
  export const allSegments: string[] = Array.from(
    new Set(Object.values(platformSegmentMap).flat())
  );
  