'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, totalPrice, isLoaded, clearCart } = useCart();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (isLoaded && cartItems.length === 0) {
      router.replace('/cart');
    }
  }, [isLoaded, cartItems, router]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Valid 10-digit phone number is required';
    if (!formData.line1.trim()) newErrors.line1 = 'Address Line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Valid 6-digit pincode is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    if (!scriptLoaded) {
      showToast('Payment gateway is loading, please try again in a moment', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const FREE_SHIPPING_THRESHOLD = 499;
      const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
      const gst = totalPrice * 0.18;
      const finalTotal = Math.round(totalPrice + shipping + gst);

      // 1. Create Razorpay order on server
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: finalTotal })
      });
      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize payment');
      }

      // 2. Open Razorpay checkout modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: 'MyStore',
        description: 'Order Payment',
        order_id: orderData.data.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        theme: {
          color: '#764ba2'
        },
        handler: async function (response) {
          try {
            // 3. Verify payment signature on server
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerDetails: formData,
                cartItems: cartItems,
                subtotal: totalPrice,
                shipping,
                gst,
                total: finalTotal
              })
            });
            
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              // 4. Clear cart and redirect to order confirmation
              clearCart();
              showToast('Order placed successfully!', 'success');
              router.push(`/orders/${verifyData.orderId}`);
            } else {
              showToast(verifyData.error || 'Payment verification failed', 'error');
              setIsProcessing(false);
            }
          } catch (err) {
            console.error('Verification error:', err);
            showToast('An error occurred during verification', 'error');
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        showToast('Payment failed or was cancelled', 'error');
        setIsProcessing(false);
      });
      rzp.open();

    } catch (err) {
      console.error('Payment initialization error:', err);
      showToast(err.message || 'Error initializing payment', 'error');
      setIsProcessing(false);
    }
  };

  if (!isLoaded || cartItems.length === 0) return null;

  const FREE_SHIPPING_THRESHOLD = 499;
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : 49;
  const gst = totalPrice * 0.18;
  const finalTotal = Math.round(totalPrice + shipping + gst);

  const states = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi', 'Lakshadweep', 'Puducherry'
  ];

  return (
    <>
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        onLoad={() => setScriptLoaded(true)}
      />
      <div className={styles.container}>
        <h1 className={styles.title}>Secure Checkout</h1>
        
        <div className={styles.layout}>
          {/* LEFT: FORM */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Customer Details</h2>
            <form id="checkout-form" onSubmit={handlePayment} className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Full Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange}
                  className={`${styles.input} ${errors.name ? styles.error : ''}`} 
                  placeholder="John Doe"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.error : ''}`} 
                  placeholder="john@example.com"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input 
                  type="tel" name="phone" value={formData.phone} onChange={handleChange}
                  className={`${styles.input} ${errors.phone ? styles.error : ''}`} 
                  placeholder="9876543210" maxLength="10"
                />
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Address Line 1</label>
                <input 
                  type="text" name="line1" value={formData.line1} onChange={handleChange}
                  className={`${styles.input} ${errors.line1 ? styles.error : ''}`} 
                  placeholder="Flat, House no., Building"
                />
                {errors.line1 && <span className={styles.errorText}>{errors.line1}</span>}
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.label}>Address Line 2 (Optional)</label>
                <input 
                  type="text" name="line2" value={formData.line2} onChange={handleChange}
                  className={styles.input} 
                  placeholder="Area, Street, Sector, Village"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>City</label>
                <input 
                  type="text" name="city" value={formData.city} onChange={handleChange}
                  className={`${styles.input} ${errors.city ? styles.error : ''}`} 
                  placeholder="Mumbai"
                />
                {errors.city && <span className={styles.errorText}>{errors.city}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>State</label>
                <select 
                  name="state" value={formData.state} onChange={handleChange}
                  className={`${styles.input} ${errors.state ? styles.error : ''}`}
                >
                  <option value="">Select State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <span className={styles.errorText}>{errors.state}</span>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Pincode</label>
                <input 
                  type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                  className={`${styles.input} ${errors.pincode ? styles.error : ''}`} 
                  placeholder="400001" maxLength="6"
                />
                {errors.pincode && <span className={styles.errorText}>{errors.pincode}</span>}
              </div>
            </form>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className={styles.section} style={{ alignSelf: 'start', position: 'sticky', top: '100px' }}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.productId} className={styles.summaryItem}>
                  <img src={item.image} alt={item.name} className={styles.itemImage} />
                  <div className={styles.itemDetails}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemQty}>Qty: {item.quantity}</div>
                  </div>
                  <div className={styles.itemPrice}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>GST (18%)</span>
                <span>₹{gst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total to Pay</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button 
              type="submit" 
              form="checkout-form"
              className={styles.payBtn}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg style={{ animation: 'spin 1s linear infinite' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Pay ₹{finalTotal.toLocaleString('en-IN')} Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
