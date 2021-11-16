import { verifyPassURIWithTrustedIssuers } from "@vaxxnz/nzcp";
import jsQR from "jsqr";

type ParseQrcodeProps = { imageData: ImageData };

export const readQRcode = async ({
  imageData
}: ParseQrcodeProps): Promise<string> => {
  const message = {
    status: "none",
    payload: null
  };
  const code = jsQR(imageData?.data, imageData?.width, imageData?.height);

  if (code?.data) {
    const { data } = code;

    message.status = "success";
    const verification = await verifyPassURIWithTrustedIssuers(data, [
      "did:web:nzcp.covid19.health.nz"
    ]);
    message.payload = { verification, raw: data, timestamp: new Date() };
  }

  return JSON.stringify(message);
};
