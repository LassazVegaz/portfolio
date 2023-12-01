import fs from "fs";
import path from "path";
import { Box, Typography } from "@mui/material";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Icons } from "../Icons";

const aboutMeTextDir = path.join(process.cwd(), "src/assets/about-me.md");
const aboutMeText = fs.readFileSync(aboutMeTextDir, "utf8");

export default function SectionMySelf() {
  return (
    <Box
      id="about-me"
      component="section"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        border={1}
        maxWidth={800}
        borderRadius={5}
        sx={{
          transitionDuration: "0.3s",
          ":hover": {
            boxShadow: "0 0 11px rgba(33,33,33,.2)",
          },
        }}
      >
        <Box p={5}>
          <Typography textAlign="center" variant="h4">
            About Me
          </Typography>
          <Typography textAlign="justify" component="div">
            <div>
              <MDXRemote source={aboutMeText} />
            </div>
          </Typography>
        </Box>

        <Icons display="flex" gap={5} justifyContent="center" />
      </Box>
    </Box>
  );
}
