// src/components/PageCounter.js
import { useEffect, useState } from 'react';

export default function PageCounter() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch('https://phamtram.goatcounter.com/counter/.json')
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);

  return (
    
      <span className="text-xl font-semibold"> Lượt xem: {count ?? '...'}</span>
   
  );
}
