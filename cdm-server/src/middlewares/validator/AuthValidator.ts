import { body } from "express-validator";
import { handleValidation } from "./general";

const login = [
  body("email").isEmail().withMessage("Invalid Email"),
  body("password")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Password is required"),

  handleValidation,
];

const AuthValidator = { login };
export default AuthValidator;
