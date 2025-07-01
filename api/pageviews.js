// File: /api/pageviews.js (Vercel function)

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';


const credentials = {
    client_email:  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? import.meta.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, 
    private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : import.meta.env.GOOGLE_PRIVATE_KEY ? import.meta.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '',
    project_id: process.env.GOOGLE_PROJECT_ID ?? import.meta.env.GOOGLE_PROJECT_ID,
  };

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials,
});

// Thay thế bằng ID tài sản GA4 của bạn (ví dụ: 'properties/123456789')
const propertyId = 'properties/' + process.env.GA4_PROPERTY_ID ?? import.meta.env.GA4_PROPERTY_ID; // Lấy từ biến môi trường

export default async function handler(req, res) {

  
  try {
    // Lấy tổng views
    const [responseTotal] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: '2025-05-01',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
    });
    let totalPageViews = 0;
    if (responseTotal.rows && responseTotal.rows.length > 0) {
      totalPageViews = parseInt(responseTotal.rows[0].metricValues[0].value);
    }
    // Lấy views hôm nay
    const [responseToday] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: 'today',
          endDate: 'today',
        },
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
    });
    let todayViews = 0;
    if (responseToday.rows && responseToday.rows.length > 0) {
      todayViews = parseInt(responseToday.rows[0].metricValues[0].value);
    }
    res.status(200).json({ pageViews: totalPageViews, todayViews });

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Google Analytics:', error);
    res.status(500).json({ error: error });
  }
}