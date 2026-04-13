# Quản Lý Dự Án - Hướng Dẫn Sử Dụng

## Tổng Quan

Hệ thống quản lý dự án cho phép bạn tạo, chỉnh sửa và xóa dự án một cách dễ dàng. Dữ liệu được lưu trữ trong `data/projects.json` hoặc có thể lấy từ Strapi CMS.

## Bắt Đầu

### 1. Truy Cập Admin Dashboard

```
http://localhost:3000/admin/projects
```

### 2. Thêm Dự Án Mới

Nhấp nút **"+ Thêm Dự Án"** để mở form thêm mới. Điền các thông tin:

#### Thông Tin Cơ Bản (Bắt buộc)

- **Slug** - URL friendly name (VD: `skyline-penthouse`)
- **Tiêu Đề** - Tên dự án
- **Mô Tả Ngắn** - 1-2 câu tóm tắt
- **Mô Tả Chi Tiết** - Nội dung chi tiết
- **Loại Hình** - Căn hộ, Biệt thự, Nhà phố, v.v.
- **Phong Cách** - Hiện đại, Tân cổ điển, Minimalism, v.v.
- **Ngân Sách** - VD: "3-5 tỷ"

#### Ảnh Bìa (Bắt buộc)

- **URL Ảnh** - Đường dẫn đầy đủ (VD: `/upload/projects/skyline-penthouse.jpg`)
- **Alt Text** - Văn bản mô tả ảnh

#### Chi Tiết Dự Án

- **Diện Tích** - VD: "320 m²"
- **Thời Gian** - VD: "6 tháng"
- **Phạm Vi** - VD: "Thiết kế + Thi công"
- **Khách Hàng** - Tên khách hàng (tùy chọn)
- **Địa Điểm** - Vị trí dự án (tùy chọn)

#### Nổi Bật

- Chọn **"Dự án nổi bật"** để hiển thị trên trang chủ

### 3. Cấu Trúc Dữ Liệu

Dữ liệu được lưu trong `data/projects.json`. Cấu trúc mẫu:

```json
[
  {
    "id": 1,
    "slug": "skyline-penthouse",
    "title": "Penthouse Skyline",
    "summary": "Căn penthouse toàn cảnh kết hợp gỗ ấm áp và đá tự nhiên.",
    "description": "Mô tả chi tiết dự án...",
    "category": "Căn hộ",
    "style": "Hiện đại",
    "budget": "3-5 tỷ",
    "coverImage": {
      "url": "/upload/projects/skyline-penthouse.jpg",
      "alt": "Skyline penthouse"
    },
    "gallery": [
      {
        "url": "/upload/projects/skyline-1.jpg",
        "alt": "Phòng khách"
      }
    ],
    "details": [
      { "label": "Diện tích", "value": "320 m²" },
      { "label": "Thời gian", "value": "6 tháng" },
      { "label": "Phạm vi", "value": "Thiết kế + Thi công" }
    ],
    "projectDetails": {
      "area": "320 m²",
      "duration": "6 tháng",
      "scope": "Thiết kế + Thi công",
      "client": "Khách hàng VIP",
      "location": "Quận 1, TP.HCM",
      "completedDate": "2024-12-31"
    },
    "highlights": [
      "Nội thất cao cấp",
      "Công nghệ smart home",
      "Thiết kế độc đáo"
    ],
    "sections": [
      {
        "title": "Phòng Khách",
        "content": "Phòng khách được thiết kế...",
        "image": {
          "url": "/upload/projects/skyline-living.jpg",
          "alt": "Phòng khách"
        }
      }
    ],
    "featured": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-20T14:30:00.000Z"
  }
]
```

## API Routes

### GET Danh Sách Dự Án

```
GET /api/projects
```

### GET Chi Tiết Dự Án

```
GET /api/projects?id=1
```

### POST Tạo Dự Án Mới

```
POST /api/projects
Content-Type: application/json

{
  "slug": "new-project",
  "title": "Dự Án Mới",
  ...
}
```

### PUT Cập Nhật Dự Án

```
PUT /api/projects?id=1
Content-Type: application/json

{ "title": "Tên mới", ... }
```

### DELETE Xóa Dự Án

```
DELETE /api/projects?id=1
```

## Cấu Trúc Thư Mục Ảnh

Đặt ảnh theo cấu trúc sau:

```
public/upload/
  ├── projects/
  │   ├── skyline-penthouse.jpg (ảnh bìa)
  │   ├── skyline-1.jpg
  │   ├── skyline-2.jpg
  │   └── ...
  ├── blog/
  └── banner/
```

## Lưu Ý

1. **Slug phải độc lập** - Không được trùng lặp
2. **URL ảnh phải tương đối** - Bắt đầu bằng `/upload/`
3. **Dữ liệu được cache** - Có thể cần `npm run build` để cập nhật static pages
4. **Fallback Strapi** - Nếu lỗi project storage, sẽ dùng Strapi hoặc fallback data

## Trang Chi Tiết Dự Án

Mỗi dự án sẽ có trang detail tại:

```
https://icepdesign.vn/du-an/[slug]
```

Trang này hiển thị:

- Hero image toàn màn hình
- Thông tin dự án (diện tích, thời gian, phạm vi, khách hàng, địa điểm)
- Gallery hình ảnh
- Điểm nổi bật
- Các section chi tiết
- CTA để liên hệ tư vấn

## Troubleshooting

### Dự án không hiển thị sau khi thêm

- Kiểm tra slug có đúng không (không dấu cách, chữ thường)
- Kiểm tra đường dẫn ảnh có tồn tại không
- Build lại project: `npm run build`

### Ảnh không hiển thị

- Kiểm tra đặt ảnh vào `/public/upload/` đúng không
- Kiểm tra đường dẫn trong form có bắt đầu bằng `/upload/` không
- Kiểm tra file extension (`.jpg`, `.png`, `.webp`)
