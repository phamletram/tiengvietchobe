import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

export default function PageCounter() {

    const [googleAnalyticsViews, setGoogleAnalyticsViews] = useState(0);
    const [todayViews, setTodayViews] = useState(0);

    useEffect(() => {
    const fetchGoogleAnalyticsViews = async () => {
        try {
        const response = await fetch('/api/pageviews'); // Thay đổi thành URL serverless function của bạn
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setGoogleAnalyticsViews(data.pageViews);
        setTodayViews(data.todayViews);
        } catch (error) {
            console.error("Lỗi khi lấy số lượt xem từ Google Analytics:", error);
        // Xử lý lỗi, có thể hiển thị một giá trị mặc định hoặc thông báo lỗi
        }
    };

    fetchGoogleAnalyticsViews();
    }, []);

  return (
    <div className="flex items-center gap-3">
      <span className="flex items-center gap-1 text-yellow-700 font-bold text-lg" style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}>
        <Eye className="w-5 h-5 mr-1 text-blue-400" />
        {googleAnalyticsViews ?? '...'}
      </span>
      <span className="flex items-center gap-1 text-yellow-700 font-bold text-lg" style={{fontFamily:'"Baloo 2", Arial, sans-serif'}}>
        <span className="text-lg mr-1">☀️</span>
        {todayViews ?? '...'}
      </span>
    </div>
  );
}