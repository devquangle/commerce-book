import React from "react";
import { Link } from "react-router-dom";
import type { ProductDetailResponse } from "../types/product-detail.type";

interface ProductAttributeProps {
  product: ProductDetailResponse;
}

interface SpecField {
  key: string;
  label: string;
  value: React.ReactNode;
}

import viLocale from "@cospired/i18n-iso-languages/langs/vi.json";
import { getName, registerLocale } from "@cospired/i18n-iso-languages";

registerLocale(viLocale);

const getLanguageName = (code?: string) => {
  if (!code) return "";
  const name = getName(code, "vi");
  if (!name) return code;
  return name.charAt(0).toUpperCase() + name.slice(1);
};
const formatFieldText = (value?: string | null): string => {
  if (!value || !value.trim() || value.trim().toLowerCase() === "khác") {
    return "Chưa cập nhật";
  }
  return value.trim();
};
const ProductAttribute = ({ product }: ProductAttributeProps) => {
  // Lọc ra các thuộc tính có giá trị để hiển thị
  const specs: SpecField[] = [
    {
      key: "authors",
      label: "Tác giả",
      value:
        product.productAuthors && product.productAuthors.length > 0
          ? product.productAuthors.map((author, index) => (
              <span key={author.id}>
                <Link
                  to={`/products?author=${author.slug}`}
                  className="text-blue-600 hover:underline"
                >
                {formatFieldText(author.name)}
                </Link>
                {index < product.productAuthors.length - 1 && ", "}
              </span>
            ))
          : "Đang cập nhật",
    },
    {
      key: "genres",
      label: "Thể loại",
      value:
        product.productGenres && product.productGenres.length > 0
          ? product.productGenres.map((genre, index) => (
              <span key={genre.id}>
                <Link
                  to={`/products?genres=${genre.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  {genre.name}
                </Link>
                {index < product.productGenres.length - 1 && ", "}
              </span>
            ))
          : "Đang cập nhật",
    },
    {
      key: "publisher",
      label: "Nhà xuất bản",
      value: product.productPublisher ? (
        <Link
          to={`/products?publisher=${product.productPublisher.slug}`}
          className="text-blue-600 hover:underline"
        >
          {product.productPublisher.name}
        </Link>
      ) : (
        "Đang cập nhật"
      ),
    },
    {
      key: "isbn",
      label: "Mã sản phẩm (ISBN)",
      value: product.isbn || "Đang cập nhật",
    },

    {
      key: "publishYear",
      label: "Năm xuất bản",
      value: product.publishYear || "Đang cập nhật",
    },
    {
      key: "pages",
      label: "Số trang",
      value: product.pages ? `${product.pages} trang` : "Đang cập nhật",
    },
    {
      key: "weight",
      label: "Trọng lượng",
      value: product.weight ? `${product.weight} gram` : "Đang cập nhật",
    },
    {
      key: "language",
      label: "Ngôn ngữ",
      value: getLanguageName(product.language) || "Đang cập nhật",
    },
  ];

  if (product.productSeries) {
    specs.splice(3, 0, {
      key: "series",
      label: "Series",
      value: (
        <Link
          to={`/products?series=${product.productSeries.slug}`}
          className="text-blue-600 hover:underline"
        >
          {product.productSeries.name}
        </Link>
      ),
    });
  }

  const initialCount = product.productSeries ? 4 : 3;
  const [isExpanded, setIsExpanded] = React.useState(false);



  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Thông tin chi tiết
          </h3>
        </div>
        <div className="p-5">
          <table className="w-full text-sm text-left">
            <tbody>
              {specs.slice(0, initialCount).map((spec, index) => (
                <tr
                  key={spec.key}
                  className={`border-slate-100 ${index === initialCount - 1 && !isExpanded ? '' : 'border-b'}`}
                >
                  <td className="py-3 px-4 w-1/3 bg-slate-50 text-slate-600 font-medium rounded-l-md">
                    {spec.label}
                  </td>
                  <td className="py-3 px-4 text-slate-800 rounded-r-md">
                    {spec.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <table className="w-full text-sm text-left">
                <tbody>
                  {specs.slice(initialCount).map((spec, index) => (
                    <tr
                      key={spec.key}
                      className={`border-slate-100 ${index === specs.length - initialCount - 1 ? '' : 'border-b'}`}
                    >
                      <td className="py-3 px-4 w-1/3 bg-slate-50 text-slate-600 font-medium rounded-l-md">
                        {spec.label}
                      </td>
                      <td className="py-3 px-4 text-slate-800 rounded-r-md">
                        {spec.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {specs.length > initialCount && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-blue-600 font-medium text-sm hover:underline"
              >
                {isExpanded ? "Rút gọn" : "Xem thêm"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductAttribute;
