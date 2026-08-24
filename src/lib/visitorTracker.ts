/**
 * visitorTracker.ts - Live Website Visitor Analytics & Telemetry Tracker
 */
import { DEFAULT_GOOGLE_WEBHOOK_URL } from '@/config/crmConfig';

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

export function trackVisitorPageView(pathName?: string) {
  if (typeof window === 'undefined') return;

  try {
    const currentPath = pathName || window.location.pathname || '/';
    const pageTitle = document.title || 'Whitestone Fincorp';
    const sessionId = getSessionId();
    const device = detectDevice();
    const browser = detectBrowser();
    const os = detectOS();
    const referrer = document.referrer || 'Direct / Bookmark';

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
      location: 'Gujarat, IN',
    };

    try {
      const storedLogs = JSON.parse(localStorage.getItem('wf_visitor_logs') || '[]');
      storedLogs.unshift(localLog);
      // Keep last 200 logs
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
