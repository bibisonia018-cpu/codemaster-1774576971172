import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    const fetchData = async () => {
      if (!productId) return;
      const prodSnap = await getDoc(doc(db, "products", productId));
      if (prodSnap.exists()) {
        const pData = prodSnap.data();
        setProduct(pData);
        const merchSnap = await getDoc(doc(db, "merchants", pData.merchantId));
        setMerchant(merchSnap.data());
      }
    };
    fetchData();
  }, [productId]);

  const sendTelegramNotification = async (orderData: any) => {
    if (!merchant?.telegramBotToken || !merchant?.telegramChatId) return;

    const message = `
🔔 *طلب جديد وصل!*
-------------------------
📦 *المنتج:* ${product.name}
💰 *السعر:* ${product.price}
-------------------------
👤 *الزبون:* ${orderData.name}
📞 *الهاتف:* ${orderData.phone}
📍 *العنوان:* ${orderData.address}
-------------------------
تاريخ الطلب: ${new Date().toLocaleString()}
    `;

    const url = `https://api.telegram.org/bot${merchant.telegramBotToken}/sendMessage`;
    
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: merchant.telegramChatId,
          text: message,
          parse_mode: 'Markdown'
        })
      });
    } catch (err) {
      console.error("Telegram Error:", err);
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Save to database
      await addDoc(collection(db, "orders"), {
        productId,
        merchantId: product.merchantId,
        ...customer,
        status: 'pending',
        createdAt: new Date()
      });

      // 2. Send Telegram Notification
      await sendTelegramNotification(customer);

      Swal.fire("تم إرسال طلبك!", "سيتصل بك التاجر لتأكيد الطلبية.", "success");
      setCustomer({ name: '', phone: '', address: '' });
    } catch (error) {
      Swal.fire("خطأ", "حدث خطأ أثناء إرسال الطلب", "error");
    }
  };

  if (!product) return <div className="text-center">جاري التحميل...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <img src={product.image || 'https://via.placeholder.com/400'} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-2xl text-primary font-semibold my-2">{product.price} دج</p>
        <p className="text-gray-600 mb-6">{product.description}</p>

        <div className="bg-gray-50 p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">أطلب الآن</h2>
          <form onSubmit={handleOrder} className="space-y-4">
            <input 
              type="text" placeholder="الاسم الكامل" required
              className="w-full p-3 border rounded-lg"
              value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})}
            />
            <input 
              type="tel" placeholder="رقم الهاتف" required
              className="w-full p-3 border rounded-lg"
              value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})}
            />
            <textarea 
              placeholder="العنوان الكامل" required
              className="w-full p-3 border rounded-lg"
              value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})}
            ></textarea>
            <button className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition">
              تأكيد الطلبية
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;