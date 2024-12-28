type Get = {
  expiry?: boolean;
};
export const get = ({ expiry }: Get) => {
  const now = new Date();
  if (expiry) {
    const expiryDate = new Date();
    expiryDate.setDate(now.getDate() + 3);
    return expiryDate;
  }
  return now;
};
