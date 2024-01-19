import SecureLS from "secure-ls";

export const ls = new SecureLS({
  encodingType: process.env.VUE_APP_ENCODING_TYPE,
  isCompression: true,
  encryptionSecret: process.env.VUE_APP_ENCRYPTION_SECRET,
  encryptionNamespace: process.env.VUE_APP_ENCRYPTION_NAMESPACE,
});

// has permission
export const permissionAbility = (permission, permissions) => {
  return (permissions || []).includes(permission);
};

// minutes to hours converter
export const minutesToHours = (min) => {
  if (!min) return "";

  let hours = min / 60;
  hours = hours.toFixed(2);
  hours = hours.toString();
  return hours.split(".").join(":");
};
