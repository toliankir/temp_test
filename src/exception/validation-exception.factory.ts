import { UnprocessableEntityException } from '@nestjs/common';

const validationExceptionFactory = (errors) => {
  const fails = errors.reduce(
    (acc, val) => {
      if (!(val.property in acc)) {
        acc[val.property] = [];
      }
      acc[val.property].push(...Object.values(val.constraints));
      return acc;
    },
    <
      {
        [k: string]: string[];
      }
    >{},
  );
  const error = {
    message: 'Validation failed',
    fails,
  };
  return new UnprocessableEntityException(error);
};

export { validationExceptionFactory };
