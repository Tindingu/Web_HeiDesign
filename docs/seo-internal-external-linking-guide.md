# Quy Dinh Di Internal Link Va External Link Cho HEI Design

Tai lieu nay dung cho nguoi viet bai va AI khi chinh sua cac file `index.md` trong `icep-design-posts`. Muc tieu la tang SEO, tang tin hieu chuyen doi lead va giu bai viet tu nhien, khong nhoi link.

## Nguyen Tac Chung

- Moi bai viet nen co 3-7 internal link tuy do dai bai.
- Link phai gan dung ngu canh. Khong chen link chi de co link.
- Anchor text phai mo ta dung noi dung trang dich.
- Uu tien link ve cac trang co gia tri chuyen doi: dich vu, bao gia, lien he, du an da hoan thien.
- Khong lap lai cung mot URL qua nhieu lan trong mot bai. Moi URL chi nen xuat hien 1 lan, tru khi bai rat dai.
- Internal link nen mo cung tab binh thuong.
- External link chi dung khi that su bo sung do tin cay cho noi dung. Khong de external link canh tranh truc tiep voi dich vu cua HEI.
- External link tham khao nen dung `target="_blank"` va can nhac `rel="nofollow noopener"` neu khong muon truyen tin hieu SEO.
- Link social, Google Maps, YouTube, TikTok, Instagram cua HEI la link thuong hieu, nen dung khi phu hop.

## Cach Dat Anchor Text

Dung anchor text co ngu nghia, vi du:

- Tot: `xem bang bao gia thi cong noi that`
- Tot: `tham khao du an biet thu da hoan thien`
- Tot: `lien he HEI Design de duoc tu van`
- Chua tot: `bam vao day`
- Chua tot: `xem tai day`
- Chua tot: `tham khao bai viet ve biet thu tai day` neu link tro sang website khac va lam noi bat chu de cua ho hon cua minh.

Voi external link, neu can dung cau "tham khao", nen viet:

```md
Theo tai lieu huong dan cua Google ve du lieu co cau truc, FAQ schema giup cong cu tim kiem hieu ro cau hoi va cau tra loi tren trang.
```

Khong nen viet:

```md
Tham khao cac bai viet thiet ke biet thu tai day.
```

## Cau Truc Link Trong Markdown

Internal link:

```md
[bao gia thi cong noi that](/bao-gia)
```

External link:

```md
[huong dan du lieu co cau truc cua Google](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
```

External link neu can nofollow:

```html
<a href="https://example.com" target="_blank" rel="nofollow noopener">nguon tham khao</a>
```

## Cac Trang Chuyen Doi Nen Uu Tien

| URL | Chuc nang | Khi nao nen link |
| --- | --- | --- |
| `/bao-gia` | Trang bao gia / tinh chi phi noi that | Khi noi ve chi phi, du toan, ngan sach, don gia, goi thi cong |
| `/lien-he` | Trang lien he va thong tin cong ty | Khi keu goi tu van, khao sat, dat lich |
| `/du-an` | Danh sach du an thuc te | Khi noi ve nang luc thi cong, case study, cong trinh da lam |
| `/thi-cong-noi-that` | Tong quan dich vu thi cong noi that | Khi noi ve thi cong tron goi, quy trinh, vat lieu |
| `/thiet-ke-noi-that` | Tong quan dich vu thiet ke noi that | Khi noi ve ban ve, phong cach, concept, cong nang |
| `/gioi-thieu` | Gioi thieu HEI Design, profile, video | Khi can tang trust ve thuong hieu |
| `/blog` | Kinh nghiem hay | Khi dan ve cac bai tu van, kien thuc, xu huong |

## URL Thuong Hieu HEI Design Nen Dung Khi Phu Hop

| Kenh | URL | Muc dich |
| --- | --- | --- |
| Website | `https://heidesign.vn` | Trang chu thuong hieu |
| Google Maps | `https://maps.app.goo.gl/yjPd8cWkYVqPC45U6` | Tang tin cay dia phuong, huong dan duong di |
| Facebook | Lay tu `siteConfig.facebookUrl` trong `lib/constants.ts` | Social proof, fanpage |
| Zalo | Lay tu `siteConfig.zaloUrl` trong `lib/constants.ts` | Lead chat nhanh |
| YouTube | `https://www.youtube.com/@HeiDesign-N%E1%BB%99iTh%E1%BA%A5tThiC%C3%B4ng` | Video du an, video gioi thieu |
| Instagram | `https://www.instagram.com/heidesign_interior/` | Hinh anh thuong hieu |
| TikTok | `https://www.tiktok.com/@hei.design` | Short video, noi dung ngan |

## External Link Uy Tin Co The Dung

Chi dung khi noi dung that su lien quan:

| Nguon | URL | Khi nao dung |
| --- | --- | --- |
| Google Search Central - Structured Data | `https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data` | Khi noi ve schema, FAQ, Article schema |
| Google Search Central - SEO Starter Guide | `https://developers.google.com/search/docs/fundamentals/seo-starter-guide` | Khi noi ve SEO co ban |
| Schema.org FAQPage | `https://schema.org/FAQPage` | Khi giai thich FAQ schema |
| Schema.org Article | `https://schema.org/Article` | Khi giai thich Article schema |
| Cloudinary Docs | `https://cloudinary.com/documentation/image_transformations` | Khi noi ve toi uu anh |

Khong nen link ra cac website noi that doi thu truc tiep neu khong bat buoc.

## Inventory URL Public Tu DB Hien Tai

Cap nhat luc: 2026-08-05.

### Du An Hoan Thien

| URL | Chuc nang / noi dung |
| --- | --- |
| `/du-an/thiet-ke-noi-that-nha-vuon-hien-dai-310m2` | Du an nha vuon hien dai 310m2, khong gian mo, gan thien nhien |
| `/du-an/thiet-ke-noi-that-nha-pho-binh-phuoc-hien-dai-180m2` | Du an nha pho Binh Phuoc 180m2 phong cach hien dai |
| `/du-an/hiet-ke-noi-that-nha-pho-lien-ke-khu-dan-cu-binh-nguyen-binh-duong-378m2` | Du an nha pho lien ke Binh Duong 378m2 |
| `/du-an/thiet-ke-noi-that-nha-pho-cu-chi-300m2-modern-design` | Du an nha pho Cu Chi 300m2 Modern Design |
| `/du-an/thiet-ke-noi-that-nha-pho-binh-tan-88m2-minimal` | Du an nha pho Binh Tan 88m2 phong cach Minimal |
| `/du-an/thiet-ke-biet-thu-neo-classic-the-pearl-riverside-ben-luc-350m2` | Du an biet thu Neo Classic The Pearl Riverside Ben Luc 350m2 |
| `/du-an/thiet-ke-biet-thu-300m2-hien-dai-ket-hop-van-phong` | Biet thu hon 300m2 ket hop nha o va van phong |
| `/du-an/duplex-one-verandah` | Can ho Duplex One Verandah 142m2 |
| `/du-an/thiet-ke-noi-that-chung-cu-sunrise-riverside-90m2` | Chung cu Sunrise Riverside 90m2 |
| `/du-an/thiet-ke-nha-pho-japandi-280m2-2-phong-ngu` | Nha pho Japandi 280m2 |
| `/du-an/thiet-ke-noi-that-villa-binh-phuoc-dark-modern-luxury-400m2` | Villa Binh Phuoc 400m2 Dark Modern Luxury |
| `/du-an/thiet-ke-biet-thu-hien-dai-villa-tan-an-long-an-440m2` | Villa Tan An Long An 440m2 |
| `/du-an/biet-thu-binh-tan-nha-o-ket-hop-van-phong-550m2` | Biet thu Binh Tan 550m2 ket hop van phong |
| `/du-an/thiet-ke-homestay-nghi-duong-wabi-sabi-130m2` | Homestay nghi duong Wabi Sabi 130m2 |
| `/du-an/can-ho-sunwah-pearl-110m2-minimal-japandi` | Can ho Sunwah Pearl 110m2 Minimal Japandi |
| `/du-an/can-ho-blue-sapphire-quan-6` | Can ho Blue Sapphire Quan 6 |
| `/du-an/thiet-ke-can-ho-carillon7` | Can ho Carillon 7 phong cach hien dai |
| `/du-an/can-ho-luckyplace-quan-6` | Can ho Lucky Place phong cach Wabi Sabi |
| `/du-an/vinhomes-central-park-landmark-1` | Can ho Vinhomes Central Park Landmark 1 |
| `/du-an/copac-square-quan-4` | Can ho Copac Square phong cach FarmHouse |

### Blog / Kinh Nghiem Hay

| URL | Chuc nang / noi dung |
| --- | --- |
| `/blog/du-toan-chi-phi-thiet-ke-thi-cong-noi-that-can-ho-75m2-85m2-moi-nhat` | Du toan chi phi thiet ke thi cong can ho 75-85m2 |
| `/blog/cach-khu-mui-hac-noi-that-go-lua-chon-go-chuan-e1e2-an-toan` | Cach khu mui noi that go, chon go E1/E2 an toan |
| `/blog/o-day-thung-va-canh-tu-bep-go-cong-nghiep-chong-xe-thong-so-chuan-nhat` | Do day thung va canh tu bep go cong nghiep chong xe |
| `/blog/cach-tinh-on-gia-hoan-thien-noi-that-can-ho-theo-m2-hay-goi-tung-hang-muc` | Cach tinh don gia hoan thien noi that can ho |
| `/blog/du-toan-chi-phi-noi-that-biet-thu-cao-cap-2026-chi-tiet-tung-hang-muc` | Du toan chi phi noi that biet thu cao cap 2026 |
| `/blog/kinh-nghiem-chon-on-vi-thiet-ke-thi-cong` | Kinh nghiem chon don vi thiet ke thi cong |
| `/blog/bao-gia-thi-cong-noi-that-can-ho-70m2-tron-goi-tai-tphcm` | Bao gia thi cong noi that can ho 70m2 tai TP.HCM |
| `/blog/toi-uu-hoa-ky-thuat-thi-cong-quy-trinh-kiem-soat-chat-luong-5-buoc-tu-xuong-en-cong-trinh` | Quy trinh kiem soat chat luong tu xuong den cong trinh |
| `/blog/so-sanh-be-mat-melamine-laminate-va-acrylic-loai-nao-chong-tray-xuoc-va-chiu-va-ap-tot-nhat` | So sanh Melamine, Laminate, Acrylic |
| `/blog/chia-se-kien-thuc-chon-cot-van-go-cong-nghiep-2026` | Kinh nghiem chon cot van go cong nghiep |

### Trang Dich Vu / Bai SEO Theo Nhom

| URL | Chuc nang / noi dung |
| --- | --- |
| `/thi-cong-noi-that/biet-thu` | Thi cong thiet ke noi that biet thu |
| `/thi-cong-noi-that/phong-bep` | Thi cong noi that phong bep, tu bep |
| `/thiet-ke-noi-that/chung-cu` | Thiet ke noi that chung cu |
| `/thiet-ke-noi-that/nha-pho` | Thiet ke noi that nha pho |
| `/thiet-ke-noi-that/van-phong` | Thiet ke noi that van phong |
| `/thiet-ke-noi-that/khach-san` | Thiet ke noi that khach san |
| `/thiet-ke-noi-that/nha-hang` | Thiet ke noi that nha hang / quan an |
| `/thiet-ke-noi-that/cafe` | Thiet ke quan cafe |

### Trang Khong Gian / Mau Dep

| URL | Chuc nang / noi dung |
| --- | --- |
| `/khong-gian/phong-ngu` | Mau phong ngu dep |
| `/khong-gian/phong-bep` | Mau phong bep dep |
| `/khong-gian/phong-khach` | Mau phong khach dep |
| `/khong-gian/nha-dep` | Mau nha dep |

## Goi Y Di Link Theo Chu De

### Bai ve thi cong noi that biet thu

- Link ve `/thi-cong-noi-that/biet-thu` neu bai khac dang noi ve thi cong biet thu.
- Link ve `/blog/du-toan-chi-phi-noi-that-biet-thu-cao-cap-2026-chi-tiet-tung-hang-muc` khi noi ve ngan sach biet thu.
- Link ve cac du an biet thu:
  - `/du-an/thiet-ke-biet-thu-neo-classic-the-pearl-riverside-ben-luc-350m2`
  - `/du-an/thiet-ke-biet-thu-300m2-hien-dai-ket-hop-van-phong`
  - `/du-an/thiet-ke-noi-that-villa-binh-phuoc-dark-modern-luxury-400m2`
  - `/du-an/thiet-ke-biet-thu-hien-dai-villa-tan-an-long-an-440m2`
  - `/du-an/biet-thu-binh-tan-nha-o-ket-hop-van-phong-550m2`
- CTA cuoi bai nen link ve `/bao-gia` hoac `/lien-he`.

### Bai ve thi cong / thiet ke phong bep

- Link ve `/thi-cong-noi-that/phong-bep`.
- Link ve `/khong-gian/phong-bep`.
- Link ve `/blog/o-day-thung-va-canh-tu-bep-go-cong-nghiep-chong-xe-thong-so-chuan-nhat`.
- Link ve `/blog/so-sanh-be-mat-melamine-laminate-va-acrylic-loai-nao-chong-tray-xuoc-va-chiu-va-ap-tot-nhat`.
- Link ve `/bao-gia` khi noi ve don gia, du toan.

### Bai ve chung cu / can ho

- Link ve `/thiet-ke-noi-that/chung-cu`.
- Link ve `/blog/du-toan-chi-phi-thiet-ke-thi-cong-noi-that-can-ho-75m2-85m2-moi-nhat`.
- Link ve `/blog/bao-gia-thi-cong-noi-that-can-ho-70m2-tron-goi-tai-tphcm`.
- Link ve du an can ho phu hop:
  - `/du-an/duplex-one-verandah`
  - `/du-an/thiet-ke-noi-that-chung-cu-sunrise-riverside-90m2`
  - `/du-an/can-ho-sunwah-pearl-110m2-minimal-japandi`
  - `/du-an/vinhomes-central-park-landmark-1`
  - `/du-an/copac-square-quan-4`

### Bai ve nha pho

- Link ve `/thiet-ke-noi-that/nha-pho`.
- Link ve du an nha pho:
  - `/du-an/thiet-ke-noi-that-nha-pho-binh-phuoc-hien-dai-180m2`
  - `/du-an/thiet-ke-noi-that-nha-pho-cu-chi-300m2-modern-design`
  - `/du-an/thiet-ke-noi-that-nha-pho-binh-tan-88m2-minimal`
  - `/du-an/thiet-ke-nha-pho-japandi-280m2-2-phong-ngu`

### Bai ve vat lieu / go cong nghiep

- Link ve `/blog/chia-se-kien-thuc-chon-cot-van-go-cong-nghiep-2026`.
- Link ve `/blog/so-sanh-be-mat-melamine-laminate-va-acrylic-loai-nao-chong-tray-xuoc-va-chiu-va-ap-tot-nhat`.
- Link ve `/blog/o-day-thung-va-canh-tu-bep-go-cong-nghiep-chong-xe-thong-so-chuan-nhat`.
- Neu noi ve mui go moi, link ve `/blog/cach-khu-mui-hac-noi-that-go-lua-chon-go-chuan-e1e2-an-toan`.

## Mau CTA Cuoi Bai

Nen ket bai bang CTA mem, co 1-2 link chuyen doi:

```md
Neu ban dang can du toan chi phi truoc khi thi cong, co the xem them [bang bao gia thi cong noi that](/bao-gia) hoac [lien he HEI Design](/lien-he) de duoc tu van phuong an phu hop voi hien trang cong trinh.
```

## Quy Tac External Link Theo Lead Marketing

- External link phai lam tang do tin cay cho noi dung cua HEI, khong day nguoi doc sang doi thu.
- Khong dat anchor text trung voi keyword chinh minh muon SEO neu URL do la trang ngoai.
- Dung external link cho nguon kien thuc, tieu chuan, schema, tai lieu ky thuat, khong dung cho tu khoa dich vu can chuyen doi.
- Neu bai viet noi ve SEO/schema, co the link Google Search Central hoac Schema.org.
- Neu bai viet noi ve hinh anh / toi uu media, co the link Cloudinary docs.
- Neu bai viet noi ve dia chi, showroom, co the link Google Maps cua HEI.

## Checklist Cho AI Khi Chinh Sua File Index.md

1. Doc toan bo bai viet truoc khi chen link.
2. Xac dinh chu de chinh: biet thu, can ho, nha pho, phong bep, vat lieu, chi phi, quy trinh.
3. Chon 3-7 URL internal phu hop tu inventory o tren.
4. Chen link vao cau co san neu cau do da co ngu canh tu nhien.
5. Neu thieu CTA, them 1 doan CTA cuoi bai link ve `/bao-gia` va `/lien-he`.
6. Neu can external link, chi chon nguon uy tin va co lien quan truc tiep.
7. Khong chen link vao tieu de H1/H2/H3 neu khong can thiet.
8. Khong chen link lien tiep qua day trong cung mot doan.
9. Sau khi chen link, doc lai de dam bao cau van tu nhien.

## SQL Cap Nhat Inventory Tu DB

Neu can tao lai danh sach URL moi nhat, co the dung cac cau truy van sau:

```sql
SELECT '/du-an/' || slug AS url, title, summary
FROM projects
ORDER BY updated_at DESC, id DESC;
```

```sql
SELECT '/blog/' || slug AS url, title, excerpt
FROM blog_posts
ORDER BY updated_at DESC, id DESC;
```

```sql
SELECT
  CASE
    WHEN s.code = 'thi-cong-noi-that' THEN '/thi-cong-noi-that/' || t.code
    WHEN s.code = 'thiet-ke-noi-that' THEN '/thiet-ke-noi-that/' || t.code
    WHEN s.code = 'du-an' THEN '/khong-gian/' || t.code
    ELSE '/' || s.code || '/' || t.code
  END AS url,
  pa.title,
  pa.description,
  s.name AS section_name,
  t.name AS type_name
FROM project_articles pa
LEFT JOIN article_sections s ON s.id = pa.section_id
LEFT JOIN article_types t ON t.id = pa.type_id
ORDER BY pa.updated_at DESC, pa.id DESC;
```

