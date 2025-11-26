import { useState, useEffect } from 'react';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '../services/couponService';
import AdminSidebar from '../components/AdminSidebar';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minBookingAmount: '',
        maxDiscount: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        usageLimit: '',
        applicableTo: 'all',
        carTypes: [],
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const data = await getAllCoupons();
            setCoupons(data.data);
        } catch (error) {
            toast.error('Failed to fetch coupons');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'carTypes') {
            const selectedTypes = Array.from(e.target.selectedOptions, option => option.value);
            setFormData({ ...formData, carTypes: selectedTypes });
        } else {
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const couponData = {
                ...formData,
                code: formData.code.toUpperCase(),
                discountValue: Number(formData.discountValue),
                minBookingAmount: Number(formData.minBookingAmount) || 0,
                maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
            };

            if (editingCoupon) {
                await updateCoupon(editingCoupon._id, couponData);
                toast.success('Coupon updated successfully');
            } else {
                await createCoupon(couponData);
                toast.success('Coupon created successfully');
            }

            setShowModal(false);
            resetForm();
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save coupon');
        }
    };

    const handleEdit = (coupon) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            minBookingAmount: coupon.minBookingAmount,
            maxDiscount: coupon.maxDiscount || '',
            validFrom: new Date(coupon.validFrom).toISOString().split('T')[0],
            validUntil: new Date(coupon.validUntil).toISOString().split('T')[0],
            usageLimit: coupon.usageLimit || '',
            applicableTo: coupon.applicableTo,
            carTypes: coupon.carTypes || [],
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            try {
                await deleteCoupon(id);
                toast.success('Coupon deleted successfully');
                fetchCoupons();
            } catch (error) {
                toast.error('Failed to delete coupon');
            }
        }
    };

    const handleToggleStatus = async (coupon) => {
        try {
            await updateCoupon(coupon._id, { isActive: !coupon.isActive });
            toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`);
            fetchCoupons();
        } catch (error) {
            toast.error('Failed to update coupon status');
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            discountType: 'percentage',
            discountValue: '',
            minBookingAmount: '',
            maxDiscount: '',
            validFrom: new Date().toISOString().split('T')[0],
            validUntil: '',
            usageLimit: '',
            applicableTo: 'all',
            carTypes: [],
        });
        setEditingCoupon(null);
    };

    const carTypeOptions = ['Sedan', 'SUV', 'Hatchback', 'Luxury', 'Sports', 'Electric'];

    return (
        <div className="flex min-h-screen bg-gray-50">
            <AdminSidebar activePage="Coupons" />

            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Manage Coupons</h1>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                        className="btn-primary flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Add Coupon
                    </button>
                </div>

                {/* Coupons Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : coupons.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No coupons yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valid Until</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {coupons.map((coupon) => (
                                        <tr key={coupon._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 font-semibold text-primary-600">{coupon.code}</td>
                                            <td className="px-6 py-4 capitalize">{coupon.discountType}</td>
                                            <td className="px-6 py-4">
                                                {coupon.discountType === 'percentage'
                                                    ? `${coupon.discountValue}%`
                                                    : `₹${coupon.discountValue}`}
                                            </td>
                                            <td className="px-6 py-4">₹{coupon.minBookingAmount}</td>
                                            <td className="px-6 py-4">{new Date(coupon.validUntil).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                {coupon.usedCount} / {coupon.usageLimit || '∞'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleToggleStatus(coupon)}
                                                    className="flex items-center"
                                                >
                                                    {coupon.isActive ? (
                                                        <FaToggleOn className="text-green-600 text-2xl" />
                                                    ) : (
                                                        <FaToggleOff className="text-gray-400 text-2xl" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(coupon)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coupon._id)}
                                                        className="text-red-600 hover:text-red-800"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                            <h2 className="text-2xl font-bold mb-6">
                                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Coupon Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            value={formData.code}
                                            onChange={handleChange}
                                            required
                                            className="input-field uppercase"
                                            placeholder="SUMMER2024"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Discount Type *
                                        </label>
                                        <select
                                            name="discountType"
                                            value={formData.discountType}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        >
                                            <option value="percentage">Percentage</option>
                                            <option value="fixed">Fixed Amount</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Discount Value *
                                        </label>
                                        <input
                                            type="number"
                                            name="discountValue"
                                            value={formData.discountValue}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="input-field"
                                            placeholder={formData.discountType === 'percentage' ? '10' : '500'}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Min Booking Amount
                                        </label>
                                        <input
                                            type="number"
                                            name="minBookingAmount"
                                            value={formData.minBookingAmount}
                                            onChange={handleChange}
                                            min="0"
                                            className="input-field"
                                            placeholder="1000"
                                        />
                                    </div>

                                    {formData.discountType === 'percentage' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Discount (₹)
                                            </label>
                                            <input
                                                type="number"
                                                name="maxDiscount"
                                                value={formData.maxDiscount}
                                                onChange={handleChange}
                                                min="0"
                                                className="input-field"
                                                placeholder="500"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valid From *
                                        </label>
                                        <input
                                            type="date"
                                            name="validFrom"
                                            value={formData.validFrom}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valid Until *
                                        </label>
                                        <input
                                            type="date"
                                            name="validUntil"
                                            value={formData.validUntil}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Usage Limit
                                        </label>
                                        <input
                                            type="number"
                                            name="usageLimit"
                                            value={formData.usageLimit}
                                            onChange={handleChange}
                                            min="1"
                                            className="input-field"
                                            placeholder="Unlimited"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Applicable To *
                                        </label>
                                        <select
                                            name="applicableTo"
                                            value={formData.applicableTo}
                                            onChange={handleChange}
                                            required
                                            className="input-field"
                                        >
                                            <option value="all">All Cars</option>
                                            <option value="specific">Specific Types</option>
                                        </select>
                                    </div>

                                    {formData.applicableTo === 'specific' && (
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Car Types *
                                            </label>
                                            <select
                                                name="carTypes"
                                                multiple
                                                value={formData.carTypes}
                                                onChange={handleChange}
                                                required
                                                className="input-field"
                                                size="4"
                                            >
                                                {carTypeOptions.map(type => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn-primary">
                                        {editingCoupon ? 'Update' : 'Create'} Coupon
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCoupons;
