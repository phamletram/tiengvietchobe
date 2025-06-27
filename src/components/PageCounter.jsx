import { useEffect, useState } from 'react';

export default function PageCounter() {
  const [views, setViews] = useState(null);

  useEffect(() => {
    fetch('/api/pageviews')
      .then((res) => res.json())
      .then((data) => setViews(data.views));
  }, []);

  return (
    <span className="text-xl font-semibold"> Lượt xem: {views ?? '...'}</span>
  );
}
