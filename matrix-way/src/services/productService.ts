export interface Product {
  title: string;
  price: number;
}

export async function fetchRandomProduct(): Promise<Product> {
  const res = await fetch("https://dummyjson.com/products");
  const data = await res.json();
  
  const products = data.products;
  const randomIndex = Math.floor(Math.random() * products.length);
  
  return {
    title: products[randomIndex].title,
    price: products[randomIndex].price
  };
}