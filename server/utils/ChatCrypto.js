import crypto from "crypto";

const getkey = ()=>Buffer.from(process.env.CHAT_SCERET_KEY,"hex");

export const encrypt = (text) =>{
  const iv=crypto.randomBytes(12);
  const cipher =crypto.createCipheriv("aes-256-gcm", getkey(),iv)
  const data=Buffer.concat([cipher.update(String(text),"utf8"),cipher.final()]);
  return{
    iv:iv.toString("hex"),
    data:data.toString("hex"),
    tag:cipher.getAuthTag().toString("hex"),
  };
};
export const decrypt =(payload)=>{
  if(!payload || typeof payload ==="string") return payload;
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",getkey(),Buffer.from(payload.iv,"hex")
  );
  decipher.setAuthTag(Buffer.from(payload.iv,"hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(payload.data, "hex")),
    decipher.final(),
  ]).toString("utf8");
};
