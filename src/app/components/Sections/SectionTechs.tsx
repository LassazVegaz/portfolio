"use client";
import { Box } from "@mui/material";
import NextImage, { StaticImageData } from "next/image";
import dotnetImg from "@/assets/dotnet.png";
import reactImg from "@/assets/react.png";
import { useEffect, useRef, useState } from "react";

const imageGap = 16;
const originalImages: StaticImageData[] = [dotnetImg, reactImg];

type TechImageProps = {
  src: React.ComponentProps<typeof NextImage>["src"];
};
const TechImage = (props: TechImageProps) => (
  <NextImage src={props.src} alt="Techs" width={200} height={200} />
);

const SectionTechs = () => {
  const [images, setImages] = useState<StaticImageData[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerWidth = containerRef.current?.offsetWidth || 0;
    const imageWidth = 200;
    const rowImageCount = Math.floor(containerWidth / (imageWidth + imageGap));
    const rows = Math.ceil(originalImages.length / rowImageCount);
    const newImages: StaticImageData[][] = [];
    for (let i = 0; i < rows; i++) {
      newImages.push(
        originalImages.slice(i * rowImageCount, (i + 1) * rowImageCount)
      );
    }
    setImages(newImages);
  }, []);

  return (
    <Box
      id="techs-images-container"
      ref={containerRef}
      height="100vh"
      p={2}
      display="flex"
      flexDirection="column"
      justifyContent="space-around"
    >
      {images.map((row, i) => (
        <Box
          key={i}
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={2}
        >
          {row.map((image, j) => (
            <TechImage key={j} src={image} />
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default SectionTechs;
