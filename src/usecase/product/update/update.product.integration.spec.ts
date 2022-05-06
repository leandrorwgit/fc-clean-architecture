import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "../create/create.product.usecase";
import UpdateProductUsecase from "./update.product.usecase";

describe("Integration test update product use case", () => {

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

   it("Should update a product", async() => {
      const productRepository = new ProductRepository;
      const usecase = new UpdateProductUsecase(productRepository);
      const createUsecase = new CreateProductUsecase(productRepository);
      
      const inputInsert = { name: "Product 1", price: 100 }
      const product = await createUsecase.execute(inputInsert);

      const inputUpdate = {
         id: product.id,
         name: "Produto 1 Updated",
         price: 200,
      }

      const result = await usecase.execute(inputUpdate);

      await expect(result).toEqual(inputUpdate);
   });

   it("Should throw an error when name is required", async() => {
      const productRepository = new ProductRepository();
      const usecase = new UpdateProductUsecase(productRepository);
      const createUsecase = new CreateProductUsecase(productRepository);
      
      const inputInsert = { name: "Product 1", price: 100 }
      const product = await createUsecase.execute(inputInsert);

      const inputUpdate = {
         id: product.id,
         price: 200,
      }

      await expect(usecase.execute(inputUpdate)).rejects.toThrow("product: Name is required");
   });

   it("Should throw an error when price is less than zero", async() => {
      const productRepository = new ProductRepository();
      const usecase = new UpdateProductUsecase(productRepository);
      const createUsecase = new CreateProductUsecase(productRepository);
      
      const inputInsert = { name: "Product 1", price: 100 }
      const product = await createUsecase.execute(inputInsert);

      const inputUpdate = {
         id: product.id,
         name: "Product 1",
         price: -1,
      }

      await expect(usecase.execute(inputUpdate)).rejects.toThrow("product: Price must be greater than zero");
   });

});