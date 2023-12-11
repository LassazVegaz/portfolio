"use client";
import { useState, useEffect, useRef } from "react";

type AnimateFillingTextProps = {
  texts: string[];
};

const AnimateFillingTexts = (props: AnimateFillingTextProps) => {
  const [text, setText] = useState("");
  const index = useRef(0);

  useEffect(() => {
    index.current = 0;
  }, []);

  useEffect(() => {
    if (props.texts.length === 0) return;

    let innerTimer: NodeJS.Timeout;
    const targetText = props.texts[index.current];

    const timer = setTimeout(() => {
      if (text.length < targetText.length) {
        setText((t) => targetText.substring(0, t.length + 1));
      } else {
        index.current = index.current + 1;
        if (index.current >= props.texts.length) {
          index.current = 0;
        }
        innerTimer = setTimeout(() => setText(""), 1000);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      clearTimeout(innerTimer);
    };
  }, [props.texts, text.length]);

  return <h5 className="text-lg sm:text-2xl mt-[10vh]">{text}</h5>;
};

export default AnimateFillingTexts;
