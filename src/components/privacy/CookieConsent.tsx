"use client";

import { useEffect, useMemo, useState } from "react";

type ConsentCategories = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

const COOKIE_NAME = "cookie_consent";
const CONSENT_VERSION = 1; // bump when categories/purposes change

function readConsentCookie(): { v: number; c: ConsentCategories } | null {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${COOKIE_NAME}=`));
    if (!cookie) return null;
    const value = decodeURIComponent(cookie.split("=")[1] || "");
    const parsed = JSON.parse(value);
    if (!parsed?.c) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeConsentCookie(consent: ConsentCategories) {
  const sixMonths = 60 * 60 * 24 * 180; // seconds
  const payload = encodeURIComponent(
    JSON.stringify({ v: CONSENT_VERSION, c: consent })
  );
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${payload}; Path=/; Max-Age=${sixMonths}; SameSite=Lax${secure}`;
  // Emit an event for analytics initializers to react to
  window.dispatchEvent(new CustomEvent("cookie-consent:updated", { detail: consent }));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [prefs, setPrefs] = useState<ConsentCategories>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  const hasConsent = useMemo(() => typeof window !== "undefined" && !!readConsentCookie(), []);

  useEffect(() => {
    // Show banner if no consent or outdated version
    const existing = readConsentCookie();
    if (!existing || existing.v !== CONSENT_VERSION) {
      setVisible(true);
    }
  }, []);

  const acceptAll = () => {
    const consent = { necessary: true, analytics: true, marketing: true };
    writeConsentCookie(consent);
    setVisible(false);
  };

  const rejectAll = () => {
    const consent = { necessary: true, analytics: false, marketing: false };
    writeConsentCookie(consent);
    setVisible(false);
  };

  const savePrefs = () => {
    writeConsentCookie(prefs);
    setVisible(false);
    setShowPrefs(false);
  };

  if (!visible || hasConsent) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto max-w-3xl rounded-t-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-200">
            <p className="font-medium">Nous utilisons des cookies</p>
            <p className="mt-1">
              Nous utilisons des cookies nécessaires au bon fonctionnement du site. Avec votre consentement, nous utilisons également des cookies d’analyse et de marketing pour améliorer votre expérience. Voir notre Politique de confidentialité.
            </p>
          </div>
          <div className="mt-2 flex shrink-0 gap-2 sm:mt-0">
            <button
              type="button"
              onClick={rejectAll}
              className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Tout refuser
            </button>
            <button
              type="button"
              onClick={() => setShowPrefs((s) => !s)}
              className="inline-flex items-center rounded-md border border-blue-600 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-950/30"
            >
              Gérer les préférences
            </button>
            <button
              type="button"
              onClick={acceptAll}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Tout accepter
            </button>
          </div>
        </div>

        {showPrefs && (
          <div role="dialog" aria-modal="true" className="mt-4 rounded-md border border-gray-200 p-3 dark:border-gray-800">
            <h3 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Préférences de cookies</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <input id="consent-necessary" type="checkbox" checked readOnly className="mt-1" />
                <label htmlFor="consent-necessary" className="select-none">
                  Cookies nécessaires (obligatoires)
                </label>
              </li>
              <li className="flex items-start gap-2">
                <input
                  id="consent-analytics"
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs((p) => ({ ...p, analytics: e.target.checked }))}
                  className="mt-1"
                />
                <label htmlFor="consent-analytics" className="select-none">
                  Cookies d’analyse (trafic, utilisation)
                </label>
              </li>
              <li className="flex items-start gap-2">
                <input
                  id="consent-marketing"
                  type="checkbox"
                  checked={prefs.marketing}
                  onChange={(e) => setPrefs((p) => ({ ...p, marketing: e.target.checked }))}
                  className="mt-1"
                />
                <label htmlFor="consent-marketing" className="select-none">
                  Cookies marketing (publicités, remarketing)
                </label>
              </li>
            </ul>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPrefs(false)}
                className="rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={savePrefs}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Enregistrer les préférences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper hook to read consent elsewhere (e.g., analytics loader)
export function useCookieConsent(): ConsentCategories | null {
  const [consent, setConsent] = useState<ConsentCategories | null>(null);
  useEffect(() => {
    const existing = readConsentCookie();
    if (existing) setConsent(existing.c);
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ConsentCategories>).detail;
      if (detail) setConsent(detail);
    };
    window.addEventListener("cookie-consent:updated", handler as EventListener);
    return () => window.removeEventListener("cookie-consent:updated", handler as EventListener);
  }, []);
  return consent;
}
