import Joi from "joi";

const handleValidation = (schema, property) => {
  const validate = async (req, res, next) => {
    try {
      const value = await schema.validateAsync(req[property], {
        stripUnknown: true,
      });

      req[property] = value;

      next();
    } catch (error) {
      if (Joi.isError(error)) {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(400).json({
        message: "Something went wrong",
      });
    }
  };

  return validate;
};

export default handleValidation;
