export interface PincodeResult {
  city: string;
  state: string;
  country: string;
}

/** Lookup Indian pincode via postalpincode.in (city = district, state, country). */
export async function lookupPincode(pincode: string): Promise<PincodeResult | null> {
  const clean = pincode.replace(/\D/g, "");
  if (clean.length !== 6) return null;

  try {
    const res = await fetch(`https://api.postalpincode.in/pincode/${clean}`);
    const data = await res.json();
    const entry = data?.[0];
    if (entry?.Status !== "Success" || !entry?.PostOffice?.length) return null;

    const po = entry.PostOffice[0];
    return {
      city: po.District || po.Block || po.Name || "",
      state: po.State || "",
      country: po.Country || "India",
    };
  } catch {
    return null;
  }
}
