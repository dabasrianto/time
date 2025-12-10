/**
 * Hijri date conversion utility
 * Based on the Umm al-Qura calendar used in Saudi Arabia
 */

// Constants for Hijri date calculation
const ISLAMIC_EPOCH = 1948439.5;
const CIVIL_EPOCH = 1721425.5;

/**
 * Convert Gregorian date to Hijri date
 */
export function gregorianToHijri(date: Date): {
  year: number;
  month: number;
  day: number;
  monthName: string;
} {
  // Get Julian day number
  const jd = gregorianToJulian(date);

  // Calculate Hijri date
  const hijri = julianToHijri(jd);

  return {
    year: hijri.year,
    month: hijri.month,
    day: hijri.day,
    monthName: getHijriMonthName(hijri.month),
  };
}

/**
 * Format Hijri date as a string
 */
export function formatHijriDate(date: Date, locale: string = "ar-SA"): string {
  const hijri = gregorianToHijri(date);

  // For Indonesian locale
  if (locale === "id-ID") {
    return `${hijri.day} ${getHijriMonthName(hijri.month, "id")} ${hijri.year} H`;
  }

  // Default Arabic locale
  return `${hijri.day} ${getHijriMonthName(hijri.month)} ${hijri.year} هـ`;
}

/**
 * Convert Gregorian date to Julian day number
 */
function gregorianToJulian(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let jd = CIVIL_EPOCH - 1;
  jd += 365 * (year - 1);
  jd += Math.floor((year - 1) / 4);
  jd += Math.floor((year - 1) / 100) * -1;
  jd += Math.floor((year - 1) / 400);

  if (month <= 2) {
    jd += Math.floor((367 * month - 362) / 12);
  } else {
    jd += Math.floor((367 * month - 362) / 12);
    jd -=
      date.getFullYear() % 4 === 0 &&
      (date.getFullYear() % 100 !== 0 || date.getFullYear() % 400 === 0)
        ? 1
        : 2;
  }

  jd += day;

  return jd;
}

/**
 * Convert Julian day number to Hijri date
 */
function julianToHijri(jd: number): {
  year: number;
  month: number;
  day: number;
} {
  const l = Math.floor(jd - ISLAMIC_EPOCH) + 1;
  const n = Math.floor((l - 1) / 10631) + 1;
  const m = Math.floor(((l - 1) % 10631) / 354.367);
  const j = Math.floor((l - 1) % 10631) - Math.floor(m * 354.367);

  const year = 30 * (n - 1) + m + 1;

  let month = 1;
  let day = j;

  // Determine month and day
  const daysInMonth = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];

  for (let i = 0; i < 12; i++) {
    if (day > daysInMonth[i]) {
      day -= daysInMonth[i];
      month++;
    } else {
      break;
    }
  }

  return { year, month, day };
}

/**
 * Get Hijri month name
 */
function getHijriMonthName(month: number, locale: string = "ar"): string {
  const monthNames = {
    ar: [
      "محرم",
      "صفر",
      "ربيع الأول",
      "ربيع الثاني",
      "جمادى الأولى",
      "جمادى الآخرة",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة",
    ],
    id: [
      "Muharram",
      "Safar",
      "Rabiul Awal",
      "Rabiul Akhir",
      "Jumadil Awal",
      "Jumadil Akhir",
      "Rajab",
      "Sya'ban",
      "Ramadhan",
      "Syawal",
      "Dzulqaidah",
      "Dzulhijjah",
    ],
    en: [
      "Muharram",
      "Safar",
      "Rabi'ul Awwal",
      "Rabi'ul Akhir",
      "Jumadal Ula",
      "Jumadal Akhira",
      "Rajab",
      "Sha'ban",
      "Ramadan",
      "Shawwal",
      "Dhul Qa'dah",
      "Dhul Hijjah",
    ],
  };

  // Default to Arabic if locale not found
  const names = monthNames[locale as keyof typeof monthNames] || monthNames.ar;
  return names[month - 1];
}
