import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "../create/create.product.usecase";
import ListProductUsecase from "./list.product.usecase";

describe("integration test for list products use case", () => {

   let sequelize: Sequelize;

   beforeEach(async () => {
      sequelize = new Sequelize({
         dialect: "sqlite",
         storage: ":memory:",
         logging: false,
         sync: { force: true },
      });

      await sequelize.addModels([ProductModel]);
      await sequelize.sync();
   });

   afterEach(async () => {
      await sequelize.close();
   });

   it("should return all products", async () => {
      const productRepository = new ProductRepository();
      const usecase = new ListProductUsecase(productRepository);
      const createUsecase = new CreateProductUsecase(productRepository);
      
      const input1 = { name: "Product 1", price: 100 }
      const input2 = { name: "Product 2", price: 200 }

      const product1 = await createUsecase.execute(input1);
      const product2 = await createUsecase.execute(input2);

      const result = await usecase.execute({});

      expect(result.products.length).toEqual(2);
      expect(result.products[0].id).toEqual(product1.id);
      expect(result.products[0].name).toEqual(product1.name);
      expect(result.products[0].price).toEqual(product1.price);
      expect(result.products[1].id).toEqual(product2.id);
      expect(result.products[1].name).toEqual(product2.name);
      expect(result.products[1].price).toEqual(product2.price);
   });
});