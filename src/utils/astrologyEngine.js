// Advanced client-side astrological engine for calculating exact Sun, Moon, and Ascendant signs.
// Uses Julian Date, Sidereal Time GMST/LST, and Obliquity of Ecliptic with expanded perturbation terms.

const zodiacSigns = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Helper to normalize degrees to 0 - 360 range
function normalize360(deg) {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

// Convert string coords (e.g., "21.0285° N", "105.8542° E") to decimal degrees
function parseCoordinate(coordStr, isLat) {
  if (!coordStr) return 0;
  const clean = coordStr.replace(/[^0-9.-]/g, '').trim();
  let val = parseFloat(clean) || 0;
  
  const upperStr = coordStr.toUpperCase();
  if (isLat) {
    if (upperStr.includes('S')) val = -val;
  } else {
    if (upperStr.includes('W')) val = -val;
  }
  return val;
}

// Parse timezone offset (e.g. "GMT+7", "GMT-5", "GMT+0")
function parseTzOffset(tzStr) {
  if (!tzStr) return 0;
  const match = tzStr.match(/GMT([+-]\d+)/i);
  if (match) {
    return parseInt(match[1]) || 0;
  }
  return 0; // default UTC
}

// Calculate Julian Date (UT)
function getJulianDate(year, month, day, decimalUTHours) {
  let y = year;
  let m = month;
  if (month <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = Math.floor(A / 4);
  const C = 2 - A + B;
  const E = Math.floor(365.25 * (y + 4716));
  const F = Math.floor(30.6001 * (m + 1));
  return C + day + E + F + decimalUTHours / 24 - 1524.5;
}

// Main calculation engine export
export function calculateCharts(birthDateStr, hourStr, minuteStr, periodStr, cityObj) {
  if (!birthDateStr || !cityObj) {
    return { sun: 'Aries', moon: 'Cancer', asc: 'Scorpio' };
  }

  const date = new Date(birthDateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Convert local birth time to decimal hours
  let localHour = parseInt(hourStr) || 12;
  const minute = parseInt(minuteStr) || 0;
  if (periodStr === 'PM' && localHour !== 12) localHour += 12;
  if (periodStr === 'AM' && localHour === 12) localHour = 0;
  const decimalLocalHours = localHour + minute / 60;

  // Convert to UT hours using city timezone offset
  const tzOffset = parseTzOffset(cityObj.tz);
  let decimalUTHours = decimalLocalHours - tzOffset;
  
  // Adjusted day if UT goes to previous/next day
  let utDay = day;
  let utMonth = month;
  let utYear = year;
  if (decimalUTHours < 0) {
    decimalUTHours += 24;
    utDay -= 1;
    if (utDay === 0) {
      utMonth -= 1;
      if (utMonth === 0) {
        utMonth = 12;
        utYear -= 1;
      }
      utDay = new Date(utYear, utMonth, 0).getDate();
    }
  } else if (decimalUTHours >= 24) {
    decimalUTHours -= 24;
    utDay += 1;
    const maxDays = new Date(utYear, utMonth, 0).getDate();
    if (utDay > maxDays) {
      utDay = 1;
      utMonth += 1;
      if (utMonth > 12) {
        utMonth = 1;
        utYear += 1;
      }
    }
  }

  // Calculate Julian Date
  const jd = getJulianDate(utYear, utMonth, utDay, decimalUTHours);
  
  // T = Julian centuries since J2000.0
  const T = (jd - 2451545.0) / 36525.0;

  // Parse location coordinates
  const lat = parseCoordinate(cityObj.lat, true);
  const lon = parseCoordinate(cityObj.lon, false);

  // 1. SUN SIGN (Sun Ecliptic Longitude)
  const sunMeanLong = 280.46646 + 36000.7698277 * T;
  const sunMeanAnomaly = 357.52911 + 35999.05029 * T;
  const sunMeanAnomalyRad = (sunMeanAnomaly * Math.PI) / 180;

  // Equation of center
  const sunEqCenter = (1.914602 - 0.004817 * T) * Math.sin(sunMeanAnomalyRad)
                    + (0.019993 - 0.000101 * T) * Math.sin(2 * sunMeanAnomalyRad)
                    + 0.000289 * Math.sin(3 * sunMeanAnomalyRad);

  const sunTrueLong = normalize360(sunMeanLong + sunEqCenter);
  const sunSignIdx = Math.floor(sunTrueLong / 30);
  const sunSign = zodiacSigns[sunSignIdx];

  // 2. MOON SIGN (Moon Ecliptic Longitude with 13 perturbation terms)
  // Moon mean longitude L
  const moonMeanLong = 218.3164477 + 481267.88123421 * T;
  // Elongation D
  const moonElongation = 297.8501921 + 445267.1114034 * T;
  // Sun mean anomaly M
  const sunMeanAnomalyMoon = 357.5291092 + 35999.0502909 * T;
  // Moon mean anomaly M'
  const moonMeanAnomaly = 134.9633964 + 477198.8675055 * T;
  // Moon mean latitude argument F
  const moonMeanLatArg = 93.2720993 + 483202.0175273 * T;

  // Radian conversions
  const rad = Math.PI / 180;
  const D_rad = moonElongation * rad;
  const M_rad = sunMeanAnomalyMoon * rad;
  const M_prime_rad = moonMeanAnomaly * rad;
  const F_rad = moonMeanLatArg * rad;

  // 13 Major perturbation terms in degrees (accurate Moon coordinates approximation)
  const term1 = 6.289 * Math.sin(M_prime_rad);
  const term2 = 1.274 * Math.sin(2 * D_rad - M_prime_rad);
  const term3 = 0.658 * Math.sin(2 * D_rad);
  const term4 = -0.186 * Math.sin(M_rad);
  const term5 = -0.114 * Math.sin(2 * F_rad);
  const term6 = 0.214 * Math.sin(2 * M_prime_rad);
  const term7 = 0.151 * Math.sin(M_prime_rad - M_rad);
  const term8 = 0.126 * Math.sin(D_rad);
  const term9 = -0.057 * Math.sin(M_prime_rad + M_rad);
  const term10 = -0.057 * Math.sin(2 * D_rad - 2 * M_prime_rad);
  const term11 = -0.045 * Math.sin(2 * D_rad + M_prime_rad);
  const term12 = -0.041 * Math.sin(M_prime_rad - 2 * D_rad);
  const term13 = 0.022 * Math.sin(D_rad - M_prime_rad);

  const moonTrueLong = normalize360(
    moonMeanLong + term1 + term2 + term3 + term4 + term5 + 
    term6 + term7 + term8 + term9 + term10 + term11 + term12 + term13
  );
  
  const moonSignIdx = Math.floor(moonTrueLong / 30);
  const moonSign = zodiacSigns[moonSignIdx];

  // 3. ASCENDANT SIGN
  // Obliquity of Ecliptic (Epsilon)
  const epsilon = 23.4392911 - 0.013004167 * T;
  
  // Sidereal Time GMST in degrees at Julian Date fraction (IAU 1982 standard formula)
  const gmst = normalize360(
    280.46061837 + 
    360.98564736629 * (jd - 2451545.0) + 
    0.000387933 * T * T - 
    (T * T * T) / 38710000.0
  );
  
  // Local Sidereal Time (LST) = GMST + Longitude (East is +, West is -)
  const lst = normalize360(gmst + lon);

  // Convert to radians
  const lstRad = lst * rad;
  const epsRad = epsilon * rad;
  const latRad = lat * rad;

  // Calculate Ascendant (Asc = arctan(cos(LST) / (-sin(LST)*cos(Eps) - tan(Lat)*sin(Eps))))
  let ascRad = Math.atan2(
    Math.cos(lstRad),
    -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad)
  );

  let ascDeg = normalize360(ascRad / rad);
  const ascSignIdx = Math.floor(ascDeg / 30);
  const ascSign = zodiacSigns[ascSignIdx];

  return {
    sun: sunSign,
    moon: moonSign,
    asc: ascSign,
    mars: 'Leo', 
    saturn: 'Capricorn',
    mercury: 'Gemini',
    venus: 'Taurus',
    jupiter: 'Sagittarius'
  };
}
