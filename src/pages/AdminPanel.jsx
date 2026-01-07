import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';
import { api } from '../services/api';
import ArtCard from '../components/ArtCard';

const compressImage = (file) => {
  const MAX_SIZE = 800;
  const QUALITY = 0.6;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > height && width > MAX_SIZE) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else if (height >= width && height > MAX_SIZE) {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', QUALITY);
        resolve(compressedDataUrl);
      };
      img.onerror = reject;
      img.src = reader.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const AdminPanel = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('artworks'); // 'artworks' | 'orders'
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    price: '',
    category: '',
    image: null
  });
  
  const categoryMap = {
    'Landscape': t('gallery.categories.landscape'),
    'Portrait': t('gallery.categories.portrait'),
    'Abstract': t('gallery.categories.abstract'),
  };
  
  const statusMap = {
    'New': t('admin.orders.statuses.new'),
    'Processing': t('admin.orders.statuses.processing'),
    'Shipped': t('admin.orders.statuses.shipped'),
    'Delivered': t('admin.orders.statuses.delivered'),
    'Cancelled': t('admin.orders.statuses.cancelled'),
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchArtworks();
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab, user]);

  const fetchArtworks = async () => {
    try {
      const arts = await api.artworks.getAll();
      setArtworks(arts);
    } catch (error) {
      console.error('Error fetching artworks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const loaded = await api.orders.getAll();
      setOrders(loaded);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '-';
    const ms = ts.seconds ? ts.seconds * 1000 : ts._seconds ? ts._seconds * 1000 : null;
    if (!ms) return '-';
    const d = new Date(ms);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${mins}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'text-blue-600';
      case 'Processing':
        return 'text-purple-600';
      case 'Shipped':
        return 'text-orange-600';
      case 'Delivered':
        return 'text-green-600';
      case 'Cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      await api.orders.updateStatus(orderId, newStatus);

      if (newStatus === 'Cancelled') {
        toast.success(t('admin.orders.success.cancelled'));
      } else {
        toast.success(t('admin.orders.success.updated'));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(t('admin.orders.error.update'));
      fetchOrders();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = '';

      if (formData.image) {
        imageUrl = await compressImage(formData.image);
      }

      await api.artworks.create({
        title: formData.title,
        artist: formData.artist,
        price: parseFloat(formData.price) || 0,
        category: formData.category,
        imageUrl: imageUrl,
      });

      setFormData({ title: '', artist: '', price: '', category: '', image: null });
      setShowForm(false);
      fetchArtworks();
      toast.success(t('admin.artworks.success.published'));
    } catch (error) {
      console.error('Error adding artwork:', error);
      toast.error(t('admin.artworks.error.add'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('admin.artworks.deleteConfirm'))) {
      try {
        await api.artworks.delete(id);
        fetchArtworks();
        toast.success(t('admin.artworks.success.deleted'));
      } catch (error) {
        console.error('Error deleting artwork:', error);
        toast.error(t('admin.artworks.error.delete'));
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">{t('admin.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <h1 className="text-4xl font-light text-gray-900">{t('admin.title')}</h1>
          <div className="inline-flex rounded-none border border-gray-200 bg-white overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab('artworks')}
              className={`px-4 py-2 text-sm border-r border-gray-200 transition-colors ${
                activeTab === 'artworks'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {t('admin.tabs.artworks')}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              }`}
            >
              {t('admin.tabs.orders')}
            </button>
          </div>
        </div>

        {activeTab === 'artworks' && (
          <>
            <div className="flex justify-end mb-8">
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-6 py-2 border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors duration-300"
              >
                {showForm ? t('admin.artworks.cancel') : t('admin.artworks.addArtwork')}
              </button>
            </div>

            {showForm && (
              <div className="flex justify-center mb-12">
                <form onSubmit={handleSubmit} className="w-full max-w-md bg-white border border-gray-200 p-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-8 text-center">{t('admin.artworks.formTitle')}</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.artworks.title')}
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.artworks.artist')}
                      </label>
                      <input
                        type="text"
                        name="artist"
                        value={formData.artist}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.artworks.price')}
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.artworks.category')}
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                      >
                        <option value="">{t('admin.artworks.selectCategory')}</option>
                        <option value="Landscape">{t('gallery.categories.landscape')}</option>
                        <option value="Portrait">{t('gallery.categories.portrait')}</option>
                        <option value="Abstract">{t('gallery.categories.abstract')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t('admin.artworks.image')}
                      </label>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="w-full px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? t('admin.artworks.publishing') : t('admin.artworks.publish')}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artworks.map((art) => (
                <div key={art.id} className="relative group">
                  <ArtCard art={art} />
                  <button
                    onClick={() => handleDelete(art.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {t('admin.artworks.delete')}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'orders' && (
          <div className="mt-4">
            {ordersLoading ? (
              <div className="py-16 flex items-center justify-center">
                <p className="text-gray-600">{t('admin.orders.loading')}</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="py-16 text-center text-gray-600">{t('admin.orders.noOrders')}</div>
            ) : (
              <div className="overflow-x-auto bg-white border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.orders.date')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.orders.customer')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.orders.phone')}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.orders.total')}
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.orders.items')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.orders.status')}
                      </th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order, idx) => (
                      <>
                        <tr
                          key={order.id}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatTimestamp(order.createdAt)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {order.customer?.fullName || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {order.customer?.phone || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 text-right">
                            {order.total !== undefined && order.total !== null
                              ? `$${Number(order.total).toLocaleString()}`
                              : '-'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700 text-center">
                            {order.items?.length || 0}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <select
                              value={order.status || 'New'}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-gray-900 ${getStatusColor(order.status || 'New')}`}
                            >
                              <option value="New">{t('admin.orders.statuses.new')}</option>
                              <option value="Processing">{t('admin.orders.statuses.processing')}</option>
                              <option value="Shipped">{t('admin.orders.statuses.shipped')}</option>
                              <option value="Delivered">{t('admin.orders.statuses.delivered')}</option>
                              <option value="Cancelled">{t('admin.orders.statuses.cancelled')}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-right text-sm">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedOrderId(
                                  expandedOrderId === order.id ? null : order.id
                                )
                              }
                              className="text-gray-700 hover:text-gray-900 underline"
                            >
                              {expandedOrderId === order.id ? t('admin.orders.hideDetails') : t('admin.orders.viewDetails')}
                            </button>
                          </td>
                        </tr>
                        {expandedOrderId === order.id && order.items && order.items.length > 0 && (
                          <tr className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td
                              colSpan={7}
                              className="px-4 pb-4 pt-1 text-sm text-gray-700"
                            >
                              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {order.items.map((item) => (
                                  <div
                                    key={item.id}
                                    className="flex items-center gap-3 border border-gray-200 p-2 bg-white"
                                  >
                                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center overflow-hidden">
                                      {item.imageUrl ? (
                                        <img
                                          src={item.imageUrl}
                                          alt={item.title}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span className="text-xs text-gray-400">{t('cart.noImage')}</span>
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm text-gray-900">{item.title}</p>
                                      {item.artist && (
                                        <p className="text-xs text-gray-600">{item.artist}</p>
                                      )}
                                      {item.price !== undefined && item.price !== null && (
                                        <p className="text-xs text-gray-800">
                                          ${Number(item.price).toLocaleString()}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;

