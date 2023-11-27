"use client";
import { useEffect } from "react";

const interval = 100;
const transitionDuration = 900;

const runClientCode = () => {
  let mounted = true;
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

  const startImagePopping = () => {
    if (!mounted) return;

    const randomIndex =
      indexes[Math.floor(Math.random() * (indexes.length - 1))];
    const randomImage = images[randomIndex];
    indexes = indexes.filter((i) => i !== randomIndex);
    randomImage.height = imgSize;
    randomImage.width = imgSize;
    randomImage.style.opacity = "1";
    randomImage.style.transition = `${transitionDuration}ms ease-in-out`;
    if (indexes.length > 0) {
      timer = setTimeout(startImagePopping, interval);
    }
  };

  const startShow = () => {
    if (!mounted) return;

    const textEle = document.getElementById("techs-text")!;
    textEle.style.opacity = "0.5";
    textEle.style.fontSize = "1.5rem";
    startImagePopping();
  };

  let timer: NodeJS.Timeout;

  const onScroll = () => {
    if (window.scrollY > container.offsetTop - container.clientHeight / 2) {
      window.scroll({
        behavior: "smooth",
        top: container.offsetTop,
      });
      timer = setTimeout(startShow, interval * 5);
      document.removeEventListener("scroll", onScroll);
    }
  };

  document.addEventListener("scroll", onScroll);

  return () => {
    mounted = false;
    clearTimeout(timer);
    document.removeEventListener("scroll", onScroll);
  };
};

const SectionTechsAnimator = () => {
  useEffect(() => {
    const cleanResources = runClientCode();

    return () => {
      cleanResources();
    };
  }, []);

  return <></>;
};

export default SectionTechsAnimator;
