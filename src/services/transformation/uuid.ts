import Bun from "bun";
import { v5 as uuid, v4 as generateRandomUUID } from "uuid";

export const get = (str?: string | Uint8Array, ns?: string) => {
  if (typeof str === "undefined") {
    return generateRandomUUID();
  }
  const namespace = ns ?? Bun.env.NAMESPACE;
  if (!namespace) {
    throw Error(
      "Namespace is not set and is necessary to convert a string to UUID."
    );
  }
  return uuid(str, namespace);
};
