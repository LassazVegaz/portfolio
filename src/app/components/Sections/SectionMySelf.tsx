import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Icons } from "../Icons";

const aboutMeTextDir = path.join(process.cwd(), "src/assets/about-me.md");
const aboutMeText = fs.readFileSync(aboutMeTextDir, "utf8");

export default function SectionMySelf() {
  return (
    <section
      id="about-me"
      className="h-screen flex items-center justify-center"
    >
      <div className="border-2 border-gray-300 rounded-lg shadow-lg max-w-[800px] transition duration-300 hover:shadow-xl">
        <div className="p-10">
          <h4 className="text-4xl text-center mb-4">About Me</h4>

          <div className="text-justify [&>p]:my-2">
            <MDXRemote source={aboutMeText} />
          </div>
        </div>

        <Icons className="flex justify-center items-center gap-10 mb-2" />
      </div>
    </section>
  );
}
