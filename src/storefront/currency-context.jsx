// Currency context: auto-detects visitor country, allows manual override,
// and exposes formatPrice() for converting JOD base prices.
import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { CURRENCIES, COUNTRY_TO_CURRENCY, DEFAULT_CURRENCY } from './currencies.js';

const STORAGE_KEY = 'sl_currency';
const GEO_CACHE_KEY = 'sl_geo_country';
const GEO_CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

const CurrencyContext = createContext(null);

function convert(jodAmount, currency) {
  const raw = Number(jodAmount || 0) * currency.rate;
  if (currency.roundTo && currency.roundTo > 1) {
    return Math.round(raw / currency.roundTo) * currency.roundTo;
  }
  return raw;
}

function formatNumber(value, decimals) {
  // Group thousands with commas, fixed decimals.
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CurrencyProvider({ children }) {
  const [code, setCode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && CURRENCIES[saved]) return saved;
    } catch {}
    return DEFAULT_CURRENCY;
  });
  const [userOverride, setUserOverride] = useState(() => {
    try { return !!localStorage.getItem(STORAGE_KEY); } catch { return false; }
  });

  // Auto-detect country once (unless user already chose)
  useEffect(() => {
    if (userOverride) return;
    let cached = null;
    try {
      const raw = localStorage.getItem(GEO_CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Date.now() - parsed.t < GEO_CACHE_TTL) cached = parsed.country;
      }
    } catch {}
    const apply = (country) => {
      if (!country) return;
      const mapped = COUNTRY_TO_CURRENCY[country];
      if (mapped && CURRENCIES[mapped]) setCode(mapped);
    };
    if (cached) { apply(cached); return; }
    fetch('https://ipapi.co/json/')
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        const country = d?.country_code || d?.country;
        if (country) {
          try { localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({ country, t: Date.now() })); } catch {}
          apply(country);
        }
      })
      .catch(() => {});
  }, [userOverride]);

  const setCurrency = useCallback((next) => {
    if (!CURRENCIES[next]) return;
    setCode(next);
    setUserOverride(true);
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
  }, []);

  const currency = CURRENCIES[code] || CURRENCIES[DEFAULT_CURRENCY];

  const formatPrice = useCallback((jodAmount) => {
    const v = convert(jodAmount, currency);
    return `${currency.symbol} ${formatNumber(v, currency.decimals)}`;
  }, [currency]);

  const convertPrice = useCallback((jodAmount) => convert(jodAmount, currency), [currency]);

  const value = useMemo(() => ({
    code, currency, setCurrency, formatPrice, convertPrice,
  }), [code, currency, setCurrency, formatPrice, convertPrice]);

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    // Safe fallback when used outside provider (shouldn't happen at runtime)
    const c = CURRENCIES[DEFAULT_CURRENCY];
    return {
      code: DEFAULT_CURRENCY,
      currency: c,
      setCurrency: () => {},
      formatPrice: (v) => `${c.symbol} ${formatNumber(Number(v||0), c.decimals)}`,
      convertPrice: (v) => Number(v || 0),
    };
  }
  return ctx;
}
