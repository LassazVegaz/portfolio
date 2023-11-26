"use client";
import { useEffect } from "react";

const interval = 100;
const transitionDuration = 900;

const SectionTechsAnimator = () => {
  useEffect(() => {
    const container = document.getElementById("techs-images-container")!;
    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      img.height = 0;
      img.width = 0;
    });
    const imagesCount = images.length;
    const imgSize = images[0].parentElement!.clientWidth;

    let indexes = Array(imagesCount)
      .fill(0)
      .map((_, i) => i);

    const startShow = () => {
      const randomIndex =
        indexes[Math.floor(Math.random() * (indexes.length - 1))];
      const randomImage = images[randomIndex];
      indexes = indexes.filter((i) => i !== randomIndex);
      randomImage.height = imgSize;
      randomImage.width = imgSize;
      randomImage.style.opacity = "1";
      randomImage.style.transition = `${transitionDuration}ms ease-in-out`;
      if (indexes.length > 0) {
        setTimeout(startShow, interval);
      }
    };

    let timer = setTimeout(startShow, interval);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return <></>;
};

export default SectionTechsAnimator;
