import { nanoid } from "nanoid";
import { checkUIDExist } from "./redisHelper.js";

export const generateUID = async (REDIS_KEY) => {
  let id;
  let key;
  do {
    id = nanoid(6);
    key = REDIS_KEY + id;
  } while (await checkUIDExist(key));
  return id;
};
