import Conn from "../db";

interface ProductColumns {
  product_id: number;
  amount: number;
  product_nm: string;
}

class ProductsDB {
  async findById(product_id: number) {
    const productSql = `SELECT * FROM products WHERE product_id = ?`;
    const product: ProductColumns = (await Conn.GetOne(productSql, [
      product_id,
    ])) as ProductColumns;

    return product;
  }
}

export default new ProductsDB();
