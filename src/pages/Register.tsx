import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "merchants", res.user.uid), {
        businessName,
        email,
        telegramBotToken: '',
        telegramChatId: '',
        createdAt: new Date()
      });
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">تسجيل تاجر جديد</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="text" placeholder="اسم المتجر" className="w-full p-3 border rounded" onChange={e => setBusinessName(e.target.value)} required />
        <input type="email" placeholder="البريد الإلكتروني" className="w-full p-3 border rounded" onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة المرور" className="w-full p-3 border rounded" onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-primary text-white py-3 rounded font-bold">إنشاء حساب</button>
      </form>
    </div>
  );
};

export default Register;