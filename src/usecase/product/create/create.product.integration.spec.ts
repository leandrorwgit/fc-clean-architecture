import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import CreateProductUsecase from "./create.product.usecase";

describe("integration unit test create product use case", () => {

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

   it ("should create a product", async () => {
      const productRepository = new ProductRepository;
      const usecase = new CreateProductUsecase(productRepository);
      const input = {
         name: "Product 1",
         price: 100,
      }

      const output = {
         id: expect.any(String),
         name: input.name,
         price: input.price,
      }

      const result = await usecase.execute(input);

      expect(result).toEqual(output);
   });

   it ("should throw an error when name is missing", async () => {
      const productRepository = new ProductRepository;
      const usecase = new CreateProductUsecase(productRepository);
      const input = {
         name: "",
         price: 100,
      }

      await expect(usecase.execute(input)).rejects.toThrow("Name is required");
   });

   it ("shoud throw an error when price is less than 0", async () => {
      const productRepository = new ProductRepository;
      const usecase = new CreateProductUsecase(productRepository);
      const input = {
         name: "Product 1",
         price: -1,
      }

      await expect(usecase.execute(input)).rejects.toThrow("Price must be greater than zero");
   });
});