import { useEffect, useState } from 'react';

export default function PageCounter() {

    const [googleAnalyticsViews, setGoogleAnalyticsViews] = useState(0);

    useEffect(() => {
    const fetchGoogleAnalyticsViews = async () => {
        try {
        const response = await fetch('/api/pageviews'); // Thay đổi thành URL serverless function của bạn
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGoogleAnalyticsViews(data.pageViews);
        } catch (error) {
            console.error("Lỗi khi lấy số lượt xem từ Google Analytics:", error);
        // Xử lý lỗi, có thể hiển thị một giá trị mặc định hoặc thông báo lỗi
        }
    };

    fetchGoogleAnalyticsViews();
    }, []);

  const [views, setViews] = useState(null);

   return (
    <span className="text-xl font-semibold"> Lượt xem: {googleAnalyticsViews ?? '...'}</span>
  );


  
}