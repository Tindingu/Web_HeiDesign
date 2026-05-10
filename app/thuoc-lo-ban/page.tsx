import dynamic from "next/dynamic";
import { buildMetadata } from "@/lib/seo";
import { RelatedPostsCarousel } from "@/components/blog/related-posts-carousel";
import { getPostCategories, getPostsByCategorySlug } from "@/lib/strapi";

export const metadata = buildMetadata({
  title: "Thước Lỗ Ban",
  path: "/thuoc-lo-ban",
});

const LOBAN_522_GROUPS = [
  {
    name: "QUÝ NHÂN",
    good: true,
    items: ["Quyền lộc", "Trung tín", "Tác quan", "Phát đạt", "Thông minh"],
  },
  {
    name: "HIỂM HỌA",
    good: false,
    items: ["Án thành", "Hỗn nhân", "Thất hiếu", "Tai họa", "Thường bệnh"],
  },
  {
    name: "THIÊN TAI",
    good: false,
    items: ["Hoàn tử", "Quan tài", "Thân tàn", "Thất tài", "Hệ quả"],
  },
  {
    name: "THIÊN TÀI",
    good: true,
    items: ["Thi thơ", "Văn học", "Thanh quý", "Tác lộc", "Thiên lộc"],
  },
  {
    name: "NHÂN LỘC",
    good: true,
    items: ["Trí tồn", "Phú quý", "Tiến bửu", "Thập thiện", "Văn chương"],
  },
  {
    name: "CÔ ĐỘC",
    good: false,
    items: ["Bạc nghịch", "Vô vọng", "Ly tán", "Tửu thục", "Dâm dục"],
  },
  {
    name: "THIÊN TẶC",
    good: false,
    items: ["Phong bệnh", "Chiêu ôn", "Ôn tài", "Ngục tù", "Quang tài"],
  },
  {
    name: "TỂ TƯỚNG",
    good: true,
    items: ["Đại tài", "Thi thơ", "Hoạch tài", "Hiếu tử", "Quý nhân"],
  },
] as const;

const TABLE_REPEAT_COLUMNS = 8;
const BASE_STEP_HUNDREDTHS = 1305; // 13.05 mm
const CYCLE_HUNDREDTHS = 52000; // 520.00 mm

function formatHundredths(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}

const LobanRuler = dynamic(() => import("@/components/loban/LobanRuler"), {
  ssr: false,
});

export default async function ThuocLobanPage() {
  const categories = await getPostCategories();
  const fallbackCategory = "tin-tuc";
  const primaryCategorySlug = categories[0]?.slug ?? fallbackCategory;
  const relatedPosts = (
    await getPostsByCategorySlug(primaryCategorySlug)
  ).slice(0, 8);

  return (
    <main className="bg-background p-6 md:p-8">
      <LobanRuler />
      <section className="mx-auto mt-12 max-w-[1180px] px-1 md:px-0">
        <h1 className="text-2xl font-bold leading-tight text-slate-900 md:text-4xl">
          Thước Lỗ Ban Là Gì? Hướng Dẫn Cách Xem Và Tra Cứu Phong Thủy Chuẩn Xác
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-700">
          Trong thế giới kiến trúc và xây dựng phương Đông, việc chọn lựa kích
          thước không chỉ dừng lại ở bài toán công năng hay thẩm mỹ, mà còn là
          yếu tố tâm linh then chốt nhằm mưu cầu sự bình an và thịnh vượng lâu
          bền. Thước Lỗ Ban chính là báu vật vô giá mà tiền nhân để lại, giúp
          các kiến trúc sư và gia chủ tìm thấy tỷ lệ vàng giữa con người và
          không gian sống, tạo nên sự giao thoa hài hòa giữa nhân khí và địa
          khí.
        </p>

        <h2 className="mt-7 text-xl font-bold text-slate-900 md:text-2xl">
          1. Nguồn Gốc Đại Sư Và Ý Nghĩa Tâm Linh Của Thước Lỗ Ban
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-700">
          Thước Lỗ Ban mang tên người phát minh ra nó - Lỗ Ban, bậc thầy phong
          thủy và là ông tổ của nghề mộc lừng danh Trung Quốc thời Xuân Thu. Từ
          những quan sát tinh tường về quy luật vận hành của vũ trụ, ông đã đúc
          kết nên một hệ thống đo đạc dựa trên các cung mệnh, giúp con người làm
          chủ không gian sống của mình.
        </p>
        <p className="mt-2 text-base leading-7 text-slate-700">
          Trải qua hàng ngàn năm kiểm chứng, Thước Lỗ Ban vượt xa định nghĩa của
          một công cụ vật lý thông thường. Đây là sự kết tinh của các quy luật
          về khí trường, giúp phân định rạch ròi các cung Cát (Tốt) và cung Hung
          (Xấu). Việc áp dụng đúng kích thước phong thủy được tin rằng sẽ giúp
          gia chủ hóa giải sát khí, giảm trừ tai ương từ địa thế và khai thông
          tài vận, đón nhận phúc lộc để gia đạo luôn bình an, công việc hanh
          thông, con cái hiếu thảo.
        </p>

        <h2 className="mt-7 text-xl font-bold text-slate-900 md:text-2xl">
          2. Phân Biệt 3 Loại Thước Lỗ Ban Phổ Biến Trong Xây Dựng
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-700">
          Để đảm bảo tính chính xác tuyệt đối cho từng hạng mục công trình tại
          Việt Nam hiện nay, người dùng cần phân biệt rõ ba loại thước kinh
          điển. Mỗi loại thước tương ứng với một mục đích đo đạc riêng biệt mà
          nếu nhầm lẫn có thể dẫn đến những sai lệch về phong thủy.
        </p>

        <h3 className="mt-5 text-lg font-semibold text-slate-900 md:text-xl">
          Thước Lỗ Ban 52,2cm - Chuyên Đo Khoảng Thông Thủy
        </h3>
        <p className="mt-2 text-base leading-7 text-slate-700">
          Đây là loại thước dành riêng cho các &quot;khoảng rỗng&quot; hay còn
          gọi là nơi không khí và ánh sáng lưu thông. Ứng dụng phổ biến nhất của
          thước 52,2cm là xác định kích thước cửa chính, cửa sổ, ô thoáng hoặc
          cổng nhà. Một lưu ý cốt tử khi sử dụng loại thước này là chỉ đo khoảng
          không gian thông thủy (khoảng lọt lòng), tuyệt đối không tính phần
          khuôn cửa hay vật liệu bao quanh.
        </p>

        <h4 className="mt-6 text-base font-bold uppercase tracking-wide text-slate-900">
          Bảng tra nhanh thước Lỗ Ban 52.2
        </h4>
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-300">
          <table className="w-full min-w-[1050px] border-collapse text-center text-[13px] leading-5">
            <tbody>
              {LOBAN_522_GROUPS.map((group, groupIndex) =>
                group.items.map((item, itemIndex) => {
                  const rowIndex = groupIndex * 5 + itemIndex;
                  const isGood = group.good;
                  const textColorClass = isGood
                    ? "text-red-600"
                    : "text-slate-600";

                  return (
                    <tr
                      key={`${group.name}-${item}`}
                      className="border-b border-slate-300 last:border-b-0"
                    >
                      {itemIndex === 0 && (
                        <td
                          rowSpan={5}
                          className={`w-[160px] border-r border-slate-300 px-3 py-2 align-middle text-sm font-bold ${textColorClass}`}
                        >
                          {group.name}
                        </td>
                      )}
                      <td
                        className={`w-[160px] border-r border-slate-300 px-2 py-1 text-left text-sm font-semibold ${textColorClass}`}
                      >
                        {item}
                      </td>
                      {Array.from({ length: TABLE_REPEAT_COLUMNS }).map(
                        (_, colIndex) => {
                          const hundredths =
                            BASE_STEP_HUNDREDTHS * (rowIndex + 1) +
                            CYCLE_HUNDREDTHS * colIndex;

                          return (
                            <td
                              key={`${group.name}-${item}-${colIndex}`}
                              className={`border-r border-slate-300 px-2 py-1 text-sm font-medium last:border-r-0 ${textColorClass}`}
                            >
                              {formatHundredths(hundredths)}
                            </td>
                          );
                        },
                      )}
                    </tr>
                  );
                }),
              )}
            </tbody>
          </table>
        </div>

        <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
          Thước Lỗ Ban 42,9cm - Đo Khối Đặc Và Dương Trạch
        </h3>
        <p className="mt-2 text-base leading-7 text-slate-700">
          Ngược lại với thước thông thủy, thước 42,9cm được sử dụng cho các chi
          tiết xây dựng thuộc về phần cứng hoặc khối đặc. Bạn sẽ cần đến loại
          thước này khi đo đạc kích thước bếp, bệ bậc, chiều cao nhà hoặc các
          khối trang trí kiến trúc. Việc tuân thủ cung Cát trên thước 42,9cm
          giúp cấu trúc ngôi nhà trở nên vững chãi, tạo điểm tựa phong thủy mạnh
          mẽ cho sự nghiệp và sức khỏe gia chủ.
        </p>

        <h3 className="mt-6 text-lg font-semibold text-slate-900 md:text-xl">
          Thước Lỗ Ban 38,8cm - Đo Âm Phần Và Đồ Nội Thất
        </h3>
        <p className="mt-2 text-base leading-7 text-slate-700">
          Đây là phiên bản thước đặc biệt dành riêng cho thế giới tâm linh và
          các vật dụng gắn liền với đời sống tâm linh gia đình. Ứng dụng quan
          trọng nhất của nó là đo đạc bàn thờ, tủ thờ, khuôn khổ bài vị hoặc các
          chi tiết trong âm phần như mồ mả. Sử dụng đúng kích thước này thể hiện
          lòng thành kính sâu sắc đối với tổ tiên, giúp gia đình đón nhận sự che
          chở và bình an từ mạch nguồn tâm linh.
        </p>

        <h2 className="mt-7 text-xl font-bold text-slate-900 md:text-2xl">
          3. Nguyên Tắc &quot;Vàng&quot; Để Tra Cứu Kích Thước Đại Cát
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-700">
          Để kiến tạo nên một không gian sống hoàn hảo và chuẩn phong thủy,
          nguyên tắc hàng đầu mà bạn cần ghi nhớ chính là: &quot;Đen bỏ - Đỏ
          dùng&quot;.
        </p>
        <p className="mt-2 text-base leading-7 text-slate-700">
          Khi trải nghiệm công cụ tra cứu trực tuyến, bạn nên ưu tiên tuyệt đối
          các kích thước nằm trong khoảng màu đỏ tượng trưng cho cung Cát. Những
          cung như Quý Nhân, Thiên Tài, Tiến Bảo hay Đăng Khoa chính là kim chỉ
          nam giúp gia tăng vượng khí. Ngược lại, những khoảng màu đen thuộc
          cung Hung như Hiểm Họa, Cô Độc, Thiên Tặc hay Tử Tuyệt là những con số
          cần tránh để hạn chế rủi ro, hao tài và những bất trắc không đáng có.
        </p>

        <h2 className="mt-7 text-xl font-bold text-slate-900 md:text-2xl">
          4. Sự Hài Hòa Giữa Phong Thủy Và Kiến Trúc Hiện Đại
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-700">
          Tại HEI Design, chúng tôi tin rằng phong thủy không phải là sự mê tín
          cứng nhắc mà là một bộ môn khoa học về sự sắp xếp không gian. Một
          thiết kế tinh tế là khi các con số may mắn của Thước Lỗ Ban được kết
          hợp nhuần nhuyễn với thẩm mỹ kiến trúc hiện đại và công năng sử dụng
          thực tế.
        </p>
        <p className="mt-2 text-base leading-7 text-slate-700">
          Đừng quá gò ép không gian vào những con số nếu điều đó làm mất đi sự
          cân đối của tổng thể. Hãy để Thước Lỗ Ban trở thành người trợ lý đắc
          lực, giúp bạn tinh chỉnh những chi tiết nhỏ nhất để ngôi nhà không chỉ
          là nơi để ở, mà còn là một tổ ấm bình an, nơi năng lượng tích cực luôn
          tràn đầy trong từng hơi thở của không gian.
        </p>
      </section>
      {relatedPosts.length > 0 && (
        <RelatedPostsCarousel
          posts={relatedPosts}
          categorySlug={primaryCategorySlug}
        />
      )}
    </main>
  );
}
