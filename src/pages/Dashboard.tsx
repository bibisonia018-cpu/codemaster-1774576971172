import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Dashboard = () => {
  const [merchantData, setMerchantData] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', image: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, "merchants", user.uid);
        const docSnap = await getDoc(docRef);
        setMerchantData(docSnap.data());
        fetchProducts(user.uid);
      } else {
        navigate('/login');
      }
    });
    return () => checkAuth();
  }, []);

  const fetchProducts = async (uid: string) => {
    const q = query(collection(db, "products"), where("merchantId", "==", uid));
    const querySnapshot = await getDocs(q);
    setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleUpdateTelegram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    await updateDoc(doc(db, "merchants", auth.currentUser.uid), {
      telegramBotToken: merchantData.telegramBotToken,
      telegramChatId: merchantData.telegramChatId
    });
    Swal.fire("تم التحديث", "تم حفظ إعدادات التلغرام بنجاح", "success");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    await addDoc(collection(db, "products"), {
      ...newProduct,
      merchantId: auth.currentUser.uid,
      createdAt: new Date()
    });
    setNewProduct({ name: '', price: '', description: '', image: '' });
    fetchProducts(auth.currentUser.uid);
    Swal.fire("تم!", "تمت إضافة المنتج بنجاح", "success");
  };

  if (!merchantData) return <div className="text-center">جاري التحميل...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">لوحة تحكم: {merchantData.businessName}</h1>
      
      {/* Telegram Config */}
      <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">⚙️ إعدادات الإشعارات (Telegram)</h2>
        <form onSubmit={handleUpdateTelegram} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Bot API Token</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded mt-1" 
              value={merchantData.telegramBotToken || ''}
              onChange={(e) => setMerchantData({...merchantData, telegramBotToken: e.target.value})}
              placeholder="123456789:ABCDEF..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Chat ID</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded mt-1" 
              value={merchantData.telegramChatId || ''}
              onChange={(e) => setMerchantData({...merchantData, telegramChatId: e.target.value})}
              placeholder="مثلاً: 987654321"
            />
          </div>
          <button className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-600">حفظ الإعدادات</button>
        </form>
      </section>

      {/* Add Product */}
      <section className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">➕ إضافة منتج جديد</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="اسم المنتج" className="p-2 border rounded" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
          <input type="number" placeholder="السعر" className="p-2 border rounded" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
          <input type="text" placeholder="رابط صورة المنتج" className="p-2 border rounded" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
          <textarea placeholder="وصف المنتج" className="p-2 border rounded col-span-2" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
          <button className="bg-green-600 text-white px-4 py-2 rounded col-span-2">إضافة المنتج</button>
        </form>
      </section>

      {/* Products List */}
      <section>
        <h2 className="text-lg font-semibold mb-4">منتجاتك</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white p-4 rounded shadow-sm flex items-center justify-between">
              <div>
                <p className="font-bold">{p.name}</p>
                <p className="text-sm text-gray-500">{p.price} دج</p>
              </div>
              <button className="text-red-500 text-sm">حذف</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;