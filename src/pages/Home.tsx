import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Home = () => {
  const [merchants, setMerchants] = useState<any[]>([]);

  useEffect(() => {
    const fetchMerchants = async () => {
      const querySnapshot = await getDocs(collection(db, "merchants"));
      setMerchants(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchMerchants();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-8">تسوق من أفضل المتاجر</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {merchants.map(merchant => (
          <Link 
            key={merchant.id} 
            to={`/store/${merchant.id}`}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
              🏪
            </div>
            <h2 className="text-xl font-semibold">{merchant.businessName}</h2>
            <p className="text-gray-500 mt-2">عرض المنتجات ←</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;