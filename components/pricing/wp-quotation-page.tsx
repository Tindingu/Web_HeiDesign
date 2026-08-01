"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, Printer, Trash2 } from "lucide-react";
import { siteConfig } from "@/lib/constants";
import suppliersResponse from "../../data/quotation-suppliers.json";
import productsResponse from "../../data/quotation-products.json";

type Supplier = {
  _id: string;
  name: string;
  address?: string;
};

type MaterialPrice = {
  trademark: string;
  priceValue: string | number;
};

type ProductMaterial = {
  material: {
    name: string;
    description?: string;
    imgUrl?: string[] | false;
    note?: string;
  };
  price?: MaterialPrice[] | null;
};

type Product = {
  _id: string;
  name: string;
  unit: string;
  formulaQuantity?: string;
  formulaPrice?: string;
  size?: {
    width?: string | number | null;
    height?: string | number | null;
    depth?: string | number | null;
  };
  listMaterial?: ProductMaterial[];
};

type QuotationRow = {
  id: string;
  productId: string;
  materialIndex: number;
  length: string;
  width: string;
  height: string;
  note: string;
};

const suppliers = (suppliersResponse as { data: Supplier[] }).data;
const products = (productsResponse as { data: Product[] }).data;

function QuotationDropdown({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((option) => option.value === value);

  return (
    <div
      className={`quotation-dropdown ${isOpen ? "is-open" : ""}`}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="quotation-dropdown-trigger"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{selected?.label || placeholder}</span>
        <span className="quotation-dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <div className="quotation-dropdown-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              className={`quotation-dropdown-option ${
                option.value === value ? "is-selected" : ""
              }`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function createRow(productId = ""): QuotationRow {
  const product = products.find((item) => item._id === productId);

  return {
    id: crypto.randomUUID(),
    productId: product?._id ?? "",
    materialIndex: -1,
    length: product?.size?.width ? String(product.size.width) : "",
    width: product?.size?.depth ? String(product.size.depth) : "",
    height: product?.size?.height ? String(product.size.height) : "",
    note: "",
  };
}

function toNumber(value: string | number | null | undefined) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  return Number(String(value).replace(/[^\d.-]/g, "")) || 0;
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("vi-VN").format(Math.round(value));
}

function formatDate(value: Date) {
  return value.toLocaleDateString("vi-VN");
}

function normalizeFormula(formula: string) {
  return formula
    .replaceAll("Đơn giá", "unitPrice")
    .replaceAll("Khối lượng", "quantity")
    .replaceAll("Dài", "length")
    .replaceAll("Rộng", "width")
    .replaceAll("Cao", "height");
}

function calculateFormula(
  formula: string | undefined,
  values: {
    length: number;
    width: number;
    height: number;
    unitPrice: number;
    quantity: number;
  },
  fallback: number,
) {
  if (!formula) return fallback;
  const normalized = normalizeFormula(formula);

  try {
    const result = Function(
      "length",
      "width",
      "height",
      "unitPrice",
      "quantity",
      "Math",
      `"use strict"; return (${normalized});`,
    )(
      values.length,
      values.width,
      values.height,
      values.unitPrice,
      values.quantity,
      Math,
    );

    return Number.isFinite(Number(result)) ? Number(result) : fallback;
  } catch {
    return fallback;
  }
}

function calculateUnit(product: Product | undefined, row: QuotationRow) {
  const rawUnit = product?.unit?.trim() ?? "";
  if (!rawUnit) return "";

  const unitExpression = rawUnit.replace(/\\"/g, '"');
  const shouldEvaluate =
    unitExpression.includes("?") ||
    unitExpression.includes("Dài") ||
    unitExpression.includes("Rộng") ||
    unitExpression.includes("Cao");

  if (!shouldEvaluate) return rawUnit;

  try {
    const normalized = normalizeFormula(unitExpression);
    const result = Function(
      "length",
      "width",
      "height",
      `"use strict"; return (${normalized});`,
    )(toNumber(row.length), toNumber(row.width), toNumber(row.height));

    return result ? String(result) : "";
  } catch {
    return rawUnit;
  }
}

function getProduct(row: QuotationRow) {
  return products.find((item) => item._id === row.productId);
}

function getMaterial(row: QuotationRow) {
  const product = getProduct(row);
  if (row.materialIndex < 0) return undefined;
  return product?.listMaterial?.[row.materialIndex];
}

function hasPresetDimension(
  product: Product | undefined,
  dimension: "length" | "width" | "height",
) {
  if (!product?.size) return false;
  const value =
    dimension === "length"
      ? product.size.width
      : dimension === "width"
        ? product.size.depth
        : product.size.height;
  return value !== null && value !== undefined && String(value).trim() !== "";
}

function getUnitPrice(row: QuotationRow, supplierId: string) {
  const material = getMaterial(row);
  const supplierPrice = material?.price?.find(
    (item) => item.trademark === supplierId,
  );
  return toNumber(supplierPrice?.priceValue);
}

function getImages(material: ProductMaterial | undefined) {
  const images = material?.material.imgUrl;
  return Array.isArray(images) ? images.filter(Boolean) : [];
}

function resolveImageUrl(url: string) {
  return url.replace("http://localhost:8080", "");
}

function calculateRow(row: QuotationRow, supplierId: string) {
  const product = getProduct(row);
  const unitPrice = getUnitPrice(row, supplierId);
  const length = toNumber(row.length);
  const width = toNumber(row.width);
  const height = toNumber(row.height);
  const quantity = calculateFormula(
    product?.formulaQuantity,
    { length, width, height, unitPrice, quantity: 0 },
    0,
  );
  const total = calculateFormula(
    product?.formulaPrice,
    { length, width, height, unitPrice, quantity },
    unitPrice * quantity,
  );

  return {
    product,
    material: getMaterial(row),
    unitPrice,
    quantity,
    total,
  };
}

export function WpQuotationPage() {
  const quoteRef = useRef<HTMLDivElement>(null);
  const [supplierId, setSupplierId] = useState(suppliers[0]?._id ?? "");
  const [rows, setRows] = useState<QuotationRow[]>([createRow()]);
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quoteDate, setQuoteDate] = useState(formatDate(new Date()));
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);

  useEffect(() => {
    document.body.classList.add("quotation-page-active");
    return () => document.body.classList.remove("quotation-page-active");
  }, []);

  const selectedSupplier = suppliers.find((item) => item._id === supplierId);
  const grandTotal = useMemo(
    () =>
      rows.reduce((sum, row) => sum + calculateRow(row, supplierId).total, 0),
    [rows, supplierId],
  );

  function updateRow(id: string, updates: Partial<QuotationRow>) {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...updates } : row)),
    );
  }

  function addRow() {
    setRows((current) => [...current, createRow()]);
  }

  function removeRow(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa dòng này không ? ")) {
      return;
    }
    setRows((current) =>
      current.length === 1
        ? [createRow()]
        : current.filter((row) => row.id !== id),
    );
  }

  function handlePrint() {
    window.print();
  }

  return (
    <main className="quotation-shell">
      <div className="quotation-form" ref={quoteRef}>
        <section className="quotation-top">
          <div className="logo">
            <img src="/upload/logo/logo_heidesign_white.svg" alt={siteConfig.name} />
          </div>

          <div className="text-container">
            <div className="left-text">
              <div>
                <strong>Email: </strong>
                <span>{siteConfig.email}</span>
              </div>
              <div>
                <strong>Số điện thoại: </strong>
                <span>{siteConfig.displayPhone}</span>
              </div>
              <div>
                <strong>Showroom: </strong>
                <span>{siteConfig.address}</span>
              </div>
              <div>
                <strong>Xưởng sản xuất: </strong>
                <span>
                  Xưởng Sản Xuất: 147/10/7 Lý Tế Xuyên, Hiệp Bình, Thủ Đức, TP HCM.
                </span>
              </div>
            </div>

            <div className="right-text">
              <div>
                <strong>Khách hàng:</strong>
                <input
                  type="text"
                  value={customer}
                  onChange={(event) => setCustomer(event.target.value)}
                />
              </div>
              <div>
                <strong>Số điện thoại:</strong>
                <input
                  type="text"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />
              </div>
              <div>
                <strong>Địa chỉ công trình:</strong>
                <input
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </div>
              <div>
                <strong>Ngày soạn báo giá:</strong>
                <input
                  type="text"
                  value={quoteDate}
                  onChange={(event) => setQuoteDate(event.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="supplier-selection">
          <label htmlFor="quotation-supplier">Chọn nhà cung cấp</label>
          <div className="supplier-select-wrap">
            <select
              id="quotation-supplier"
              className="select-trademark"
              value={supplierId}
              onChange={(event) => setSupplierId(event.target.value)}
            >
              {suppliers.map((supplier) => (
                <option key={supplier._id} value={supplier._id}>
                  {supplier.name}
                </option>
              ))}
            </select>
            <span className="supplier-select-arrow">⌄</span>
          </div>
        </section>

        <section className="price-table">
          <div className="table-header">
            <div className="header-item product">Sản phẩm</div>
            <div className="header-item description">Mô tả</div>
            <div className="size-container">
              <div className="size-top">Kích thước</div>
              <div className="size-bottom">
                <div className="size-item">Dài</div>
                <div className="size-item">Rộng</div>
                <div className="size-item">Cao</div>
              </div>
            </div>
            <div className="header-item unit">Đơn vị</div>
            <div className="header-item weight">Khối lượng</div>
            <div className="header-item price">Đơn giá</div>
            <div className="header-item total">Thành tiền</div>
            <div className="header-item note">Ghi chú</div>
            <div className="header-item reference-image">
              Hình ảnh tham khảo
            </div>
            <div className="header-item delete no-print">Xóa</div>
          </div>

          <div className="table-body">
            {rows.map((row) => {
              const { product, material, unitPrice, quantity, total } =
                calculateRow(row, supplierId);
              const unit = calculateUnit(product, row);
              const images = getImages(material);

              return (
                <div className="table-row" key={row.id}>
                  <div className="table-cell product">
                    <QuotationDropdown
                      value={row.productId}
                      placeholder="Chọn sản phẩm"
                      options={products.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))}
                      onChange={(value) => {
                        const selectedProduct = products.find(
                          (item) => item._id === value,
                        );
                        updateRow(row.id, {
                          productId: value,
                          materialIndex: -1,
                          length: selectedProduct?.size?.width
                            ? String(selectedProduct.size.width)
                            : "",
                          width: selectedProduct?.size?.depth
                            ? String(selectedProduct.size.depth)
                            : "",
                          height: selectedProduct?.size?.height
                            ? String(selectedProduct.size.height)
                            : "",
                        });
                      }}
                    />
                  </div>

                  <div className="table-cell description">
                    <QuotationDropdown
                      value={String(row.materialIndex)}
                      placeholder="-- Chọn mô tả --"
                      options={(product?.listMaterial ?? []).map(
                        (item, index) => ({
                          value: String(index),
                          label:
                            item.material.description ||
                            item.material.name ||
                            "-- Chọn mô tả --",
                        }),
                      )}
                      onChange={(value) =>
                        updateRow(row.id, {
                          materialIndex: Number(value),
                        })
                      }
                    />
                  </div>

                  <div className="table-cell size-item">
                    <input
                      type="number"
                      value={row.length}
                      disabled={hasPresetDimension(product, "length")}
                      onChange={(event) =>
                        updateRow(row.id, { length: event.target.value })
                      }
                    />
                  </div>
                  <div className="table-cell size-item">
                    <input
                      type="number"
                      value={row.width}
                      disabled={hasPresetDimension(product, "width")}
                      onChange={(event) =>
                        updateRow(row.id, { width: event.target.value })
                      }
                    />
                  </div>
                  <div className="table-cell size-item">
                    <input
                      type="number"
                      value={row.height}
                      disabled={hasPresetDimension(product, "height")}
                      onChange={(event) =>
                        updateRow(row.id, { height: event.target.value })
                      }
                    />
                  </div>

                  <div className="table-cell unit">{unit}</div>
                  <div className="table-cell weight">
                    {quantity ? quantity.toFixed(2) : ""}
                  </div>
                  <div className="table-cell price">
                    {formatMoney(unitPrice)} đ
                  </div>
                  <div className="table-cell total">{formatMoney(total)} đ</div>
                  <div className="table-cell note">
                    {row.productId || row.note || material?.material.note ? (
                      <textarea
                        value={row.note || material?.material.note || ""}
                        onChange={(event) =>
                          updateRow(row.id, { note: event.target.value })
                        }
                      />
                    ) : null}
                  </div>
                  <div className="table-cell reference-image">
                    {images[0] ? (
                      <button
                        type="button"
                        className="reference-image-tooltip"
                        onClick={() => setPreviewImages(images)}
                      >
                        <img
                          src={resolveImageUrl(images[0])}
                          alt={material?.material.name ?? product?.name}
                        />
                        {images.length > 1 && (
                          <span className="tooltip-text">
                            {images.length} hình tham khảo
                          </span>
                        )}
                      </button>
                    ) : (
                      <span className="muted-text">Chưa có hình</span>
                    )}
                  </div>
                  <div className="table-cell delete-button no-print">
                    <button
                      type="button"
                      className="delete-buttonn"
                      onClick={() => removeRow(row.id)}
                      aria-label="Xóa dòng"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="add-row-button no-print"
            onClick={addRow}
          >
            <Plus size={18} />
          </button>

          <table className="table-footer">
            <tbody>
              <tr>
                <td className="footer-title">TỔNG CỘNG</td>
                <td className="footer-total">{formatMoney(grandTotal)} đ</td>
                <td className="footer-totdescriptional"></td>
                <td className="footer-note"></td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="note-2">
          <p className="note-text">
            Báo giá trên chỉ mang tính tham khảo, đơn giá có thể thay đổi theo
            bản vẽ kỹ thuật, vật liệu thực tế và khối lượng thi công tại công
            trình. HEI Design sẽ xác nhận lại sau khi khảo sát chi tiết.
          </p>
        </section>
      </div>

      <button
        type="button"
        className="quotation-pdf-button no-print"
        onClick={handlePrint}
      >
        <Printer size={18} />
        Xuất PDF
      </button>

      {previewImages && (
        <div className="image-modal" onClick={() => setPreviewImages(null)}>
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="close"
              onClick={() => setPreviewImages(null)}
              aria-label="Đóng"
            >
              ×
            </button>
            {previewImages.map((image) => (
              <img
                key={image}
                className="large-image"
                src={resolveImageUrl(image)}
                alt="Hình ảnh tham khảo"
              />
            ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        body.quotation-page-active > header,
        body.quotation-page-active > footer {
          display: none !important;
        }

        body.quotation-page-active {
          background: #fff;
          width: fit-content;
          min-width: 100%;
        }

        @media screen and (max-width: 767px) {
          body.quotation-page-active {
            width: max-content;
          }
        }

        .quotation-shell {
          min-height: 100vh;
          background: #fff;
          color: #080808;
          font-family: Arial, sans-serif;
          font-size: 12px;
          overflow-x: auto;
          padding: 20px;
        }

        .quotation-form {
          align-items: flex-start;
          flex-direction: column;
          font-family: Arial, sans-serif;
          font-size: 12px;
          margin: 0 auto;
          min-width: 1500px;
          padding: 20px;
        }

        .quotation-form .logo img {
          height: auto;
          max-width: 150px;
        }

        .quotation-form .text-container {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
          width: 100%;
        }

        .quotation-form .left-text {
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          margin-top: 7px;
          max-width: 55%;
        }

        .quotation-form .left-text div {
          margin-bottom: 13px;
        }

        .quotation-form .right-text {
          align-items: flex-start;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          min-height: 50px;
          width: 430px;
        }

        .quotation-form .right-text div {
          align-items: center;
          display: grid;
          grid-template-columns: 125px 1fr;
          width: 100%;
        }

        .quotation-form .right-text div strong {
          margin-bottom: 1px;
        }

        .quotation-form .right-text input[type="text"] {
          align-items: flex-start;
          background-color: transparent;
          border: none;
          border-bottom: 1px dotted #999;
          height: 20px;
          margin-left: 0;
          margin-right: 10px;
          margin-top: 0;
          overflow-y: auto;
          padding: 5px;
          transition: border 0.3s;
          width: 300px;
        }

        .quotation-form .right-text input[type="text"]:focus {
          outline: none;
        }

        .quotation-form .supplier-selection {
          align-self: flex-start;
          margin-top: 0;
          width: 100%;
        }

        .quotation-form .supplier-selection label {
          display: block;
          font-weight: 700;
        }

        .quotation-form select {
          appearance: none;
          background-color: transparent;
          border: none;
          border-bottom: 1px solid transparent;
          color: #080808;
          font-size: 12px;
          font-weight: 700;
          padding: 0 0 5px;
          width: 100%;
        }

        .quotation-form select:focus {
          outline: none;
        }

        .select-trademark {
          margin: 0;
          padding: 9px 34px 9px 12px !important;
          width: 100% !important;
        }

        .supplier-select-wrap {
          background: #fff;
          border: 1px solid #d8d8d8;
          border-radius: 5px;
          margin-bottom: 12px;
          margin-top: 4px;
          position: relative;
          width: 225px;
        }

        .supplier-select-arrow {
          color: #999;
          font-size: 18px;
          line-height: 1;
          pointer-events: none;
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-56%);
        }

        .quotation-form .price-table {
          align-self: center;
          margin-top: 10px;
          text-align: center;
          width: 100%;
        }

        .table-header {
          background-color: #ff9c04;
          display: flex;
          font-weight: 700;
          justify-content: space-between;
          padding: 0;
          width: 100%;
        }

        .table-header .header-item {
          align-items: center;
          border: 1px solid #000;
          box-sizing: border-box;
          display: grid;
          justify-content: center;
          padding: 5px;
          text-align: center;
        }

        .table-header .product {
          width: 12.7%;
        }

        .table-header .description {
          width: 18.8%;
        }

        .table-header .size-container {
          display: flex;
          flex-direction: column;
          width: 15.6%;
        }

        .table-header .size-top {
          border: 1px solid #000;
          flex: 1;
          padding: 5px;
          text-align: center;
        }

        .table-header .size-bottom {
          display: flex;
          flex: 1;
        }

        .table-header .size-item {
          border: 1px solid #000;
          flex: 1;
          padding: 5px;
          text-align: center;
          width: 5.2%;
        }

        .table-header .unit,
        .table-header .weight {
          width: 5.2%;
        }

        .table-header .price {
          width: 7.8%;
        }

        .table-header .note,
        .table-header .total {
          width: 10.7%;
        }

        .table-header .reference-image {
          width: 11%;
        }

        .table-header .delete {
          width: 2.3%;
        }

        .table-body {
          background-color: #fff;
          border-collapse: collapse;
          font-weight: 400;
          justify-content: space-between;
          padding: 0;
          width: 100%;
        }

        .table-row {
          display: flex;
          position: relative;
          width: 100%;
        }

        .table-row:has(.quotation-dropdown.is-open) {
          z-index: 20;
        }

        .table-body .table-cell {
          border: 1px solid #000;
          box-sizing: border-box;
          min-height: 30px;
          padding-bottom: 2px;
          padding-top: 2px;
          page-break-inside: auto;
          text-align: center;
          white-space: pre-wrap;
        }

        .table-body .product {
          text-align: start;
          width: 12.7%;
        }

        .table-body .description {
          text-align: start;
          width: 18.8%;
        }

        .table-body .description p {
          margin: 4px 6px 0;
        }

        .table-body .size-item {
          text-align: center;
          width: 5.2%;
        }

        .table-body .unit,
        .table-body .weight {
          width: 5.2%;
        }

        .table-body .price {
          width: 7.8%;
        }

        .table-body .total {
          white-space: pre-wrap;
          width: 10.7%;
        }

        .table-body .note {
          width: 10.7%;
        }

        .table-body .reference-image {
          max-height: 100%;
          max-width: 100%;
          width: 11%;
        }

        .table-body .delete-button {
          align-items: center;
          display: flex;
          justify-content: center;
          width: 2.3%;
        }

        .custom-description-select {
          background-color: #f0f0f0;
          font-size: 14px;
          white-space: pre-wrap;
          width: 100%;
        }

        .custom-description-select:hover {
          background-color: #e0e0e0;
        }

        .quotation-dropdown {
          background-color: #fff;
          display: block;
          font-size: 14px;
          position: relative;
          width: 100%;
        }

        .quotation-dropdown-trigger {
          align-items: center;
          background-color: #fff;
          border: 1px solid #d8d8d8;
          border-radius: 4px;
          color: #111;
          cursor: pointer;
          display: flex;
          font-family: Arial, sans-serif;
          font-size: 13px;
          justify-content: space-between;
          line-height: 1.16;
          min-height: 22px;
          padding: 1px 7px;
          text-align: left;
          width: 100%;
        }

        .quotation-dropdown-trigger span:first-child {
          display: block;
          overflow: visible;
        }

        .quotation-dropdown-arrow {
          flex: 0 0 auto;
          font-size: 11px;
          margin-left: 6px;
        }

        .quotation-dropdown-menu {
          background: #fff;
          border: 1px solid #d8d8d8;
          border-top: 0;
          box-shadow: none;
          left: 0;
          max-height: 380px;
          overflow-y: auto;
          position: absolute;
          top: calc(100% - 1px);
          width: 100%;
          z-index: 100;
        }

        .quotation-dropdown-option {
          background: #fff;
          border: 0;
          color: #111;
          cursor: pointer;
          display: block;
          font-family: Arial, sans-serif;
          font-size: 13px;
          line-height: 1.14;
          min-height: 28px;
          padding: 5px 7px;
          text-align: left;
          white-space: normal;
          width: 100%;
        }

        .quotation-dropdown-option:hover,
        .quotation-dropdown-option.is-selected {
          background: #f2f2f2;
        }

        .size-item input {
          border: 1px solid #bbb;
          height: 18px;
          text-align: center;
          transition: border-bottom 0.2s;
          width: 80%;
        }
        .table-cell.size-item,
        .table-body .unit,
        .table-body .weight,
        .table-body .price,
        .table-body .note,
        .table-body .total,
        .table-body .product,
        .table-body .description,
        .table-body .reference-image {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .size-item input:focus {
          border-color: #007bff;
          border-bottom: 2px solid #007bff;
          outline: none;
        }

        .size-item input:disabled {
          background: #fafafa;
          color: #111;
          cursor: not-allowed;
          opacity: 1;
        }

        .table-cell textarea {
          background: transparent;
          border: none;
          height: 20px;
          min-height: 20px;
          padding: 1px 4px;
          resize: vertical;
          width: 92%;
        }

        .table-cell textarea:focus {
          outline: 1px solid #007bff;
        }

        .delete-buttonn {
          align-items: center;
          background-color: #fcfcfc;
          border: none;
          color: #000;
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          padding: 4px;
        }

        .add-row-button {
          align-items: center;
          background-color: #fff;
          border: 1px solid #007bff;
          border-radius: 5px;
          color: #007bff;
          cursor: pointer;
          display: flex;
          justify-content: center;
          margin: 5px auto;
          padding: 5px 200px;
          width: 100%;
        }

        .table-footer {
          background-color: #f7f7f7;
          border-collapse: collapse;
          margin-top: 0;
          width: 100%;
        }

        .table-footer td {
          border: 1px solid #000;
          padding: 8px;
          text-align: center;
        }

        .table-footer .footer-title {
          background-color: #e6e6e6;
          font-weight: 700;
          width: 65.3%;
        }

        .table-footer .footer-total {
          background-color: #f2f2f2;
          font-weight: 700;
          width: 10.7%;
        }

        .footer-totdescriptional {
          width: 13.3%;
        }

        .footer-note {
          width: 10.7%;
        }

        .note-2 {
          margin-top: 20px;
          text-align: center;
        }

        .note-text {
          color: #777;
          font-size: 14px;
        }

        .reference-image-tooltip {
          align-items: center;
          background: transparent;
          border: 0;
          cursor: pointer;
          display: inline-flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .table-cell.reference-image img {
          height: auto;
          max-height: 68px;
          object-fit: contain;
          width: 88%;
        }

        .tooltip-text {
          background-color: #333;
          border-radius: 4px;
          bottom: 125%;
          color: #fff;
          left: 50%;
          opacity: 0;
          padding: 5px;
          position: absolute;
          text-align: center;
          transform: translateX(-50%);
          transition: opacity 0.3s;
          visibility: hidden;
          width: 160px;
          z-index: 1;
        }

        .reference-image-tooltip:hover .tooltip-text {
          opacity: 1;
          visibility: visible;
        }

        .muted-text {
          color: #777;
          font-size: 11px;
        }

        .image-modal {
          background-color: rgba(0, 0, 0, 0.7);
          display: block;
          height: 100%;
          left: 0;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
        }

        .modal-content {
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          left: 50%;
          max-height: 90vh;
          overflow: auto;
          padding: 20px;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: min(900px, 92vw);
        }

        .close {
          background: transparent;
          border: 0;
          cursor: pointer;
          font-size: 24px;
          position: absolute;
          right: 10px;
          top: 10px;
        }

        .large-image {
          display: block;
          margin: 0 auto 12px;
          max-height: 90vh;
          max-width: 90%;
        }

        .quotation-pdf-button {
          align-items: center;
          background: #007bff;
          border: none;
          border-radius: 6px;
          bottom: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.24);
          color: #fff;
          cursor: pointer;
          display: inline-flex;
          font-size: 14px;
          font-weight: 700;
          gap: 8px;
          padding: 12px 18px;
          position: fixed;
          right: 24px;
          z-index: 50;
        }

        @media print {
          @page {
            size: A4 landscape;
            margin: 10mm;
          }

          html,
          body.quotation-page-active {
            background: #fff !important;
            height: auto !important;
            min-width: 0 !important;
            overflow: visible !important;
            width: fit-content !important;
          }

          body.quotation-page-active {
            margin: 0 !important;
            padding: 0 !important;
          }

          .quotation-shell {
            background: #fff !important;
            margin: 0 auto !important;
            min-height: 0 !important;
            min-width: 0 !important;
            overflow: visible !important;
            padding: 0 !important;
            transform: none !important;
            width: fit-content !important;
          }

          .quotation-form {
            margin: 0 auto !important;
            min-width: 1500px !important;
            padding: 20px !important;
            transform: none !important;
            width: 1500px !important;
          }

          .no-print,
          .fixed,
          .floating-contact-buttons,
          .quotation-pdf-button,
          [class*="floating"],
          [class*="lead-capture"],
          body.quotation-page-active > div:has(.fixed) {
            display: none !important;
          }

          .table-header .delete.no-print {
            display: grid !important;
          }

          .table-body .delete-button.no-print {
            display: flex !important;
          }

          .table-body .delete-button .delete-buttonn {
            visibility: hidden !important;
          }

          .table-header,
          .table-row {
            display: flex !important;
            page-break-inside: avoid;
            break-inside: avoid;
            width: 100% !important;
          }

          .table-body .table-cell,
          .table-header .header-item,
          .table-header .size-top,
          .table-header .size-item,
          .table-footer td {
            border-color: #000 !important;
            border-width: 1px !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          @media print {
            .table-header,
            .table-header .header-item,
            .table-header .size-container,
            .table-header .size-top,
            .table-header .size-bottom,
            .table-header .size-item {
              background-color: #ff9c04 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }

          .quotation-dropdown-trigger {
            border: 0 !important;
            min-height: 22px;
            padding: 0 4px;
          }

          .quotation-dropdown-arrow {
            display: none !important;
          }

          .table-cell textarea,
          .quotation-form .right-text input[type="text"] {
            border-color: #bbb !important;
            box-shadow: none !important;
          }

          .table-body .size-item input {
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;
            color: #000 !important;
            font: inherit !important;
            height: auto !important;
            line-height: inherit !important;
            padding: 0 !important;
            text-align: center !important;
            width: 100% !important;
          }

          .table-cell.reference-image img {
            max-height: 68px !important;
          }

          .quotation-form .noprint-border,
          .table-body .noprint-border {
            border: none !important;
          }
        }
      `}</style>
    </main>
  );
}
