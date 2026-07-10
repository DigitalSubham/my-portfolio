import Image, { type ImageProps } from "next/image";

type Props = ImageProps & {
  src: string;
};

export default function SmartImage({ src, alt, ...props }: Props) {
  const isExternal = /^https?:\/\//.test(src);

  if (isExternal) {
    const { fill, width, height, priority, sizes, unoptimized, style, ...imgProps } = props;
    void width;
    void height;
    void sizes;
    void unoptimized;

    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...imgProps}
        src={src}
        alt={alt}
        loading={priority ? "eager" : imgProps.loading || "lazy"}
        style={{
          ...style,
          ...(fill
            ? {
                position: "absolute",
                inset: 0,
                height: "100%",
                width: "100%",
              }
            : {}),
        }}
      />
    );
  }

  return <Image src={src} alt={alt} {...props} />;
}
