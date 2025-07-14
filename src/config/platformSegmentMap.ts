// src/config/platformSegmentMap.ts

export const platformSegmentMap: Record<string, string[]> = {
    Advisory: ["Advisory", "MEAC"],
    "Private Bank": ["FSA"],
    "Consumer Contact Center": ["WMB", "MLSN"],
    "Consumer Financial Center": ["MFSA"],
  };
  
  // Export all platform names as an array for dropdown usage
  export const platformOptions: string[] = Object.keys(platformSegmentMap);
  
  // Optionally export all unique segments (flattened)
  // Useful for filters or validation
  export const allSegments: string[] = Array.from(
    new Set(Object.values(platformSegmentMap).flat())
  );
  