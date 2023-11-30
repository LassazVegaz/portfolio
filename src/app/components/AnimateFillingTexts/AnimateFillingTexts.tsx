"use client";
import { Typography } from "@mui/material";
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
    let targetText = props.texts[index.current];

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

  return (
    <Typography variant="h5" mt="5vh" height={70}>
      {text}
    </Typography>
  );
};

export default AnimateFillingTexts;
