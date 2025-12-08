# 🎉 Hướng Dẫn Sử Dụng Trang Donate - VietQR Enhanced

## ✨ Tính Năng Mới

### 📱 **VietQR Tương Tác Hoàn Chỉnh**

#### 1. **Nút Mệnh Giá Nhanh** (Quick Amount)

6 mức mệnh giá được thiết lập sẵn:

- ✅ 10,000đ
- ✅ 20,000đ
- ✅ 50,000đ
- ✅ 100,000đ
- ✅ 200,000đ
- ✅ 500,000đ

**Cách sử dụng:**

- Click vào một nút → Mã QR tự động cập nhật với số tiền đã chọn
- Nút được chọn sẽ có hiệu ứng gradient màu tím-xanh

#### 2. **Tùy Chỉnh Mệnh Giá & Nội Dung**

Hai ô input cho phép người dùng tùy chỉnh:

**📝 Mệnh Giá Tùy Chỉnh:**

- Nhập bất kỳ số tiền nào (VND)
- Khi nhập số tiền tùy chỉnh, các nút nhanh sẽ tự động bỏ chọn

**💬 Nội Dung Chuyển Khoản:**

- Mặc định: "Donate MediaDown"
- Có thể thay đổi thành bất kỳ nội dung nào
- Giới hạn ký tự của VietQR API

**🔄 Nút "Tạo Mã QR Mới":**

- Click để tạo mã QR mới với thông tin vừa nhập
- Mã QR sẽ cập nhật ngay lập tức

#### 3. **Tải Mã QR**

Nút **"Tải Mã QR"** (Download QR Code):

- Click để tải ảnh QR code về máy
- File tải về: `vietqr-donate.jpg`
- Định dạng: JPG, chất lượng cao
- Có thể chia sẻ trực tiếp qua mạng xã hội

#### 4. **Thông Tin Ngân Hàng**

Hiển thị đầy đủ:

- 🏦 Tên ngân hàng: **OCB - Orient Commercial Bank**
- 👤 Tên tài khoản: **NGUYEN VAN A** (cần cập nhật)
- 🔢 Số tài khoản: **0123456789** (cần cập nhật)
- 📋 Nút copy số tài khoản nhanh

---

## 🎨 **Layout 2 Cột**

### Cột Trái - Donation Methods

1. **Zypage**

   - Link trực tiếp đến profile
   - Nút "Truy Cập Zypage"

2. **VietQR OCB**
   - Mã QR hiển thị lớn
   - Nút tải QR
   - 6 nút mệnh giá nhanh
   - 2 ô input tùy chỉnh
   - Nút tạo mã mới
   - Thông tin ngân hàng chi tiết

### Cột Phải - Share with Friends

- **Copy Link** website
- **QR Code** website (có thể show/hide)
- **Tải QR Code** website
- **Chia sẻ mạng xã hội:**
  - Facebook
  - Twitter
  - Telegram
  - WhatsApp
  - LinkedIn

### Thiết Kế Responsive

- **Desktop (≥1024px):** 2 cột song song, bằng chiều cao
- **Tablet/Mobile (<1024px):** 1 cột xếp chồng
- Cả 2 cột đều có `flex-1` để đảm bảo chiều cao bằng nhau

---

## ⚙️ **Cấu Hình VietQR**

### Cập Nhật Thông Tin Ngân Hàng

Mở file: `app/donate/page.tsx`

Tìm và chỉnh sửa từ **dòng 24-28:**

```typescript
const bankInfo = {
  bankCode: "970448", // Mã ngân hàng OCB (KHÔNG THAY ĐỔI)
  accountNumber: "0123456789", // ⚠️ THAY BẰNG SỐ TÀI KHOẢN THẬT
  accountName: "NGUYEN VAN A", // ⚠️ THAY BẰNG TÊN TÀI KHOẢN THẬT (VIẾT HOA)
  defaultMessage: "Donate MediaDown", // Nội dung mặc định
};
```

### Tùy Chỉnh Mệnh Giá Nhanh

Tìm **dòng 31-38** để thay đổi các mức mệnh giá:

```typescript
const quickAmounts = [
  { value: "10000", label: "10,000đ" },
  { value: "20000", label: "20,000đ" },
  { value: "50000", label: "50,000đ" },
  // Thêm hoặc sửa theo ý muốn:
  { value: "1000000", label: "1,000,000đ" },
];
```

---

## 🔄 **Luồng Hoạt Động**

### Kịch Bản 1: Chọn Mệnh Giá Nhanh

1. Người dùng vào trang Donate
2. Xem mã QR mặc định (không có số tiền)
3. Click vào nút **"20,000đ"**
4. Mã QR tự động cập nhật với amount=20000
5. Click **"Tải Mã QR"** để lưu về máy
6. Share mã QR cho người khác quét

### Kịch Bản 2: Tùy Chỉnh Hoàn Toàn

1. Người dùng nhập số tiền tùy ý: **75000**
2. Nhập nội dung: **"Ung ho du an MediaDown"**
3. Click **"Tạo Mã QR Mới"**
4. Mã QR được tạo với thông tin tùy chỉnh
5. Tải về hoặc quét trực tiếp bằng app ngân hàng

### Kịch Bản 3: Chia Sẻ Website

1. Scroll xuống cột bên phải
2. Click **"Copy Link"** để copy URL website
3. Hoặc click **"Show QR Code"**
4. Tải QR code website về
5. Share trên Facebook, Twitter, etc.

---

## 🎯 **Điểm Nổi Bật**

### ✅ Trải Nghiệm Người Dùng

- **Tương tác ngay lập tức** - Không cần reload trang
- **Linh hoạt tối đa** - Chọn nhanh HOẶC tùy chỉnh
- **Tiện lợi** - Tải QR về máy, chia sẻ dễ dàng

### ✅ Giao Diện

- **Glassmorphism** - Hiệu ứng kính mờ hiện đại
- **Gradient buttons** - Nút gradient đẹp mắt
- **Responsive** - Hoạt động tốt trên mọi thiết bị
- **2 cột cân bằng** - Layout chuyên nghiệp

### ✅ Chức Năng

- **VietQR API** - Tích hợp hoàn chỉnh
- **Share component** - Tái sử dụng được
- **Copy to clipboard** - Tiện ích
- **Download QR** - Lưu trữ offline

---

## 🔧 **Kỹ Thuật**

### State Management

```typescript
const [customAmount, setCustomAmount] = useState('');
const [customMessage, setCustomMessage] = useState('');
const [selectedAmount, setSelectedAmount] = useState('');
const [currentQRUrl, setCurrentQRUrl] = useState(...);
```

### VietQR URL Generation

```typescript
const getVietQRUrl = (amount: string, message: string) => {
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(
    message
  )}&accountName=${encodeURIComponent(accountName)}`;
};
```

### Grid Layout

```css
grid-cols-1 lg:grid-cols-2  /* 1 cột mobile, 2 cột desktop */
gap-6                       /* Khoảng cách giữa các cột */
```

---

## 📊 **Testing Checklist**

### ✅ VietQR Features

- [ ] Click các nút mệnh giá nhanh
- [ ] Nhập số tiền tùy chỉnh
- [ ] Nhập nội dung tùy chỉnh
- [ ] Click "Tạo Mã QR Mới"
- [ ] Click "Tải Mã QR"
- [ ] Quét QR bằng app ngân hàng (nếu đã có STK thật)
- [ ] Copy số tài khoản

### ✅ Share Features

- [ ] Copy link website
- [ ] Show/Hide QR code website
- [ ] Download QR code website
- [ ] Test các nút share mạng xã hội

### ✅ Responsive

- [ ] Test trên desktop (≥1024px)
- [ ] Test trên tablet (768-1023px)
- [ ] Test trên mobile (<768px)

---

## 🚀 **Các Tính Năng Có Thể Mở Rộng**

### Gợi Ý Nâng Cấp Tiếp Theo:

1. **Lịch Sử Donate**

   - Lưu các mệnh giá đã chọn
   - Hiển thị tổng số tiền donate

2. **Leaderboard**

   - Top donors (nếu tích hợp backend)
   - Badge cho donors

3. **Payment Confirmation**

   - Upload screenshot chuyển khoản
   - Verify transaction

4. **Multiple Banks**

   - Thêm Vietcombank, VPBank, etc.
   - Người dùng chọn ngân hàng ưa thích

5. **Crypto Option**
   - Thêm lại crypto wallet option
   - Multi-currency support

---

## 📞 **Support**

Nếu có vấn đề:

1. Check browser console (F12)
2. Verify thông tin ngân hàng đã cập nhật đúng
3. Test VietQR URL trực tiếp trong trình duyệt
4. Đảm bảo internet connection cho VietQR API

---

**🎉 Trang Donate đã sẵn sàng sử dụng tại: http://localhost:3000/donate**
