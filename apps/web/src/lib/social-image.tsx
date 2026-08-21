import { ImageResponse } from "next/og";

export const socialImageAlt =
  "808 Digital Systems: clear websites and simple booking for Lusaka service businesses";
export const socialImageSize = {
  width: 1200,
  height: 630,
};
export const socialImageContentType = "image/png";

export function createSocialImage(): ImageResponse {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f4efe3",
        color: "#26372d",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        overflow: "hidden",
        padding: "64px 72px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#dca548",
          borderRadius: 999,
          height: 300,
          opacity: 0.22,
          position: "absolute",
          right: -70,
          top: -100,
          width: 300,
        }}
      />
      <div
        style={{
          background: "#26372d",
          borderRadius: 999,
          bottom: -180,
          height: 360,
          opacity: 0.08,
          position: "absolute",
          right: 150,
          width: 360,
        }}
      />

      <div
        style={{
          alignItems: "center",
          display: "flex",
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "0.12em",
        }}
      >
        808 DIGITAL SYSTEMS
      </div>

      <div style={{ display: "flex", flexDirection: "column", maxWidth: 880 }}>
        <div
          style={{
            color: "#8a5714",
            display: "flex",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.14em",
            marginBottom: 24,
          }}
        >
          BUILT FOR LUSAKA SERVICE BUSINESSES
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 1.04,
          }}
        >
          Clear websites. Simple booking.
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          borderTop: "2px solid rgba(38,55,45,0.18)",
          display: "flex",
          fontSize: 22,
          justifyContent: "space-between",
          paddingTop: 26,
        }}
      >
        <span>eightzeroeight.online</span>
        <span>Lusaka, Zambia</span>
      </div>
    </div>,
    socialImageSize,
  );
}
