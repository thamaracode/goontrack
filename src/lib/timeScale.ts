export interface CosmicTimeBreakdown {
  milliseconds: string;
  seconds: string;
  minutes: string;
  hours: string;
  days: string;
  weeks: string;
  lunarMonths: string;
  solarYears: string;
  decades: string;
  centuries: string;
  millennia: string;
  galacticYears: string;
}

export function computeCosmicTime(totalMinutes: number): CosmicTimeBreakdown {
  const ms = totalMinutes * 60 * 1000;
  const sec = totalMinutes * 60;
  const mins = totalMinutes;
  const hrs = totalMinutes / 60;
  const days = totalMinutes / 1440;
  const weeks = totalMinutes / 10080;
  const lunarMonths = totalMinutes / (29.53059 * 1440);
  const years = totalMinutes / 525600;
  const decades = totalMinutes / 5256000;
  const centuries = totalMinutes / 52560000;
  const millennia = totalMinutes / 525600000;
  const galacticYears = totalMinutes / (525600 * 230000000);

  return {
    milliseconds: ms.toLocaleString() + ' ms',
    seconds: sec.toLocaleString() + ' s',
    minutes: mins.toLocaleString() + ' min',
    hours: hrs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' hrs',
    days: days.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 }) + ' days',
    weeks: weeks.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + ' weeks',
    lunarMonths: lunarMonths.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 }) + ' lunations',
    solarYears: years >= 0.0001 ? years.toFixed(5) + ' yrs' : years.toExponential(4) + ' yrs',
    decades: decades >= 0.00001 ? decades.toFixed(6) + ' decades' : decades.toExponential(4) + ' decades',
    centuries: centuries >= 0.000001 ? centuries.toFixed(7) + ' centuries' : centuries.toExponential(4) + ' centuries',
    millennia: millennia >= 0.0000001 ? millennia.toFixed(8) + ' millennia' : millennia.toExponential(4) + ' millennia',
    galacticYears: galacticYears.toExponential(6) + ' galactic yrs',
  };
}
