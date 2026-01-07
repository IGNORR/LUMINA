import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useTranslation } from '../hooks/useTranslation';
import { api } from '../services/api';

const Cart = () => {
  const { t } = useTranslation();
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const [showCheckout, setShowCheckout] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    address: '',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [errors, setErrors] = useState({});
  const [expiryError, setExpiryError] = useState('');

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g) || [];
    return groups.join(' ');
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  const handleOpenCheckout = () => {
    setShowCheckout(true);
  };

  const handleCloseCheckout = () => {
    if (processing) return;
    setShowCheckout(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    setExpiryError('');

    if (!form.fullName.trim()) newErrors.fullName = t('cart.checkoutForm.errors.fullNameRequired');
    if (!form.address.trim()) newErrors.address = t('cart.checkoutForm.errors.addressRequired');
    if (!form.phone.trim()) newErrors.phone = t('cart.checkoutForm.errors.phoneRequired');

    const cardDigits = form.cardNumber.replace(/\D/g, '');
    if (cardDigits.length !== 16) newErrors.cardNumber = t('cart.checkoutForm.errors.cardNumberInvalid');

    const cvvDigits = form.cvv.replace(/\D/g, '');
    if (cvvDigits.length !== 3) newErrors.cvv = t('cart.checkoutForm.errors.cvvInvalid');

    if (!form.expiry.trim()) {
      newErrors.expiry = t('cart.checkoutForm.errors.expiryRequired');
    } else {
      const expDigits = form.expiry.replace(/\D/g, '');
      const month = Number(expDigits.slice(0, 2));
      const yearTwo = expDigits.slice(2, 4);
      const year = yearTwo ? 2000 + Number(yearTwo) : NaN;

      if (!month || month < 1 || month > 12) {
        setExpiryError(t('cart.checkoutForm.errors.expiryInvalidMonth'));
      } else if (!year || isNaN(year) || yearTwo.length !== 2) {
        setExpiryError(t('cart.checkoutForm.errors.expiryInvalidYear'));
      } else {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
          setExpiryError(t('cart.checkoutForm.errors.expiryExpired'));
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && !expiryError;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      if (expiryError) {
        toast.error(expiryError);
      } else {
        toast.error(t('cart.toast.fillAllFields'));
      }
      return;
    }

    setProcessing(true);

    try {
      const sanitizedItems = cart.map((item) => ({
        id: item.id || '',
        title: item.title || 'Untitled',
        artist: item.artist || 'Unknown',
        price: Number(item.price) || 0,
        category: item.category || '',
        imageUrl: item.imageUrl || '',
        sold: item.sold || false,
      }));

      const sanitizedCustomer = {
        fullName: form.fullName?.trim() || '',
        address: form.address?.trim() || '',
        phone: form.phone?.trim() || '',
      };

      const sanitizedPayment = {
        cardLast4: form.cardNumber?.slice(-4) || '',
        expiry: form.expiry?.trim() || '',
      };

      const order = {
        customer: sanitizedCustomer,
        payment: sanitizedPayment,
        items: sanitizedItems,
        total: Number(cartTotal) || 0,
      };

      await api.orders.create(order);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(t('cart.checkoutForm.success'));
      clearCart();
      setShowCheckout(false);
      navigate('/');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(t('cart.checkoutForm.error'));
    } finally {
      setProcessing(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-700 text-lg">{t('cart.empty')}</p>
          <Link
            to="/gallery"
            className="inline-block px-4 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
          >
            {t('cart.backToGallery')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-4xl font-light text-gray-900">{t('cart.yourCart')}</h1>

        <div className="bg-white border border-gray-200">
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-gray-400">{t('cart.noImage')}</span>
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-lg text-gray-900">{item.title}</p>
                  {item.artist && <p className="text-sm text-gray-600">{item.artist}</p>}
                  <p className="text-sm text-gray-800 font-medium">
                    {item.price !== undefined && item.price !== null
                      ? `$${Number(item.price).toLocaleString()}`
                      : t('cart.priceOnRequest')}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                >
                  {t('cart.remove')}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-2xl text-gray-900">
            {t('cart.total')}: ${cartTotal.toLocaleString()}
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearCart}
              className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              {t('cart.clearCart')}
            </button>
            <button
              onClick={handleOpenCheckout}
              className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300"
            >
              {t('cart.checkout')}
            </button>
          </div>
        </div>

        {showCheckout &&
          createPortal(
            <div className="fixed inset-0 w-screen h-screen z-[9999] flex items-center justify-center bg-black/40 px-4">
              <div className="w-full max-w-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">{t('cart.checkoutForm.title')}</h2>
                <button
                  onClick={handleCloseCheckout}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={processing}
                >
                  <span className="sr-only">{t('cart.checkoutForm.close')}</span>
                  ×
                </button>
              </div>

              <form
                onSubmit={handlePayment}
                autoComplete="off"
                className="px-6 py-5 space-y-5"
              >
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
                    {t('cart.checkoutForm.customerInfo')}
                  </h3>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">{t('cart.checkoutForm.fullName')}</label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">{t('cart.checkoutForm.address')}</label>
                    <textarea
                      rows={2}
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                    {errors.address && (
                      <p className="mt-1 text-xs text-red-600">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">{t('cart.checkoutForm.phone')}</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-2 border-t border-gray-100">
                  <h3 className="text-sm font-semibold tracking-wide text-gray-700 uppercase">
                    {t('cart.checkoutForm.paymentDetails')}
                  </h3>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">{t('cart.checkoutForm.cardNumber')}</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="off"
                      name="fake-card-number"
                      value={form.cardNumber}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          cardNumber: formatCardNumber(e.target.value),
                        })
                      }
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-700 mb-1">{t('cart.checkoutForm.expiry')}</label>
                      <input
                        type="text"
                        autoComplete="off"
                        value={form.expiry}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            expiry: formatExpiry(e.target.value),
                          })
                        }
                        placeholder="08/27"
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                      />
                      {errors.expiry && (
                        <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>
                      )}
                      {expiryError && !errors.expiry && (
                        <p className="mt-1 text-xs text-red-600">{expiryError}</p>
                      )}
                    </div>
                    <div className="w-24">
                      <label className="block text-sm text-gray-700 mb-1">{t('cart.checkoutForm.cvv')}</label>
                      <input
                        type="password"
                        inputMode="numeric"
                        autoComplete="new-password"
                        value={form.cvv}
                        onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                        placeholder="123"
                        className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-900"
                      />
                      {errors.cvv && (
                        <p className="mt-1 text-xs text-red-600">{errors.cvv}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-700">
                    {t('cart.total')}:{' '}
                    <span className="text-lg text-gray-900 font-medium">
                      ${cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={processing}
                    className="px-6 py-2 bg-black text-white text-sm hover:bg-gray-800 transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {processing ? t('cart.checkoutForm.processing') : t('cart.checkoutForm.payNow')}
                  </button>
                </div>
              </form>
              </div>
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default Cart;


