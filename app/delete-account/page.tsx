"use client";
import React, { ChangeEvent, useState } from 'react';
import { AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { LoginRequest } from '@/types';
import { api } from '../../api'
export default function DeleteAccountPage() {
  const [formData, setFormData] = useState({
    phone_number: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.phone_number || !formData.password) {
      setError('Barcha maydonlarni to\'ldiring');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dataform: LoginRequest = {
        phone_number: formData.phone_number,
        password: formData.password
      };
      const response = await api.delete_account(dataform)

      if (!(response as any).user) {
        setError((response as any).detail || 'Xato yuz berdi');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFormData({ phone_number: '', password: '' });
      setShowConfirm(false);

      setTimeout(() => {
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      setError('Server bilan aloqa o\'rnatishda xato');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account o'chirildi</h2>
          <p className="text-gray-600 mb-4">Sizning accountingiz muvaffaqiyatli o'chirildi</p>
          <p className="text-sm text-gray-500">Login sahifasiga yo'naltirilmoqdasi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Account o'chirish</h1>
        <p className="text-gray-600 mb-6">Bu amalni qaytarish mumkin emas</p>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {!showConfirm ? (
          <div className="space-y-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-800 text-sm font-medium">⚠️ Diqqat!</p>
              <p className="text-red-700 text-sm mt-2">
                Accountingizni o'chirsangiz barcha ma'lumotlar o'chiriladi va tiklash mumkin bo'lmaydi.
              </p>
            </div>

            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition duration-200"
            >
              Davom etish
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon raqam
              </label>
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="+998999400000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Parol
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Parolingizni kiriting"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setFormData({ phone_number: '', password: '' });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition duration-200"
                disabled={loading}
              >
                Orqaga
              </button>

              <button
                onClick={() => handleSubmit()}
                disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Kutilmoqda...
                  </>
                ) : (
                  'O\'chirish'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
