// File: /api/pageviews.js (Vercel function)

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { readFileSync } from 'fs';


const credentials = {
    client_email:  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL, // Lấy từ biến môi trường
    private_key: process.env.GOOGLE_PRIVATE_KEY, // Xử lý ký tự xuống dòng
    project_id: process.env.GOOGLE_PROJECT_ID, 
  };

  const analyticsDataClient = new BetaAnalyticsDataClient({
    credentials,
});

// Thay thế bằng ID tài sản GA4 của bạn (ví dụ: 'properties/123456789')
const propertyId = 'properties/' + process.env.GA4_PROPERTY_ID; // Lấy từ biến môi trường

export default async function handler(req, res) {
  try {
    const [response] = await analyticsDataClient.runReport({
      property: propertyId,
      dateRanges: [
        {
          startDate: '30daysAgo', // Hoặc '2020-01-01' để lấy toàn bộ lịch sử
          endDate: 'today',
        },
      ],
      metrics: [
        {
          name: 'screenPageViews', // Đây là số lượt xem trang/màn hình
        },
      ],
    });

    let totalPageViews = 0;
    if (response.rows && response.rows.length > 0) {
      totalPageViews = parseInt(response.rows[0].metricValues[0].value);
    }

    res.status(200).json({ pageViews: totalPageViews });

  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu Google Analytics:', error);
    res.status(500).json({ error: error });
  }
}