# Hướng dẫn Viết Nội Dung Markdown cho Dự Án - Render Web Đẹp

Tài liệu này mô tả **toàn bộ** các tính năng markdown được hỗ trợ khi bạn viết nội dung cho dự án trên trang Admin. Nội dung sẽ được tự động chuyển đổi từ Word → Markdown → HTML đẹp trên website.

Khi bạn hoặc AI khác sinh nội dung, hãy tuân theo hướng dẫn này để đảm bảo render đúng và đẹp nhất.

---

## 1. Tổng Quan Các Tính Năng Hỗ Trợ

| Tính Năng                  | Cú Pháp               | Ví Dụ                                  | Ghi Chú                      |
| -------------------------- | --------------------- | -------------------------------------- | ---------------------------- |
| **Tiêu đề H1**             | `# Tiêu đề`           | `# Thiết Kế Nội Thất Hiện Đại`         | Dùng cho tiêu đề chính       |
| **Tiêu đề H2**             | `## Tiêu đề`          | `## Phòng Khách`                       | Dùng cho tiêu đề section     |
| **Tiêu đề H3**             | `### Tiêu đề`         | `### Màu Sắc Chủ Đạo`                  | Dùng cho tiêu đề sub-section |
| **Danh sách không thứ tự** | `- Mục`               | `- Gỗ tự nhiên`                        | Dấu `-` hoặc `*`             |
| **Danh sách có thứ tự**    | `1. Mục`              | `1. Bước đầu khảo sát`                 | Dùng số thứ tự               |
| **Ảnh với caption**        | `![alt](url)`         | `![Phòng khách](LINK_ANH_PHONG_KHACH)` | Nhập LINK\_\* thay thế       |
| **Bảng so sánh**           | `\|col1\|col2\|`      | Xem mục 5                              | Dùng pipe `\|`               |
| **Video YouTube**          | Dòng chứa URL YouTube | `https://www.youtube.com/watch?v=...`  | Tự nhận diện và embed        |
| **Bold**                   | `**text**`            | `**rất quan trọng**`                   | In đậm                       |
| **Italic**                 | `*text*`              | `*lưu ý*`                              | In nghiêng                   |
| **Link**                   | `[text](url)`         | `[Xem thêm](INSERT_LINK)`              | Nhập INSERT_LINK             |
| **Code inline**            | `` `code` ``          | `` `#1f4569` ``                        | Cho màu sắc hoặc mã          |
| **Paragraph**              | Văn bản thường        | `Đây là đoạn văn thường`               | Cách nhau 1 dòng trắng       |

---

## 2. Chi Tiết Từng Tính Năng

### 2.1 Tiêu Đề (Headings)

Dùng `#` để tạo tiêu đề. Số dấu `#` càng nhiều, tiêu đề càng nhỏ.

**H1 - Tiêu đề chính dự án (chỉ dùng 1 lần ở đầu)**

```markdown
# Thiết Kế Nội Thất Hiện Đại Cho Căn Hộ 3 Phòng Ngủ
```

**H2 - Tiêu đề section chính**

```markdown
## Phòng Khách - Không Gian Tiếp Khách

## Phòng Bếp - Nơi Yêu Thương

## Phòng Ngủ Master - Góc Thư Giãn

## Phòng Tắm - Spa Riêng Tại Nhà
```

**H3 - Tiêu đề nhỏ cho thông tin chi tiết**

```markdown
### Vật Liệu Sử Dụng

### Bảng Màu Chủ Đạo

### Chiếu Sáng Và Điện
```

---

### 2.2 Danh Sách (Lists)

#### Danh Sách Không Thứ Tự (Bullet Points)

Dùng khi liệt kê các item không cần thứ tự.

```markdown
- Gỗ sồi nhập khẩu
- Thạch cao chống cháy
- Sơn tường chống bám bụi
- Đèn LED tiết kiệm điện
```

Hoặc dùng `*`:

```markdown
- Gỗ sồi nhập khẩu
- Thạch cao chống cháy
```

#### Danh Sách Có Thứ Tự (Numbered List)

Dùng khi cần hiển thị quy trình, bước làm, hoặc ưu tiên.

```markdown
1. Khảo sát hiện trạng và lấy kích thước
2. Thiết kế 3D và xin phê duyệt khách hàng
3. Lên kế hoạch thi công chi tiết
4. Thi công và giám sát chất lượng
5. Bàn giao và hướng dẫn sử dụng
```

---

### 2.3 Ảnh (Images)

#### Cú Pháp Cơ Bản

```markdown
![Alt Text - Mô Tả Ảnh](URL_ảnh)
```

#### Ví Dụ Thực Tế - Dùng Placeholder

Khi viết nội dung, nếu chưa có link ảnh, dùng placeholder theo format:

```
LINK_ANH_TÊN_MỤC_CHI_TIẾT
```

**Ví dụ:**

```markdown
![Phòng khách hiện đại với tông màu gỗ tự nhiên](LINK_ANH_PHONG_KHACH_OVERALL)

## Bàn Sofa

![Chi tiết bộ sofa](LINK_ANH_PHONG_KHACH_SOFA)

## Tủ Tivi

![Tủ tivi gỗ sồi](LINK_ANH_PHONG_KHACH_TU_TVI)
```

#### Danh Sách Ảnh Cần Dùng (Ví Dụ Cho Phòng Khách)

```
LINK_ANH_PHONG_KHACH_OVERALL          => Ảnh tổng quát toàn phòng khách
LINK_ANH_PHONG_KHACH_SOFA             => Ảnh bộ sofa chi tiết
LINK_ANH_PHONG_KHACH_TU_TVI           => Ảnh tủ tivi chi tiết
LINK_ANH_PHONG_KHACH_BAN_TRA          => Ảnh bàn trà chi tiết
LINK_ANH_PHONG_KHACH_LIGHTING         => Ảnh đèn chiếu sáng
LINK_ANH_PHONG_KHACH_DECOR            => Ảnh trang trí tường
```

**Lưu ý Khi Có Link Thực:**

Khi AI hoặc bạn có link ảnh thực từ Cloudinary, thay thế trực tiếp:

```markdown
![Phòng khách hiện đại](https://res.cloudinary.com/dfazfoh2l/image/upload/v1234567890/projects/phong-khach.jpg)
```

---

### 2.4 Bảng (Tables)

Dùng để so sánh, liệt kê thông số kỹ thuật, hoặc so sánh các tuỳ chọn.

#### Cú Pháp

```markdown
| Tiêu Đề Cột 1 | Tiêu Đề Cột 2 | Tiêu Đề Cột 3 |
| ------------- | ------------- | ------------- |
| Ô 1-1         | Ô 1-2         | Ô 1-3         |
| Ô 2-1         | Ô 2-2         | Ô 2-3         |
```

#### Ví Dụ: Bảng So Sánh Vật Liệu

```markdown
| Vật Liệu  | Ưu Điểm         | Nhược Điểm    | Giá          |
| --------- | --------------- | ------------- | ------------ |
| Gỗ sồi    | Sang trọng, bền | Dễ bị trầy    | 150k-200k/m² |
| Laminate  | Dễ vệ sinh, rẻ  | Không bền lâu | 50k-100k/m²  |
| Thạch cao | Có thể tạo hình | Dễ nứt        | 30k-80k/m²   |
```

#### Ví Dụ: Bảng Tham Số Kỹ Thuật

```markdown
| Thông Số        | Chi Tiết                 |
| --------------- | ------------------------ |
| Diện tích phòng | 45 m²                    |
| Số cửa          | 2 (1 chính, 1 phòng ngủ) |
| Chiều cao trần  | 3.2 m                    |
| Hệ thống điện   | Âm tường toàn bộ         |
| Điều hòa        | 2 điểm lạnh              |
```

---

### 2.5 Định Dạng Inline (Bold, Italic, Code, Link)

#### Bold - In Đậm

Dùng `**text**` hoặc `__text__`

```markdown
Công trình này dùng **gỗ sồi nhập khẩu** cao cấp.
```

Render: Công trình này dùng **gỗ sồi nhập khẩu** cao cấp.

#### Italic - In Nghiêng

Dùng `*text*` hoặc `_text_`

```markdown
_Lưu ý:_ Khách hàng cần thanh toán trước khi thi công.
```

Render: _Lưu ý:_ Khách hàng cần thanh toán trước khi thi công.

#### Code Inline - Cho Mã Màu, Mã Sản Phẩm

Dùng backtick `` ` ``

```markdown
Màu tường chính: `#1f4569`
Sản phẩm: `DULUX Premium 10L`
```

Render: Màu tường chính: `#1f4569`; Sản phẩm: `DULUX Premium 10L`

#### Link - Chèn Liên Kết

Dùng `[Text hiển thị](URL)`

**Với placeholder:**

```markdown
Để biết thêm chi tiết, [hãy xem bộ sưu tập tương tự](INSERT_LINK_TAO_SLIDE_SHOW)
```

**Với URL thực:**

```markdown
[Xem các dự án tương tự tại Hà Nội](https://heidesign.vn/du-an?category=Biệt+Thự&region=Hà+Nội)
```

---

### 2.6 Video YouTube

Khi bạn muốn chèn video YouTube, chỉ cần **dùng 1 dòng riêng với URL YouTube**. Renderer sẽ tự động nhận diện và embed.

#### Cách Viết

```markdown
Xem video hướng dẫn sử dụng không gian:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

Trong video trên, chúng tôi hướng dẫn...
```

**Lưu ý:**

- URL phải ở **1 dòng riêng** (không chèn trong đoạn văn)
- Renderer sẽ tự nhận diện `youtube.com` hoặc `youtu.be`
- Video sẽ embed fullwidth responsive

---

### 2.7 Đoạn Văn (Paragraphs)

Văn bản thường được tự động cách nhau bởi 1 dòng trắng.

```markdown
Đây là đoạn văn đầu tiên giới thiệu về dự án.
Nó sẽ được render thành HTML paragraph.

Đây là đoạn văn thứ hai.
Tự động cách nhau bởi khoảng trắng.
```

---

## 3. Cấu Trúc Nội Dung Gợi Ý

Để nội dung được render đẹp và logic, hãy tuân theo cấu trúc sau:

```markdown
# Tên Dự Án Chính

## Giới Thiệu Tổng Quát

Đoạn giới thiệu chung về dự án...

![Ảnh tổng quát](LINK_ANH_OVERALL)

## Phòng Khách

Mô tả phòng khách...

### Vật Liệu Sử Dụng

- Gỗ sồi
- Thạch cao
- Sơn cao cấp

![Phòng khách chi tiết](LINK_ANH_PHONG_KHACH)

### Bảng Màu

| Khu Vực     | Màu Sắc | Mã Màu    |
| ----------- | ------- | --------- |
| Tường chính | Ghi đậm | `#5a6a7a` |
| Sofa        | Kem     | `#e8dcc8` |

## Phòng Bếp

...
```

---

## 4. Hướng Dẫn Dùng Placeholder Ảnh & Link

### 4.1 Placeholder Ảnh

**Khi bạn chưa có link ảnh:**

```
LINK_ANH_[TÊN_MỤC]_[CHI_TIẾT]
```

**Ví dụ cụ thể:**

```
LINK_ANH_PHONG_KHACH_OVERALL     => Ảnh toàn cảnh phòng khách
LINK_ANH_PHONG_KHACH_SOFA        => Ảnh chi tiết ghế sofa
LINK_ANH_PHONG_KHACH_TU_TVI      => Ảnh tủ tivi
LINK_ANH_PHONG_BEP_OVERALL       => Ảnh toàn cảnh phòng bếp
LINK_ANH_PHONG_BEP_BEPAU         => Ảnh bếp âm tủ
LINK_ANH_PHONG_BEP_THICKEU       => Ảnh khu tiếp khách bếp
LINK_ANH_PHONG_NGU_OVERALL       => Ảnh toàn cảnh phòng ngủ
LINK_ANH_PHONG_NGU_GIUONG        => Ảnh giường ngủ
LINK_ANH_PHONG_TAM_OVERALL       => Ảnh toàn cảnh phòng tắm
LINK_ANH_PHONG_TAM_TOILET        => Ảnh khu toilet
LINK_ANH_PHONG_TAM_SINK          => Ảnh bồn rửa
```

**Cách sử dụng trong markdown:**

```markdown
![Phòng khách hiện đại với nội thất gỗ sồi](LINK_ANH_PHONG_KHACH_OVERALL)

![Chi tiết bộ sofa](LINK_ANH_PHONG_KHACH_SOFA)
```

**Sau khi có link thực, thay thế:**

```markdown
![Phòng khách hiện đại với nội thất gỗ sồi](https://res.cloudinary.com/dfazfoh2l/image/upload/c_scale,w_1200/projects/phong-khach.jpg)
```

---

### 4.2 Placeholder Link

**Khi bạn cần chèn link nhưng chưa có URL cụ thể:**

```
INSERT_LINK_[TÊN_HOẠT_ĐỘNG]
```

**Ví dụ cụ thể:**

```
[Xem bộ sưu tập phòng khách](INSERT_LINK_PHONG_KHACH)

[Tìm hiểu thêm về dịch vụ](INSERT_LINK_DICH_VU_CHI_TIET)

[Liên hệ bộ phận tư vấn](INSERT_LINK_LIEN_HE)

[Tải bảng giá](INSERT_LINK_BANG_GIA)
```

**Sau khi có URL thực, thay thế:**

```
[Xem bộ sưu tập phòng khách](https://heidesign.vn/du-an?category=Phòng+Khách)

[Liên hệ bộ phận tư vấn](https://heidesign.vn/admin/contact)
```

---

## 5. Ví Dụ Hoàn Chỉnh

Dưới đây là một ví dụ đầy đủ của bài viết dự án:

````markdown
# Thiết Kế Nội Thất Hiện Đại Cho Căn Hộ 3 Phòng Ngủ Tại Tây Hồ

## Giới Thiệu Dự Án

Đây là dự án thiết kế và thi công nội thất cho một căn hộ chung cư hiện đại ở khu Tây Hồ.
Với diện tích 120m², chúng tôi đã tạo ra một không gian sống **sang trọng, thoáng đãng**
và _cực kỳ tiện nghi_ cho gia đình trẻ.

![Toàn cảnh căn hộ](LINK_ANH_PHONG_KHACH_OVERALL)

**Thông Tin Dự Án:**

- Diện tích: 120 m²
- Thời gian thi công: 5 tháng
- Phong cách: Hiện đại - Tối giản
- Chủ sở hữu: Gia đình chị Hà & anh Trung

---

## Phòng Khách

Phòng khách được thiết kế để là **trái tim của căn hộ** - nơi gia đình聚lại và đón khách.

### Ý Tưởng Thiết Kế

1. Tạo không gian mở giữa phòng khách và bếp
2. Sử dụng tone màu trung tính để tạo cảm giác rộng rãi
3. Hệ thống chiếu sáng theo nhiều lớp

### Vật Liệu Chính

- Gỗ sồi nhập khẩu từ Bắc Âu
- Thạch cao chống cháy loại A
- Sơn tường Dulux Premium cao cấp
- Rèm vải linen tự nhiên

### Bảng Màu Chủ Đạo

| Vùng Không Gian | Màu Chính | Mã Màu    | Tác Dụng             |
| --------------- | --------- | --------- | -------------------- |
| Tường chính     | Xám nhạt  | `#b8c5d6` | Rộng rãi, tĩnh lặng  |
| Tường accent    | Xanh đất  | `#6b7d8f` | Điểm nhấn, chiều sâu |
| Sofa            | Kem       | `#e8dcc8` | Ấm áp, thân thiện    |
| Thảm            | Nâu nhạt  | `#a89a80` | Kết nối với sofa     |

![Phòng khách chi tiết](LINK_ANH_PHONG_KHACH_SOFA)

### Đèn Chiếu Sáng

Hệ thống đèn được chia thành 3 lớp:

1. **Đèn trần chính** - LED panel 60W cho sáng tổng thể
2. **Đèn tường** - 2 chiếc đèn tường đầu giường để đọc sách
3. **Đèn trang trí** - 4 chiếc downlight nhỏ quanh sofa

---

## Phòng Bếp

Phòng bếp được thi công theo tiêu chuẩn hiện đại với **bếp âm tủ hoàn toàn**.

### Quy Trình Thi Công

```markdown
1. Xây dựng tường phụ để đặt bếp
2. Lắp đặt ống thoát khí và ống nước
3. Lắp bếp âm tủ và các thiết bị
4. Hoàn thiện gạch ốp và mạch điện
```
````

![Phòng bếp toàn cảnh](LINK_ANH_PHONG_BEP_OVERALL)

---

## Phòng Ngủ Master

Phòng ngủ được thiết kế như một **spa riêng** cho chủ nhân.

- Giường **gỗ sồi** kích thước King 1.8m
- Tủ quần áo âm tường toàn bộ
- Hệ thống đèn ngủ thông minh

---

## Phòng Tắm

Phòng tắm được nâng cấp với thiết bị cao cấp:

1. Bồn tắm - Bồn tắm đơn độc kích thước 1.6m
2. Phòng tắm mưa - Trần cao, ánh sáng tự nhiên
3. Khu rửa tay - Lavabo đôi sang trọng

---

## Điểm Nổi Bật

- **Bếp âm tủ hoàn toàn** - Giấu hết thiết bị để căn hộ luôn gọn gàng
- **Hệ thống lưu trữ tối ưu** - Tủ âm tường ở mọi phòng
- **Chiếu sáng thông minh** - Có thể điều chỉnh cường độ theo giờ
- **Màu sắc trung tính** - Có thể dễ dàng thay đổi phong cách trong tương lai

---

## Hướng Dẫn Bảo Trì

Để giữ căn hộ luôn như mới:

1. **Lau chùi hàng tuần** bề mặt gỗ bằng khăn ẩm
2. **Đánh bóng lại sơn** mỗi 2 năm một lần
3. **Vệ sinh hệ thống chiếu sáng** hàng tháng
4. **Kiểm tra ống nước và điện** 6 tháng một lần

---

## Video Giới Thiệu

Xem video hướng dẫn chi tiết về căn hộ:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

---

## Liên Hệ Tư Vấn

Bạn cũng muốn có một không gian sống như thế này?

[**Liên hệ ngay để được tư vấn miễn phí**](INSERT_LINK_LIEN_HE_TU_VAN)

[**Xem thêm các dự án tương tự**](INSERT_LINK_PHONG_KHACH_TAI_HA_NOI)

```

---

## 6. Lưu Ý Khi Viết Nội Dung

1. **Không dùng HTML trực tiếp** - Chỉ dùng markdown syntax
2. **Ảnh luôn có alt text** - `![Mô tả ảnh](url)` rất quan trọng cho SEO
3. **Tiêu đề luôn theo thứ tự** - Không nên bỏ qua `H2` rồi nhảy sang `H4`
4. **Danh sách không quá dài** - Tối đa 10 item thì nên chia thành nhiều section
5. **Bảng không quá rộng** - Tối đa 5-6 cột để responsive tốt trên mobile
6. **Khoảng cách** - Để 1-2 dòng trắng giữa các section để rõ ràng
7. **Từ khóa** - Nhớ dùng **bold** cho các từ khóa quan trọng

---

## 7. Hỗ Trợ Khi Dùng AI

Khi bạn dùng AI để sinh nội dung markdown, hãy gửi cho AI:

1. **File này** (`markdown-content-guide.md`)
2. **Yêu cầu cụ thể:**
   - "Viết nội dung dự án theo định dạng markdown trong file kèm theo"
   - "Dùng H1 cho tiêu đề chính, H2 cho các phòng, H3 cho chi tiết"
   - "Dùng placeholder như `LINK_ANH_PHONG_KHACH_OVERALL` cho ảnh, `INSERT_LINK_*` cho link"
   - "Thêm bảng so sánh cho vật liệu, bảng thông số cho kỹ thuật"
   - "Thêm danh sách bước thi công nếu có"
3. **Dữ liệu dự án:**
   - Tên dự án
   - Vị trí
   - Diện tích
   - Phong cách thiết kế
   - Các tính năng chính
   - Danh sách các phòng
   - Ảnh hoặc mô tả chi tiết

AI sẽ tự sinh markdown theo format này mà bạn không cần phải sửa gì cả.

---

## 8. Chuyển Đổi Từ Word

Nếu bạn đã viết nội dung trong **Word (.docx)**, hệ thống sẽ tự động:

1. **Chuyển từ Word sang HTML** (dùng `mammoth` library)
2. **Chuyển HTML sang Markdown** (dùng `turndown` library)
3. **Xử lý ảnh** - Chuyển thành base64 hoặc giữ URL gốc
4. **Xử lý bảng** - Giữ nguyên định dạng bảng

**Lưu ý khi viết Word:**
- Dùng **Heading 1, 2, 3** cho tiêu đề
- **Bullet list** cho danh sách không thứ tự
- **Numbered list** cho danh sách có thứ tự
- **Table** cho bảng so sánh
- **Chèn ảnh trực tiếp** trong Word (sẽ được chuyển thành base64)
- **Caption dưới ảnh** sẽ tự động trở thành figcaption

---

## 9. Kết Luận

Với hướng dẫn này, bạn hoặc AI khác có thể:

✅ Viết nội dung markdown chuẩn và chuyên nghiệp
✅ Tạo ra trang web **đẹp, cấu trúc rõ ràng**
✅ Dễ dàng chèn ảnh, video, link mà không cần HTML
✅ Tự động render đúng cách trên website

**Bắt đầu viết nội dung dự án ngay hôm nay!** 🎨
```
