import Banner from "@/components/Banner/Banner";
import Categories from "@/components/Categories/Categories";
import CategoryBar from "@/components/categoryBar/CategoryBar";
import Hero from "@/components/hero/Hero";
import ProductsList from "@/components/ProductsList/ProductsList";
import TopProducts from "@/components/TopProducts/TopProducts";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <CategoryBar />
      <Hero />
      <Categories />
      <TopProducts />
      <Banner />
      <ProductsList />
    </div>
  );
}
