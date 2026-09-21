import React from 'react';
import ProductSlider from './ProductSlider';
import type { ProductCardResponse } from '../../modules/product/types/product-card.type';

interface ProductFlashSaleProps {
  products: ProductCardResponse[];
}

const ProductFlashSale = ({ products }: ProductFlashSaleProps) => {
  return (
    <ProductSlider 
      title="🔥 Flash Sale" 
      products={products} 
      id="flashsale" 
      hideShop={true} 
      rows={1}
    />
  );
}

export default ProductFlashSale;