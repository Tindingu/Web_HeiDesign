# Hướng Dẫn Viết Tài Liệu Word Để Render Đẹp Trên Website

Tài liệu này hướng dẫn **chi tiết từng bước** cách viết bài viết trong **Microsoft Word** sao cho khi upload lên website, nó sẽ render **cực kỳ đẹp** với định dạng chuyên nghiệp.

---

## 📋 Mục Lục

1. [Chuẩn Bị File Word](#chuẩn-bị-file-word)
2. [Định Dạng Tiêu Đề](#định-dạng-tiêu-đề)
3. [Danh Sách & Gạch Đầu Dòng](#danh-sách--gạch-đầu-dòng)
4. [Chèn Ảnh & Caption](#chèn-ảnh--caption)
5. [Tạo Bảng](#tạo-bảng)
6. [Định Dạng Chữ (Bold, Italic, Highlight)](#định-dạng-chữ)
7. [Chia Cột & Không Gian](#chia-cột--không-gian)
8. [Ví Dụ Hoàn Chỉnh](#ví-dụ-hoàn-chỉnh)
9. [Lỗi Thường Gặp & Cách Khắc Phục](#lỗi-thường-gặp--cách-khắc-phục)
10. [Kiểm Tra Trước Khi Upload](#kiểm-tra-trước-khi-upload)

---

## 1. Chuẩn Bị File Word

### 1.1 Tạo File Mới

1. **Mở Microsoft Word**
2. **Chọn** Template `Blank Document` (Tài liệu trắng)
3. **Lưu file** với tên rõ ràng, ví dụ: `Du-An-Thiet-Ke-Noi-That-Phong-Khach.docx`

### 1.2 Cấu Hình Trang

Hãy đặt lề trang chuẩn để tài liệu dễ đọc:

**Bước 1:** Vào menu `Layout` (Bố cục)

**Bước 2:** Chọn `Margins` (Lề)

**Bước 3:** Chọn `Normal` (1.27 cm mọi phía) - đây là lề chuẩn

```
┌─────────────────────────┐
│   Lề trên: 1.27 cm     │
│   Lề trái: 1.27 cm     │
│   Lề phải: 1.27 cm     │
│   Lề dưới: 1.27 cm     │
└─────────────────────────┘
```

### 1.3 Chọn Font

**Khuyến nghị dùng font:**

- **Title/Heading:** Calibri, Arial hoặc Times New Roman, kích thước 14-16pt
- **Body text:** Calibri, Arial, kích thước 11pt
- **Lưu ý:** Không dùng font tiếng Việt như "VNI-Times", "Vn Art" vì không tương thích trên web

**Cách đặt font mặc định cho toàn tài liệu:**

1. Bôi đen **toàn bộ** nội dung: `Ctrl+A`
2. Chọn Font: `Calibri`
3. Chọn kích thước: `11pt`

---

## 2. Định Dạng Tiêu Đề

Tiêu đề là **rất quan trọng** vì nó giúp người đọc nhanh chóng hiểu cấu trúc tài liệu.

### 2.1 Tiêu Đề H1 (Tiêu Đề Chính)

**Mục đích:** Tiêu đề lớn nhất, chỉ dùng **1 lần** ở đầu tài liệu để đặt tên dự án.

**Cách làm:**

1. **Viết tiêu đề** (ví dụ: "Thiết Kế Nội Thất Hiện Đại Cho Căn Hộ 3 Phòng Ngủ")
2. **Bôi đen** dòng tiêu đề
3. Vào menu `Home` (Trang chủ)
4. Tìm mục `Styles` (Kiểu)
5. **Chọn `Heading 1`**

```
Thiết Kế Nội Thất Hiện Đại Cho Căn Hộ 3 Phòng Ngủ
↓
Áp dụng Heading 1
↓
[Kết quả] - Chữ to, đậm, màu xanh
```

**Kết quả render trên web:**

- Font: TO & ĐẬM
- Màu: Tùy chủ đề website (thường là xanh đậm)
- Kích thước: Cỡ H1 (≈ 32-36px)

### 2.2 Tiêu Đề H2 (Tiêu Đề Section Chính)

**Mục đích:** Tiêu đề cho mỗi phòng hoặc mục chính (Phòng Khách, Phòng Bếp, v.v.)

**Cách làm:**

1. **Viết tiêu đề** (ví dụ: "Phòng Khách - Không Gian Tiếp Khách")
2. **Bôi đen** dòng tiêu đề
3. Vào menu `Home`
4. Chọn `Heading 2`

```
Phòng Khách - Không Gian Tiếp Khách
↓
Áp dụng Heading 2
↓
[Kết quả] - Chữ cỡ vừa, đậm
```

**Kết quả render trên web:**

- Font: VỪA & ĐẬM
- Kích thước: Cỡ H2 (≈ 24-28px)
- Có thể có ID tự động để dùng cho mục lục

### 2.3 Tiêu Đề H3 (Tiêu Đề Chi Tiết)

**Mục đích:** Tiêu đề cho các chi tiết nhỏ hơn (Vật Liệu, Bảng Màu, Đèn Chiếu Sáng, v.v.)

**Cách làm:**

1. **Viết tiêu đề** (ví dụ: "Vật Liệu Sử Dụng")
2. **Bôi đen** dòng
3. Vào menu `Home`
4. Chọn `Heading 3`

```
Vật Liệu Sử Dụng
↓
Áp dụng Heading 3
↓
[Kết quả] - Chữ nhỏ hơn H2, vẫn đậm
```

**Kết quả render trên web:**

- Font: NHỎ HƠN H2 & ĐẬM
- Kích thước: Cỡ H3 (≈ 18-22px)

### 2.4 Ví Dụ Cấu Trúc Tiêu Đề Đúng

```
Thiết Kế Nội Thất Hiện Đại Cho Căn Hộ 3 Phòng Ngủ  [Heading 1]

    Giới Thiệu Dự Án                               [Heading 2]

    Thông tin cơ bản...                            [Normal text]

    Phòng Khách - Không Gian Tiếp Khách           [Heading 2]

    Mô tả phòng khách...                           [Normal text]

    ### Vật Liệu Sử Dụng                           [Heading 3]

    - Gỗ sồi                                       [Bullet list]
    - Thạch cao

    ### Bảng Màu                                   [Heading 3]

    [Bảng]                                         [Table]
```

---

## 3. Danh Sách & Gạch Đầu Dòng

Danh sách giúp nội dung dễ đọc và có cấu trúc rõ ràng.

### 3.1 Danh Sách Không Thứ Tự (Bullet List)

**Mục đích:** Liệt kê các item không cần thứ tự (vật liệu, tính năng, v.v.)

**Cách làm:**

**Cách 1 - Dùng nút Bullet List:**

1. Đặt con trỏ vào vị trí muốn thêm danh sách
2. Vào menu `Home`
3. Tìm nút `Bullet List` (gạch đầu dòng - biểu tượng ● ● ●)
4. Bấm vào danh sách kiểu `Bullet` mà bạn muốn

```
Bấm vào "Bullet List"
↓
Chọn kiểu gạch: ● (tròn) hoặc ○ (vòng) hoặc ■ (vuông)
↓
Bắt đầu nhập danh sách
```

**Cách 2 - Nhập trực tiếp:**

1. Nhập `- ` (dấu trừ + khoảng trắng) + nội dung
2. Nhấn `Enter`
3. Word sẽ tự động tạo bullet tiếp theo

**Ví dụ:**

```
Vật Liệu Sử Dụng
- Gỗ sồi nhập khẩu từ Bắc Âu
- Thạch cao chống cháy loại A
- Sơn Dulux Premium cao cấp
- Rèm vải linen tự nhiên

[Sau khi áp dụng Bullet List, render sẽ là:]

Vật Liệu Sử Dụng
• Gỗ sồi nhập khẩu từ Bắc Âu
• Thạch cao chống cháy loại A
• Sơn Dulux Premium cao cấp
• Rèm vải linen tự nhiên
```

### 3.2 Danh Sách Có Thứ Tự (Numbered List)

**Mục đích:** Liệt kê các bước, quy trình, ưu tiên (cần hiển thị thứ tự)

**Cách làm:**

1. Vào menu `Home`
2. Tìm nút `Numbered List` (số thứ tự - biểu tượng 1 2 3)
3. Chọn kiểu số: `1.` hoặc `1)` hoặc `I.` v.v.

```
Quy Trình Thi Công
1. Khảo sát hiện trạng và lấy kích thước
2. Thiết kế 3D và xin phê duyệt khách hàng
3. Lên kế hoạch thi công chi tiết
4. Thi công và giám sát chất lượng
5. Bàn giao và hướng dẫn sử dụng

[Sau khi áp dụng Numbered List, render sẽ là:]

Quy Trình Thi Công
1. Khảo sát hiện trạng và lấy kích thước
2. Thiết kế 3D và xin phê duyệt khách hàng
3. Lên kế hoạch thi công chi tiết
4. Thi công và giám sát chất lượng
5. Bàn giao và hướng dẫn sử dụng
```

### 3.3 Danh Sách Lồng (Nested List)

**Mục đích:** Danh sách có các cấp con (danh sách con của danh sách)

**Cách làm:**

1. Nhập một danh sách bình thường
2. Để danh sách con, **nhấn `Tab`** trước khi nhập item con
3. Để quay lại cấp cha, **nhấn `Shift+Tab`**

**Ví dụ:**

```
Hệ Thống Chiếu Sáng
- Đèn trần chính
    - LED panel 60W
    - Có thể điều chỉnh cường độ
- Đèn tường
    - 2 chiếc mỗi bên
    - Dùng để đọc sách
- Đèn trang trí
    - 4 chiếc downlight nhỏ
    - Quanh bộ sofa
```

---

## 4. Chèn Ảnh & Caption

Ảnh là yếu tố **rất quan trọng** để tài liệu trông chuyên nghiệp.

### 4.1 Chèn Ảnh

**Bước 1:** Đặt con trỏ vào vị trí muốn chèn ảnh

**Bước 2:** Vào menu `Insert` (Chèn)

**Bước 3:** Chọn `Pictures` (Hình ảnh)

**Bước 4:** Chọn `This Device` (Từ máy tính)

**Bước 5:** Chọn file ảnh từ thư mục

```
Kết quả: Ảnh được chèn vào tài liệu
```

### 4.2 Định Dạng Ảnh

Sau khi chèn ảnh, bạn nên **định dạng lại** để nó đẹp:

**Kích Thước Ảnh:**

1. **Click vào ảnh** để chọn
2. Vào tab `Picture Format` (Định dạng Hình Ảnh) - xuất hiện khi chọn ảnh
3. Kéo góc ảnh để **resize** hoặc nhập chiều rộng/cao cụ thể

**Khuyến nghị:**

- Ảnh toàn cảnh phòng: Độ rộng = **100% trang** (khoảng 15-18cm)
- Ảnh chi tiết: Độ rộng = **50-75% trang** (khoảng 10-12cm)

**Căn Chỉnh Ảnh:**

1. **Click vào ảnh**
2. Vào menu `Home`
3. Tìm `Align` (Căn lề)
4. Chọn `Center` (Giữa trang) - thường là lựa chọn tốt nhất

```
[Ảnh được căn giữa trang]
```

### 4.3 Thêm Caption (Chú Thích Dưới Ảnh)

**Mục đích:** Caption giúp giải thích ảnh là gì, nó render thành figcaption trên web.

**Bước 1:** **Click phải vào ảnh**

**Bước 2:** Chọn `Insert Caption...` (Chèn Chú Thích)

**Bước 3:** Một hộp thoại sẽ xuất hiện:

```
┌─────────────────────────────────────────┐
│ Insert Caption                          │
├─────────────────────────────────────────┤
│ Caption: [Phòng khách toàn cảnh]       │
│ Label: Figure (hoặc Image)             │
│ Position: Below selected item (dưới)   │
│ [OK]  [Cancel]                         │
└─────────────────────────────────────────┘
```

**Bước 4:** Sửa **Caption** thành mô tả ảnh:

- Nếu Word tự thêm "Hình 1", bạn có thể xóa nó
- Viết mô tả ngắn, rõ ràng
- Ví dụ: `Phòng khách với bộ sofa gỗ sồi` hoặc `Chi tiết tủ tvi âm tường`

**Bước 5:** Bấm `OK`

```
Kết quả: Caption xuất hiện dưới ảnh
```

### 4.4 Ví Dụ Hoàn Chỉnh Chèn Ảnh

```
Phòng Khách - Không Gian Tiếp Khách     [Heading 2]

Phòng khách được thiết kế để là trái
tim của căn hộ...                        [Normal text]

[ẢNH - căn giữa trang]
Phòng khách toàn cảnh với ánh sáng tự nhiên từ cửa sổ  [Caption]

### Vật Liệu Sử Dụng    [Heading 3]

- Gỗ sồi...
- Thạch cao...
```

---

## 5. Tạo Bảng

Bảng giúp so sánh thông tin một cách rõ ràng và chuyên nghiệp.

### 5.1 Chèn Bảng

**Bước 1:** Đặt con trỏ vào vị trí muốn chèn bảng

**Bước 2:** Vào menu `Insert` (Chèn)

**Bước 3:** Chọn `Table` (Bảng)

**Bước 4:** Chọn kích thước bảng

```
Ví dụ: Click vào ô ở hàng thứ 3, cột thứ 4
↓
Bảng 3x4 được tạo
```

**Hoặc dùng `Insert Table` để có kiểm soát chính xác:**

```
┌─────────────────────────────────────────┐
│ Insert Table                            │
├─────────────────────────────────────────┤
│ Number of columns: [5]  (5 cột)        │
│ Number of rows: [4]     (4 hàng)       │
│ [OK]  [Cancel]                         │
└─────────────────────────────────────────┘
```

### 5.2 Điền Dữ Liệu Vào Bảng

1. **Click vào ô đầu tiên**
2. **Gõ nội dung**
3. **Nhấn `Tab`** để chuyển sang ô tiếp theo
4. **Tiếp tục** cho đến hết

```
| Vật Liệu   | Ưu Điểm         | Nhược Điểm    |
|------------|-----------------|--------------|
| Gỗ sồi     | Sang trọng, bền | Dễ bị trầy   |
| Laminate   | Dễ vệ sinh      | Không bền    |
| Thạch cao  | Có thể tạo hình | Dễ nứt       |
```

### 5.3 Định Dạng Bảng

**Tô Màu Hàng Đầu (Header):**

1. **Chọn hàng đầu** (hàng tiêu đề)
2. Vào menu `Design` (Thiết Kế) hoặc `Table Design`
3. Chọn kiểu bảng muốn, thường là kiểu có hàng đầu **màu xám hoặc xanh**

**Căn Chỉnh Nội Dung:**

1. **Chọn toàn bộ bảng:** `Ctrl+A` khi cursor ở trong bảng
2. Vào menu `Home`
3. Chọn `Align` để căn trái/giữa/phải

**Lưu ý:**

- Hàng đầu thường căn **giữa** và **in đậm**
- Hàng dữ liệu căn **trái** cho text, **giữa** cho số

### 5.4 Ví Dụ Bảng Hoàn Chỉnh

```
### Bảng Màu Chủ Đạo        [Heading 3]

| Khu Vực      | Màu Sắc        | Mã Màu  | Tác Dụng          |
|--------------|----------------|---------|-------------------|
| Tường chính  | Xám nhạt       | #b8c5d6 | Rộng rãi, tĩnh lặng|
| Sofa         | Kem            | #e8dcc8 | Ấm áp, thân thiết |
| Thảm         | Nâu nhạt       | #a89a80 | Kết nối với sofa  |

[Kết quả render trên web: Bảng đẹp với header có nền màu, nội dung căn chỉnh tốt]
```

---

## 6. Định Dạng Chữ (Bold, Italic, Highlight)

### 6.1 In Đậm (Bold)

**Mục đích:** Nhấn mạnh từ khóa, thuật ngữ quan trọng

**Cách làm:**

1. **Chọn** (bôi đen) từ/cụm từ muốn in đậm
2. Nhấn **`Ctrl+B`** hoặc bấm nút `B` (Bold) trên toolbar

```
Ví dụ:
"Công trình này dùng gỗ sồi nhập khẩu cao cấp."
                  ↓
Bôi đen "gỗ sồi nhập khẩu"
                  ↓
Nhấn Ctrl+B
                  ↓
"Công trình này dùng **gỗ sồi nhập khẩu** cao cấp."
```

### 6.2 In Nghiêng (Italic)

**Mục đích:** Dùng cho nhận xét, ghi chú, hoặc nhấn mạnh nhẹ

**Cách làm:**

1. **Chọn** từ/cụm từ
2. Nhấn **`Ctrl+I`** hoặc bấm nút `I` (Italic) trên toolbar

```
Ví dụ:
"Lưu ý: Khách hàng cần thanh toán trước khi thi công."
                  ↓
Bôi đen "Lưu ý:"
                  ↓
Nhấn Ctrl+I
                  ↓
"*Lưu ý:* Khách hàng cần thanh toán trước khi thi công."
```

### 6.3 Gạch Chân (Underline)

**Cách làm:**

1. **Chọn** từ/cụm từ
2. Nhấn **`Ctrl+U`** hoặc bấm nút `U` (Underline)

### 6.4 Tô Màu Nền (Highlight)

**Mục đích:** Tô màu để nổi bật nội dung rất quan trọng

**Cách làm:**

1. **Chọn** từ/cụm từ
2. Vào menu `Home`
3. Tìm nút `Text Highlight Color` (Màu tô sáng - biểu tượng bút lông)
4. Chọn màu (thường là vàng hoặc xanh nhạt)

```
Cảnh báo: Phải sử dụng sơn cao cấp để tránh bay màu sau 2 năm
↓
Tô highlight màu vàng
↓
[Nổi bật rõ ràng]
```

---

## 7. Chia Cột & Không Gian

### 7.1 Thêm Khoảng Trắng Giữa Các Section

**Lý do:** Tài liệu dễ đọc hơn khi các section cách nhau

**Cách làm:**

- Bấm **`Enter` 2 lần** giữa các section lớn
- Bấm **`Enter` 1 lần** giữa các paragraph thường

```
[Heading 2: Phòng Khách]
↓
[Enter x2]
↓
[Heading 3: Vật Liệu]
↓
[Enter x1]
↓
- Gỗ sồi
```

### 7.2 Chia Cột (Columns)

**Mục đích:** Nếu muốn nội dung chia thành 2-3 cột (hiếm khi dùng)

**Cách làm:**

1. **Chọn** nội dung muốn chia cột
2. Vào menu `Layout` (Bố cục)
3. Chọn `Columns` (Cột)
4. Chọn số cột (2 hoặc 3)

**Lưu ý:** Thường không khuyến khích chia cột cho web vì nó không responsive tốt trên mobile. Nên để nội dung 1 cột.

### 7.3 Khoảng Cách Dòng (Line Spacing)

**Mục đích:** Điều chỉnh khoảng cách giữa các dòng để tài liệu dễ đọc

**Cách làm:**

1. **Chọn** nội dung (hoặc `Ctrl+A` chọn tất cả)
2. Vào menu `Home`
3. Tìm `Line Spacing` (khoảng cách dòng)
4. Chọn **`1.5 lines`** hoặc **`Double`** (1.5 hoặc 2)

**Khuyến nghị:**

- Body text: **1.15 hoặc 1.5 lines** (dễ đọc)
- Heading: **1 line** (bình thường)

---

## 8. Ví Dụ Hoàn Chỉnh

Dưới đây là một ví dụ **Word Document hoàn chỉnh** với tất cả các định dạng:

```
┌────────────────────────────────────────────────────────────┐
│ Thiết Kế Nội Thất Hiện Đại Cho Căn Hộ 3 Phòng Ngủ         │  [Heading 1]
│ Tại Tây Hồ                                                 │
└────────────────────────────────────────────────────────────┘

Giới Thiệu Dự Án                                             [Heading 2]

Đây là dự án thiết kế và thi công nội thất cho một căn hộ
chung cư hiện đại ở khu Tây Hồ. Với diện tích 120m², chúng  [Normal text]
tôi đã tạo ra một không gian sống **sang trọng, thoáng      [Bold]
đãng** và *cực kỳ tiện nghi* cho gia đình trẻ.              [Italic]

[ẢNH - căn giữa trang]
Toàn cảnh căn hộ từ cửa chính                                [Caption]

### Thông Tin Dự Án                                           [Heading 3]

- Diện tích: 120 m²                                          [Bullet list]
- Thời gian thi công: 5 tháng
- Phong cách: Hiện đại - Tối giản
- Chủ sở hữu: Gia đình chị Hà & anh Trung

---

Phòng Khách - Không Gian Tiếp Khách                          [Heading 2]

Phòng khách được thiết kế để là **trái tim của căn hộ**     [Normal text]
- nơi gia đình聚lại và đón khách.

### Ý Tưởng Thiết Kế                                          [Heading 3]

1. Tạo không gian mở giữa phòng khách và bếp                [Numbered list]
2. Sử dụng tone màu trung tính để tạo cảm giác rộng rãi
3. Hệ thống chiếu sáng theo nhiều lớp

### Vật Liệu Chính                                            [Heading 3]

- Gỗ sồi nhập khẩu từ Bắc Âu
- Thạch cao chống cháy loại A
- Sơn tường Dulux Premium cao cấp
- Rèm vải linen tự nhiên

### Bảng Màu                                                  [Heading 3]

| Vùng Không Gian | Màu Chính | Tác Dụng           |
|-----------------|-----------|-------------------|
| Tường chính     | Xám nhạt  | Rộng rãi, tĩnh lặng|
| Sofa            | Kem       | Ấm áp, thân thiết |
| Thảm            | Nâu nhạt  | Kết nối với sofa  |

[ẢNH - chi tiết phòng khách]
Phòng khách với bộ sofa gỗ sồi                               [Caption]

---

Phòng Bếp                                                    [Heading 2]

[ẢNH]
Phòng bếp âm tủ hiện đại                                    [Caption]

### Quy Trình Thi Công                                        [Heading 3]

1. Xây dựng tường phụ để đặt bếp
2. Lắp đặt ống thoát khí và ống nước
3. Lắp bếp âm tủ và các thiết bị
4. Hoàn thiện gạch ốp và mạch điện

---

Điểm Nổi Bật của Dự Án                                       [Heading 2]

- **Bếp âm tủ hoàn toàn** - Giấu hết thiết bị để căn hộ
  luôn gọn gàng
- **Hệ thống lưu trữ tối ưu** - Tủ âm tường ở mọi phòng
- **Chiếu sáng thông minh** - Có thể điều chỉnh cường độ
  theo giờ
- **Màu sắc trung tính** - Có thể dễ dàng thay đổi phong
  cách trong tương lai

┌────────────────────────────────────────────────────────────┐
│ Kết quả render: Tài liệu trông chuyên nghiệp, dễ đọc,    │
│ có cấu trúc rõ ràng, hình ảnh đẹp, bảng so sánh trực quan│
└────────────────────────────────────────────────────────────┘
```

---

## 9. Lỗi Thường Gặp & Cách Khắc Phục

### Lỗi 1: Tiêu đề không được nhận diện

**Vấn đề:** Tiêu đề không được render thành H1/H2/H3

**Nguyên nhân:** Chỉ đổi kích thước chữ hoặc màu chữ mà không áp dụng Heading Style

**Cách khắc phục:**

1. Bôi đen tiêu đề
2. Vào `Home` → `Styles`
3. Chọn **`Heading 1/2/3`** (không phải chỉnh màu/kích thước)

---

### Lỗi 2: Danh sách không được nhận diện

**Vấn đề:** Danh sách render thành text bình thường, không có bullet

**Nguyên nhân:** Không áp dụng Bullet/Numbered List style

**Cách khắc phục:**

1. Chọn danh sách
2. Vào `Home` → `Bullet List` hoặc `Numbered List`
3. Chọn kiểu muốn

---

### Lỗi 3: Ảnh quá lớn hoặc quá nhỏ

**Vấn đề:** Ảnh không phù hợp với trang web

**Cách khắc phục:**

1. Click ảnh
2. Kéo góc để **resize** hoặc nhập chiều rộng cụ thể
3. **Khuyến nghị:** Ảnh tổng thể = 100% trang, ảnh chi tiết = 50-75%

---

### Lỗi 4: Caption không hiển thị đúng

**Vấn đề:** Caption không xuất hiện dưới ảnh hoặc format sai

**Cách khắc phục:**

1. Click phải ảnh → `Insert Caption`
2. Xóa "Hình 1:" nếu có
3. Viết mô tả ngắn rõ ràng
4. Chọn `Position: Below selected item`
5. Click OK

---

### Lỗi 5: Bảng không căn chỉnh tốt

**Vấn đề:** Bảng render lệch, cột quá hẹp, text chồng chéo

**Cách khắc phục:**

1. Click vào bảng
2. Vào `Table Design`
3. Chọn kiểu bảng có **AutoFit** (tự động điều chỉnh kích thước)
4. Hoặc **Resize cột thủ công** bằng cách kéo biên cột

---

## 10. Kiểm Tra Trước Khi Upload

Trước khi upload file Word lên website, hãy **kiểm tra** các điểm sau:

### Checklist Kiểm Tra

```
☑ Tiêu đề H1: Có 1 tiêu đề chính (Heading 1)
☑ Tiêu đề H2: Có các tiêu đề section (Heading 2)
☑ Tiêu đề H3: Có tiêu đề chi tiết nếu cần (Heading 3)
☑ Danh sách: Dùng Bullet List hoặc Numbered List (không phải text thường)
☑ Ảnh:
   ☑ Ảnh được chèn đúng vị trí
   ☑ Ảnh kích thước phù hợp (100% hoặc 50-75%)
   ☑ Ảnh được căn giữa trang
   ☑ Mỗi ảnh có caption rõ ràng
☑ Bảng:
   ☑ Bảng có hàng đầu màu
   ☑ Bảng có đủ hàng/cột
   ☑ Nội dung bảng căn chỉnh tốt
☑ Định dạng chữ:
   ☑ Từ khóa quan trọng được in đậm (Bold)
   ☑ Ghi chú được in nghiêng (Italic)
   ☑ Không có quá nhiều highlight
☑ Font:
   ☑ Không dùng font tiếng Việt (VNI, Vn Art)
   ☑ Dùng font tiêu chuẩn (Calibri, Arial, Times New Roman)
☑ Khoảng cách:
   ☑ Có khoảng trắng giữa các section
   ☑ Khoảng cách dòng = 1.15 hoặc 1.5
☑ Không có lỗi:
   ☑ Không có chữ sai, lỗi ngữ pháp
   ☑ Không có bullet/số thứ tự bị lỗi
```

### Xem Trước Trước Khi Lưu

Trước khi lưu, hãy **xem trước PDF** để kiểm tra format:

1. Vào menu `File`
2. Chọn `Export As` → `PDF`
3. Xem trước PDF
4. Nếu OK → Quay lại Word lưu `.docx`

---

## 11. Tóm Tắt Nhanh

| Yếu Tố          | Cách Làm              | Kết Quả            |
| --------------- | --------------------- | ------------------ |
| **Tiêu đề H1**  | Heading 1 style       | TO, ĐẬM, màu xanh  |
| **Tiêu đề H2**  | Heading 2 style       | VỪA, ĐẬM           |
| **Tiêu đề H3**  | Heading 3 style       | NHỎ, ĐẬM           |
| **Bullet list** | Bullet List button    | • • •              |
| **Số thứ tự**   | Numbered List button  | 1. 2. 3.           |
| **Bold**        | Ctrl+B                | **Chữ đậm**        |
| **Italic**      | Ctrl+I                | _Chữ nghiêng_      |
| **Ảnh**         | Insert → Pictures     | Hình ảnh + caption |
| **Bảng**        | Insert → Table        | Bảng so sánh       |
| **Khoảng cách** | Enter x2 giữa section | Dễ đọc             |

---

## 12. Kết Luận

Bằng cách tuân theo hướng dẫn này, bạn có thể:

✅ Viết tài liệu Word **chuyên nghiệp** từ đầu
✅ Tạo ra nội dung render **cực kỳ đẹp** trên website
✅ Tránh được các lỗi **thường gặp**
✅ Tiết kiệm **thời gian chỉnh sửa** sau khi upload

---

## 📞 Hỗ Trợ Thêm

Nếu gặp vấn đề khi viết Word:

1. **Kiểm tra lại** checklist ở phần 10
2. **Xem ví dụ** ở phần 8
3. **Đọc phần "Lỗi Thường Gặp"** ở phần 9

**Chúc bạn viết tài liệu thành công!** 🎉
