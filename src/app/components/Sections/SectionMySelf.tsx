import fs from "fs";
import path from "path";
import { Box, Typography } from "@mui/material";
import { MDXRemote } from "next-mdx-remote/rsc";

const aboutMeTextDir = path.join(process.cwd(), "src/assets/about-me.md");
const aboutMeText = fs.readFileSync(aboutMeTextDir, "utf8");

export default function SectionMySelf() {
  return (
    <Box
      component="section"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        border={1}
        maxWidth={800}
        height="72%"
        borderRadius={5}
        p={5}
        sx={{
          transitionDuration: "0.3s",
          ":hover": {
            boxShadow: "0 0 11px rgba(33,33,33,.2)",
          },
        }}
      >
        <Typography textAlign="center" variant="h4">
          About Me
        </Typography>
        <Typography textAlign="justify">
          <MDXRemote source={aboutMeText} />
        </Typography>
      </Box>
    </Box>
  );
}
