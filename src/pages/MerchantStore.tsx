import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const MerchantStore = () => {
  const { merchantId } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [merchant, setMerchant] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!merchantId) return;
      
      const merchSnap = await getDoc(doc(db, "merchants", merchantId));
      if (merchSnap.exists()) setMerchant(merchSnap.data());

      const q = query(collection(db, "products"), where("merchantId", "==", merchantId));
      const querySnapshot = await getDocs(q);
      setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, [merchantId]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">متجر: {merchant?.businessName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map(product => (
          <Link key={product.id} to={`/product/${product.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition">
            <img src={product.image || 'https://via.placeholder.com/200'} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-bold">{product.name}</h3>
              <p className="text-primary font-bold mt-1">{product.price} دج</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MerchantStore;