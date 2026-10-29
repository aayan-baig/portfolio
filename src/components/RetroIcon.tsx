
import type { CSSProperties, ImgHTMLAttributes } from "react";

import { iconPath, type IconName } from "../icons";

type RetroIconProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  "src" | "width" | "height"
> & {
  name: IconName;
  size?: number;
};

export default function RetroIcon({
  name,
  size = 32,
  alt = "",
  style,
  ...props
}: RetroIconProps) {
  const imageStyle: CSSProperties = {
    width: size,
    height: size,
    flexShrink: 0,
    objectFit: "contain",
    ...style,
  };

  return (
    <img
      {...props}
      src={iconPath(name)}
      alt={alt}
      width={size}
      height={size}
      style={imageStyle}
      draggable={false}
    />
  );
}
