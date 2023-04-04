import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { httpGet } from "./fetch";

const path = "/coupon";
export interface CouponType {
  title: string;
  id: string;
  shop_title: string;
  step_condition: number;
  coupon_condition: string;
  shop_image_url: string;
  shop_id: string;
}

interface CouponDataType {
  items: CouponType[];
  meta: {
    currentPage: number; // ex: 1
    itemsPerPage: number; // ex: 10
    totalItem: number; // ex: 55
    totalPage: number; // ex: 6
  };
}

// pagination is done on the backend, we just need to keep track of the current page and fetch the data for that page
export default function useCouponPagination() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [data, setData] = useState<CouponType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    setLoading(true); // set loading to true
    setError(null);
    httpGet(path, { params: { page } })
      .then((response: AxiosResponse<CouponDataType>) => {
        setData(response.data.items);
        setTotalPages(response.data.meta.totalPage);
        setTotalItems(response.data.meta.totalItem);
        setItemsPerPage(response.data.meta.itemsPerPage);
      })
      .catch((err: any) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  return {
    data,
    loading,
    error,
    page,
    setPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };
}
