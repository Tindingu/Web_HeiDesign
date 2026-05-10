# Admin Project Autofill Console Script

Tài liệu này mô tả cách dùng một đoạn script JavaScript để dán trực tiếp vào Console trên trang `https://heidesign.vn/admin/projects/new` nhằm tự động điền dữ liệu cho form dự án.

Script được viết theo code hiện tại của form `ProjectForm` trong repository này. Form hiện tại không dùng `id` cố định cho các ô nhập, nên script sẽ nhận diện theo:

1. Tiêu đề section (`legend`)
2. Text của `label`
3. Text của nút `button`
4. Thứ tự các ô con trong từng khối

Điểm quan trọng:

1. Các ô `URL ảnh` sẽ không tự điền, để trống cho bạn dán tay.
2. Các ô `Alt Text` sẽ được tự động điền từ dữ liệu script.
3. Nếu dữ liệu yêu cầu nhiều hàng hơn số ô đang có, script sẽ tự bấm nút `+ Thêm ...` cho đến khi đủ.
4. Script có thể dùng cho cả phần ảnh bìa, gallery, sections, highlights và các ô thông tin cơ bản.

## 1. Bản đồ form hiện tại

Theo code hiện tại của `components/admin/project-form.tsx`, các khối chính là:

- Thông Tin Cơ Bản
  - `Slug*`
  - `Tiêu Đề*`
  - `Mô Tả Ngắn*`
  - `Mô Tả Chi Tiết*`
  - `Loại Hình`
  - `Phong Cách`
  - `Ngân Sách`
- Ảnh Bìa
  - `URL Ảnh*`
  - `Alt Text`
- Hình Ảnh Dự Án
  - danh sách ảnh gallery có thể thêm bằng nút `+ Thêm Ảnh Mới`
  - mỗi ảnh có `URL Ảnh N` và `Alt Text`
- Chi Tiết Các Phòng/Khu Vực
  - danh sách section có thể thêm bằng nút `+ Thêm Phòng/Khu Vực Mới`
  - mỗi section có `Tiêu Đề Phòng/Khu Vực N`, `Nội Dung Mô Tả`, `URL Hình Ảnh`, `Alt Text Hình Ảnh`
- Điểm Nổi Bật
  - danh sách highlight có thể thêm bằng nút `+ Thêm Điểm Nổi Bật Mới`
- Chi Tiết Dự Án
  - `Diện Tích`
  - `Thời Gian`
  - `Phạm Vi`
  - `Khách Hàng`
  - `Địa Điểm`
- Bài Viết Từ Word
  - chỉ dùng nếu bạn muốn dán markdown bài viết sau chuyển đổi

## 2. Cách chuẩn bị dữ liệu

Bạn sẽ truyền vào script một object `DATA` theo cấu trúc sau:

```js
const DATA = {
  slug: "du-an-abc",
  title: "Dự án ABC",
  summary: "Mô tả ngắn dự án",
  description: "Mô tả chi tiết dự án",
  category: "Biệt Thự",
  style: "Tân cổ điển",
  budget: "3-5 tỷ",
  coverImageAlt: "Ảnh bìa dự án ABC",
  gallery: [{ alt: "Phòng khách dự án ABC" }, { alt: "Phòng bếp dự án ABC" }],
  sections: [
    {
      title: "Phòng khách",
      content: "Mô tả phòng khách...",
      imageAlt: "Alt phòng khách",
    },
  ],
  highlights: ["Thiết kế sang trọng", "Thi công đúng tiến độ"],
  projectDetails: {
    area: "320 m²",
    duration: "6 tháng",
    scope: "Thiết kế + Thi công",
    client: "Khách hàng A",
    location: "TP.HCM",
  },
};
```

Lưu ý:

1. `gallery`, `sections`, `highlights` là mảng.
2. Bạn chỉ cần nhập `alt` cho ảnh. `url` để trống vì bạn sẽ tự dán link sau.
3. Nếu muốn script tự thêm đúng số dòng, chỉ cần tăng số phần tử trong mảng.

## 3. Script dán vào Console

Dán nguyên khối sau vào Console của trình duyệt khi đang ở trang `https://heidesign.vn/admin/projects/new`.

```js
(async () => {
  const DATA = {
    slug: "du-an-abc",
    title: "Dự án ABC",
    summary: "Mô tả ngắn dự án",
    description: "Mô tả chi tiết dự án",
    category: "Biệt Thự",
    style: "Tân cổ điển",
    budget: "3-5 tỷ",
    coverImageAlt: "Ảnh bìa dự án ABC",
    gallery: [{ alt: "Phòng khách dự án ABC" }, { alt: "Phòng bếp dự án ABC" }],
    sections: [
      {
        title: "Phòng khách",
        content: "Mô tả phòng khách...",
        imageAlt: "Alt phòng khách",
      },
      {
        title: "Phòng bếp",
        content: "Mô tả phòng bếp...",
        imageAlt: "Alt phòng bếp",
      },
    ],
    highlights: ["Thiết kế sang trọng", "Thi công đúng tiến độ"],
    projectDetails: {
      area: "320 m²",
      duration: "6 tháng",
      scope: "Thiết kế + Thi công",
      client: "Khách hàng A",
      location: "TP.HCM",
    },
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const visibleText = (el) =>
    (el?.innerText || el?.textContent || "").replace(/\s+/g, " ").trim();

  const allInputs = () =>
    Array.from(document.querySelectorAll("input, textarea, select, button"));

  const findFieldByLabel = (labelText) => {
    const labels = Array.from(document.querySelectorAll("label"));
    const label = labels.find((node) => visibleText(node) === labelText);
    if (!label) return null;

    const wrapper =
      label.closest("div, fieldset, section, article") || label.parentElement;
    if (!wrapper) return null;

    const field = wrapper.querySelector("input, textarea, select");
    if (field) return field;

    const forId = label.getAttribute("for");
    if (forId) {
      return document.getElementById(forId);
    }

    return null;
  };

  const setNativeValue = (element, value) => {
    if (!element) return false;
    const proto =
      element instanceof HTMLTextAreaElement
        ? window.HTMLTextAreaElement.prototype
        : window.HTMLInputElement.prototype;
    const descriptor = Object.getOwnPropertyDescriptor(proto, "value");
    if (!descriptor?.set) return false;
    descriptor.set.call(element, value);
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };

  const setSelectValue = (select, value) => {
    if (!select) return false;
    const option = Array.from(select.options).find(
      (opt) => opt.value === value || opt.textContent?.trim() === value,
    );
    if (!option) return false;
    select.value = option.value;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    return true;
  };

  const clickButtonByText = async (text, count = 1) => {
    const buttons = () =>
      Array.from(document.querySelectorAll("button")).filter(
        (button) =>
          visibleText(button) === text || visibleText(button).includes(text),
      );
    for (let i = 0; i < count; i += 1) {
      const button = buttons()[0];
      if (!button) throw new Error(`Không tìm thấy nút: ${text}`);
      button.click();
      await sleep(150);
    }
  };

  const ensureRows = async (buttonText, currentCountFn, targetCount) => {
    while (currentCountFn() < targetCount) {
      await clickButtonByText(buttonText, 1);
      await sleep(100);
    }
  };

  const getGalleryRows = () => {
    const buttons = Array.from(document.querySelectorAll("button")).filter(
      (button) => visibleText(button) === "Xóa",
    );
    const galleryBlocks = buttons
      .map((button) =>
        button.closest("div.rounded-lg.border.border-gray-200.p-4"),
      )
      .filter(Boolean);
    return galleryBlocks.filter((block) =>
      block.querySelector("label")?.textContent?.includes("URL Ảnh"),
    );
  };

  const getSectionRows = () => {
    const buttons = Array.from(document.querySelectorAll("button")).filter(
      (button) => visibleText(button) === "Xóa",
    );
    const sectionBlocks = buttons
      .map((button) =>
        button.closest("div.rounded-lg.border.border-gray-200.p-4"),
      )
      .filter(Boolean);
    return sectionBlocks.filter((block) =>
      block
        .querySelector("label")
        ?.textContent?.includes("Tiêu Đề Phòng/Khu Vực"),
    );
  };

  const getHighlightRows = () => {
    const buttons = Array.from(document.querySelectorAll("button")).filter(
      (button) => visibleText(button) === "Xóa",
    );
    const rows = buttons.map((button) => button.parentElement).filter(Boolean);
    return rows.filter(
      (row) => row.querySelector("input") && !row.querySelector("label"),
    );
  };

  const fillBasic = () => {
    setNativeValue(findFieldByLabel("Slug*"), DATA.slug);
    setNativeValue(findFieldByLabel("Tiêu Đề*"), DATA.title);
    setNativeValue(findFieldByLabel("Mô Tả Ngắn*"), DATA.summary);
    setNativeValue(findFieldByLabel("Mô Tả Chi Tiết*"), DATA.description);
    setNativeValue(findFieldByLabel("Ngân Sách"), DATA.budget || "");

    const categorySelect = findFieldByLabel("Loại Hình");
    if (categorySelect?.tagName === "SELECT")
      setSelectValue(categorySelect, DATA.category || "");

    const styleSelect = findFieldByLabel("Phong Cách");
    if (styleSelect?.tagName === "SELECT")
      setSelectValue(styleSelect, DATA.style || "");
  };

  const fillCover = () => {
    setNativeValue(findFieldByLabel("Alt Text"), DATA.coverImageAlt || "");
  };

  const fillGallery = async () => {
    const target = DATA.gallery.length;
    const countRows = () => getGalleryRows().length;
    await ensureRows("+ Thêm Ảnh Mới", countRows, target);
    const rows = getGalleryRows();

    rows.slice(0, target).forEach((row, index) => {
      const inputs = Array.from(row.querySelectorAll("input"));
      const urlInput =
        inputs.find((input) =>
          (input.previousElementSibling?.textContent || "").includes("URL Ảnh"),
        ) || inputs[0];
      const altInput =
        inputs.find((input) =>
          (input.previousElementSibling?.textContent || "").includes(
            "Alt Text",
          ),
        ) || inputs[1];
      if (urlInput) setNativeValue(urlInput, "");
      if (altInput) setNativeValue(altInput, DATA.gallery[index]?.alt || "");
    });
  };

  const fillSections = async () => {
    const target = DATA.sections.length;
    const countRows = () => getSectionRows().length;
    await ensureRows("+ Thêm Phòng/Khu Vực Mới", countRows, target);
    const rows = getSectionRows();

    rows.slice(0, target).forEach((row, index) => {
      const fields = Array.from(row.querySelectorAll("input, textarea"));
      const titleInput =
        fields.find((field) =>
          field.getAttribute("placeholder")?.includes("Phòng Khách"),
        ) || fields[0];
      const contentInput =
        fields.find(
          (field) => field.tagName === "TEXTAREA" && field !== titleInput,
        ) || fields[1];
      const urlInput =
        fields.find((field) =>
          field.getAttribute("placeholder")?.includes("/upload/projects/"),
        ) || fields[2];
      const altInput = fields[fields.length - 1];

      const section = DATA.sections[index] || {};
      if (titleInput) setNativeValue(titleInput, section.title || "");
      if (contentInput) setNativeValue(contentInput, section.content || "");
      if (urlInput) setNativeValue(urlInput, "");
      if (altInput) setNativeValue(altInput, section.imageAlt || "");
    });
  };

  const fillHighlights = async () => {
    const target = DATA.highlights.length;
    const countRows = () => getHighlightRows().length;
    await ensureRows("+ Thêm Điểm Nổi Bật Mới", countRows, target);
    const rows = getHighlightRows();

    rows.slice(0, target).forEach((row, index) => {
      const input = row.querySelector("input");
      if (input) setNativeValue(input, DATA.highlights[index] || "");
    });
  };

  const fillProjectDetails = () => {
    setNativeValue(
      findFieldByLabel("Diện Tích"),
      DATA.projectDetails.area || "",
    );
    setNativeValue(
      findFieldByLabel("Thời Gian"),
      DATA.projectDetails.duration || "",
    );
    setNativeValue(
      findFieldByLabel("Phạm Vi"),
      DATA.projectDetails.scope || "",
    );
    setNativeValue(
      findFieldByLabel("Khách Hàng"),
      DATA.projectDetails.client || "",
    );
    setNativeValue(
      findFieldByLabel("Địa Điểm"),
      DATA.projectDetails.location || "",
    );
  };

  fillBasic();
  fillCover();
  await fillGallery();
  await fillSections();
  await fillHighlights();
  fillProjectDetails();

  console.log("Đã điền xong các ô văn bản và tự động thêm đủ dòng cần thiết.");
  console.log(
    "Bạn cần tự dán link ảnh vào các ô URL ảnh còn trống, rồi kiểm tra lại trước khi lưu.",
  );
})();
```

## 4. Cách dùng từng bước

1. Mở `https://heidesign.vn/admin/projects/new`
2. Mở DevTools bằng `F12`
3. Chuyển sang tab `Console`
4. Dán script ở trên
5. Sửa object `DATA` theo dự án thực tế của bạn
6. Nhấn `Enter`
7. Script sẽ:
   - điền các ô text và textarea
   - chọn `Loại Hình` và `Phong Cách` nếu giá trị trùng option
   - tự bấm nút thêm gallery/section/highlight cho đủ số dòng
   - điền `Alt Text`
   - để trống các ô `URL ảnh`

## 5. Lưu ý quan trọng khi dùng AI để sinh dữ liệu

Nếu bạn muốn dùng AI khác để sinh dữ liệu cho script, hãy gửi cho AI file này kèm yêu cầu sau:

1. Chỉ tạo object `DATA`, không sửa logic script.
2. `gallery`, `sections`, `highlights` phải đúng số lượng bạn muốn thêm.
3. Mỗi phần tử gallery chỉ cần `alt`.
4. Mỗi phần tử section cần `title`, `content`, `imageAlt`.
5. Không tự điền link ảnh vào script vì bạn sẽ dán tay sau.

## 6. Vì sao không có id cố định

Trong code form hiện tại, các input không được gắn `id` riêng theo kiểu `slug-input` hay `gallery-1-alt`. Do đó:

1. Script không thể dựa vào id ổn định.
2. Cách an toàn nhất là bám theo nhãn `label` và nút `button`.
3. Nếu sau này bạn thêm `id` vào form, script có thể nâng cấp để target trực tiếp bằng id.

## 7. Nếu bạn muốn mình chuẩn hóa thêm

Mình có thể viết tiếp một bản nâng cao gồm:

1. Script nhận input JSON từ clipboard thay vì sửa tay trong code.
2. Script có thể tự đọc dữ liệu từ file `.json` rồi fill form.
3. Script có thể hỗ trợ cả trang `edit` lẫn `new`.
