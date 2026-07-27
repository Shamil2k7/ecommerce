"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import styles from "../../add/AddCoupon.module.css";

export default function EditCouponPage() {

  const { id } = useParams();
  const router = useRouter();
  const API = process.env.NEXT_PUBLIC_API_URL;
  const [coupon, setCoupon] = useState({
    name: "",
    code: "",
    discount: "",
    minimumOrderAmount: "",
    maximumDiscount: "",
    usageLimit: "",
    expirydate: "",
    status: "Active",
  });


  const [errors, setErrors] = useState({});
  useEffect(() => {

    if (id) {
      fetchCoupon();
    }

  }, [id]);
  const fetchCoupon = async () => {
    try {

      console.log("Fetching ID:", id);


      const res = await axios.get(
        `${API}/api/marketing/coupons/${id}`,
        {
          withCredentials: true,
        }
      );


      console.log(
        "API DATA:",
        res.data
      );
      // supports both response types
      const data = res.data.coupon || res.data;
      setCoupon({

        name: data.name || "",

        code: data.code || "",

        discount: data.discount ?? "",

        minimumOrderAmount:
          data.minimumOrderAmount ?? "",

        maximumDiscount:
          data.maximumDiscount ?? "",
        usageLimit:
          data.usageLimit ?? "",
        expirydate: data.expirydate
          ? new Date(data.expirydate)
            .toISOString()
            .split("T")[0]
          : "",
        status: data.status || "Active"

      });
    }
    catch (error) {

      console.log(
        "Fetch Coupon Error:",
        error.response?.data || error.message
      );

    }

  };
  const handleChange = (e) => {

    const { name, value } = e.target;


    setCoupon(prev => ({

      ...prev,

      [name]:
        name === "code"
          ? value.toUpperCase()
          : value

    }));
    setErrors(prev => ({

      ...prev,

      [name]: ""

    }));

  };

  const validateForm = () => {
    let newErrors = {};

    if (!coupon.name.trim())
      newErrors.name = "Coupon name is required";


    if (!coupon.code.trim())
      newErrors.code = "Coupon code is required";
    if (!coupon.discount) {
      newErrors.discount = "Discount is required";
    }
    else if (
      Number(coupon.discount) <= 0 ||
      Number(coupon.discount) > 100
    ) {
      newErrors.discount =
        "Discount must be between 1 and 100";
    }
    if (coupon.minimumOrderAmount === "") {
      newErrors.minimumOrderAmount =
        "Minimum order amount is required";
    }
    if (coupon.maximumDiscount === "") {
      newErrors.maximumDiscount =
        "Maximum discount is required";
    }
    if (!coupon.usageLimit) {

      newErrors.usageLimit =
        "Usage limit is required";

    }



    if (!coupon.expirydate) {

      newErrors.expirydate =
        "Expiry date is required";

    }



    setErrors(newErrors);


    return Object.keys(newErrors).length === 0;

  };





  const handleUpdate = async () => {


    if (!validateForm())
      return;



    try {


      await axios.put(

        `${API}/api/marketing/coupons/${id}`,

        coupon,

        {
          withCredentials: true
        }

      );


      alert(
        "Coupon updated successfully"
      );


      router.push(
        "/admin/coupons"
      );


    }
    catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Update failed"
      );

    }


  };





  return (

    <section className={styles.container}>


      <div className={styles.header}>

        <div>

          <Link
            href="/admin/coupons"
            className={styles.back}
          >

            <ArrowLeft size={18} />

            Back to Coupons

          </Link>


          <h1>
            Edit Coupon
          </h1>


          <p>
            Update coupon information
          </p>


        </div>

      </div>



      <div className={styles.card}>


        {[
          ["Coupon Name", "name", "text"],
          ["Coupon Code", "code", "text"],
          ["Discount (%)", "discount", "number"],
          ["Minimum Order Amount", "minimumOrderAmount", "number"],
          ["Maximum Discount", "maximumDiscount", "number"],
          ["Usage Limit", "usageLimit", "number"]

        ].map(([label, name, type]) => (


          <div
            className={styles.field}
            key={name}
          >
            <label>


              {label}
            </label>
            <input
              type={type}
              name={name}
              value={coupon[name] || ""}
              onChange={handleChange}
            />
            {
              errors[name] &&
              <p className={styles.error}>
                {errors[name]}
              </p>
            }
          </div>
        ))}
        <div className={styles.field}>
          <label>
            Expiry Date
          </label>

          <input
            type="date"
            name="expirydate"
            value={coupon.expirydate || ""}
            onChange={handleChange}
          />

          {
            errors.expirydate &&
            <p className={styles.error}>
              {errors.expirydate}
            </p>
          }

        </div>
        <div className={styles.field}>
          <label>
            Status
          </label>
          <select
            name="status"
            value={coupon.status}
            onChange={handleChange}
          >
            <option value="Active">
              Active
            </option>
            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.cancelBtn}
            onClick={() => router.push("/admin/coupons")}
          >
            Cancel
          </button>
          <button
            className={styles.saveBtn}
            onClick={handleUpdate}
          >
            Update Coupon
          </button>
        </div>
      </div>
    </section>
  );
}