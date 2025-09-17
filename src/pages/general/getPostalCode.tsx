// geocode.ts
const GOOGLE_GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';
// Prefer maps.googleapis.com (not maps.google.com)

export async function getPostalCode(
    lat: number,
    lng: number,
    apiKey: string,
    timeoutMs = 8000
  ): Promise<string | null> {
    const url = `${GOOGLE_GEOCODE_ENDPOINT}?latlng=${lat},${lng}&key=${encodeURIComponent(apiKey)}`;
  
    // Abort after timeout to avoid hanging requests
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
  
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
      const data: any = await res.json();
  
      if (data.status !== 'OK') {
        // Common statuses: ZERO_RESULTS, OVER_QUERY_LIMIT, REQUEST_DENIED, INVALID_REQUEST
        const msg = data.error_message ? `: ${data.error_message}` : '';
        throw new Error(`Geocoding failed (${data.status})${msg}`);
      }
  
      // Walk results and their address_components to find a postal_code
      for (const r of data.results as any[]) {
        const comp = r.address_components?.find((c: any) =>
          Array.isArray(c.types) && c.types.includes('postal_code')
        );
        if (comp?.long_name) return String(comp.long_name);
      }
  
      // Sometimes only a postal_code_suffix exists; not a full code
      for (const r of data.results as any[]) {
        const suffix = r.address_components?.find((c: any) =>
          Array.isArray(c.types) && c.types.includes('postal_code_suffix')
        );
        if (suffix?.long_name) return String(suffix.long_name); // last resort
      }
  
      return null; // postal code not provided for this lat/lng
    } finally {
      clearTimeout(t);
    }
  }