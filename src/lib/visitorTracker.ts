/**
 * visitorTracker.ts - Live Website Visitor Analytics & Telemetry Tracker with IP Geolocation
 */
import { DEFAULT_GOOGLE_WEBHOOK_URL } from '@/config/crmConfig';

interface LocationData {
  city: string;
  region: string;
  country: string;
  locationStr: string;
}

function getSessionId(): string {
  if (typeof window === 'undefined') return 'sess-server';
  let sid = sessionStorage.getItem('wf_visitor_sid');
  if (!sid) {
    sid = 'sid-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    sessionStorage.setItem('wf_visitor_sid', sid);
  }
  return sid;
}

function detectDevice(): 'MOBILE' | 'DESKTOP' | 'TABLET' {
  if (typeof window === 'undefined') return 'DESKTOP';
  const ua = navigator.userAgent || '';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'TABLET';
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'MOBILE';
  return 'DESKTOP';
}

function detectBrowser(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  return 'Browser';
}

function detectOS(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent;
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Macintosh') || ua.includes('Mac OS')) return 'macOS';
  if (ua.includes('Windows')) return 'Windows';
  if (ua.includes('Linux')) return 'Linux';
  return 'OS';
}

async function fetchVisitorLocation(): Promise<LocationData> {
  if (typeof window === 'undefined') {
    return { city: 'Ahmedabad', region: 'Gujarat', country: 'India', locationStr: 'Ahmedabad, Gujarat, India' };
  }

  try {
    const cached = sessionStorage.getItem('wf_visitor_location');
    if (cached) return JSON.parse(cached);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const city = data.city || 'Ahmedabad';
      const region = data.region || 'Gujarat';
      const country = data.country_name || 'India';
      const loc: LocationData = {
        city,
        region,
        country,
        locationStr: `${city}, ${region}, ${country}`,
      };
      sessionStorage.setItem('wf_visitor_location', JSON.stringify(loc));
      return loc;
    }
  } catch (e) {}

  return {
    city: 'Ahmedabad',
    region: 'Gujarat',
    country: 'India',
    locationStr: 'Ahmedabad, Gujarat, India',
  };
}

export async function trackVisitorPageView(pathName?: string) {
  if (typeof window === 'undefined') return;

  try {
    const currentPath = pathName || window.location.pathname || '/';
    const pageTitle = document.title || 'Whitestone Fincorp';
    const sessionId = getSessionId();
    const device = detectDevice();
    const browser = detectBrowser();
    const os = detectOS();
    const referrer = document.referrer || 'Direct / Search';
    const loc = await fetchVisitorLocation();

    // Store local log for immediate display in Admin CRM
    const localLog = {
      id: 'vlog-' + Date.now(),
      sessionId,
      timestamp: new Date().toISOString(),
      path: currentPath,
      pageTitle,
      device,
      browser,
      os,
      referrer,
      location: loc.locationStr,
      city: loc.city,
      region: loc.region,
      country: loc.country,
    };

    try {
      const storedLogs = JSON.parse(localStorage.getItem('wf_visitor_logs') || '[]');
      storedLogs.unshift(localLog);
      localStorage.setItem('wf_visitor_logs', JSON.stringify(storedLogs.slice(0, 200)));
    } catch (e) {}

    // Send background telemetry to Google Webhook
    const targetWebhook = localStorage.getItem('wf_google_webhook_url') || DEFAULT_GOOGLE_WEBHOOK_URL;
    const bodyParams = new URLSearchParams();
    bodyParams.append('action', 'logVisitor');
    bodyParams.append('sessionId', sessionId);
    bodyParams.append('path', currentPath);
    bodyParams.append('pageTitle', pageTitle);
    bodyParams.append('device', device);
    bodyParams.append('browser', browser);
    bodyParams.append('os', os);
    bodyParams.append('referrer', referrer);
    bodyParams.append('city', loc.city);
    bodyParams.append('region', loc.region);
    bodyParams.append('country', loc.country);
    bodyParams.append('location', loc.locationStr);

    fetch(targetWebhook, {
      method: 'POST',
      mode: 'no-cors',
      body: bodyParams,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    }).catch(() => {});
  } catch (err) {
    console.warn('Visitor tracking notice:', err);
  }
}
