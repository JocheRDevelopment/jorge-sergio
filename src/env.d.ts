/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
  /** Cola de eventos de analytics (GTM/GA4 la consume cuando se instale). */
  dataLayer?: Record<string, unknown>[];
}
