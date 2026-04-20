const tiers = [
  {
    name: "Tiêu chuẩn",
    highlight: false,
    price: "~9 triệu / m²",
    pros: [
      "Nhà cung cấp tin cậy",
      "Hoàn thiện cơ bản",
      "Chiếu sáng tiêu chuẩn",
    ],
    cons: ["Thủ công hạn chế", "Bảng vật liệu cơ bản"],
  },
  {
    name: "Cao cấp",
    highlight: true,
    price: "~11.5 triệu / m²",
    pros: ["Đồ gỗ thủ công", "Đá nhập khẩu", "Chiếu sáng cao cấp"],
    cons: ["Thời gian dài hơn"],
  },
  {
    name: "Đẳng cấp",
    highlight: false,
    price: "~14 triệu / m²",
    pros: ["Thủ công cao cấp", "Phụ kiện sang trọng", "Sưu tầm nghệ thuật"],
    cons: ["Chi phí cao nhất"],
  },
];

export function SmartComparison() {
  return (
    <div className="space-y-6 rounded-2xl border border-border/60 bg-background p-6 shadow-soft">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          So sánh thông minh
        </p>
        <h3 className="text-2xl font-semibold">So sánh gói vật liệu</h3>
        <p className="text-sm text-muted-foreground">
          Ưu nhược điểm rõ ràng với gợi ý gói được khuyến nghị cho sự cân bằng
          hoàn hảo.
        </p>
      </div>
      <div className="grid gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-xl border p-4 ${
              tier.highlight
                ? "border-primary bg-primary/10"
                : "border-border/60 bg-muted/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">{tier.name}</h4>
              <span className="text-sm text-muted-foreground">
                {tier.price}
              </span>
            </div>
            <div className="mt-3 grid gap-2 text-sm">
              {tier.pros.map((item) => (
                <p key={item}>+ {item}</p>
              ))}
              {tier.cons.map((item) => (
                <p key={item} className="text-muted-foreground">
                  - {item}
                </p>
              ))}
            </div>
            {tier.highlight ? (
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-primary">
                Khuyến nghị
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
