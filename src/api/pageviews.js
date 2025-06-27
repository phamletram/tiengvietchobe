// File: /api/pageviews.js (Vercel function)

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';

const credentials = JSON.parse(readFileSync('./zippy-aurora-464007-e0-18ffa172ea4e.json', 'utf-8'));

const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

export default async function handler(req, res) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: 'properties/494826522', // ví dụ: properties/123456789
      dateRanges: [{ startDate: '2026-01-01', endDate: 'today' }],
      metrics: [{ name: 'screenPageViews' }],
    });

    const totalViews = response.rows?.[0]?.metricValues?.[0]?.value || '0';
    res.status(200).json({ views: totalViews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch GA data' });
  }
}
