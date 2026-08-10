import Image, { type ImageProps } from "next/image";

type SmartImageProps = ImageProps & {
  cloudinaryWidth?: number;
};

function isCloudinaryImage(src: ImageProps["src"]) {
  return typeof src === "string" && src.includes("res.cloudinary.com");
}

function withCloudinaryTransform(src: ImageProps["src"], width?: number) {
  if (typeof src !== "string" || !isCloudinaryImage(src)) return src;
  if (!src.includes("/image/upload/")) return src;
  if (/\/(?:c_|f_|q_|w_)[^/]*\//.test(src)) return src;

  const transforms = ["f_auto", "q_auto:eco", "c_limit"];
  if (width) transforms.push(`w_${width}`);

  return src.replace("/image/upload/", `/image/upload/${transforms.join(",")}/`);
}

function widthFromSizes(sizes?: ImageProps["sizes"]) {
  if (typeof sizes !== "string") return undefined;

  if (sizes.includes("96px")) return 192;
  if (sizes.includes("190px")) return 384;
  if (sizes.includes("288px")) return 576;
  if (sizes.includes("25vw") || sizes.includes("33vw")) return 768;
  if (sizes.includes("50vw") || sizes.includes("60vw")) return 1200;
  if (sizes.includes("70vw") || sizes.includes("82vw") || sizes.includes("90vw")) {
    return 1600;
  }
  if (sizes.includes("100vw")) return 1920;

  return undefined;
}

export function SmartImage({
  src,
  cloudinaryWidth,
  unoptimized,
  sizes,
  ...props
}: SmartImageProps) {
  const shouldBypassVercelOptimizer = isCloudinaryImage(src);
  const transformedSrc = withCloudinaryTransform(
    src,
    cloudinaryWidth ?? widthFromSizes(sizes),
  );

  return (
    <Image
      {...props}
      src={transformedSrc}
      sizes={sizes}
      unoptimized={unoptimized || shouldBypassVercelOptimizer}
    />
  );
}
