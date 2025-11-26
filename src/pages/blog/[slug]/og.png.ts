import { siteConfig } from "@/config/site.js";
import { getCollection, type CollectionEntry } from "astro:content";
import fs from "fs";
import path from "path";
import { ImageResponse } from "@vercel/og";

interface Props {
  params: { slug: string };
  props: { post: CollectionEntry<"post"> };
}

export async function GET({ props, params }: Props) {
  const { post } = props;
  const { slug } = params;

  if (!slug) {
    return new Response("Slug parameter is required", { status: 400 });
  }

  const postCover = await fs.promises.readFile(
    path.resolve("./src/assets/logo.png")
  );

  const html = {
    type: "div",
    props: {
      children: [
        {
          type: "div",
          props: {
            tw: "pl-8 shrink flex text-shadow-lg/30",
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontSize: "48px",
                    fontFamily: "DM Mono Bold",
                    backgroundImage:
                      "linear-gradient(90deg, rgb(0, 124, 240), rgb(0, 223, 21))",
                    backgroundClip: "text",
                    "-webkit-background-clip": "text",
                    color: "transparent",
                  },
                  children: post.data.title,
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            // using tailwind
            tw: "absolute top-[32px] right-[32px] w-[120px] h-[120px] flex",
            children: [
              {
                type: "img",
                props: {
                  src: postCover.buffer,
                },
              },
            ],
          },
        },

        {
          type: "div",
          props: {
            tw: "absolute left-[40px] bottom-[40px] flex items-center",
            children: [
              {
                type: "div",
                props: {
                  tw: "text-3xl",
                  style: {
                    fontFamily: "DM Mono Bold",
                  },
                  children: post.data.publishDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }),
                },
              },
            ],
          },
        },
        {
          type: "div",
          props: {
            tw: "absolute right-[40px] bottom-[40px] flex items-center",
            children: [
              {
                type: "div",
                props: {
                  tw: "text-3xl float-left",
                  style: {
                    fontFamily: "Space Grotesk Regular",
                  },
                  children: siteConfig.author,
                },
              },
              {
                type: "div",
                props: {
                  tw: "px-2 text-3xl",
                  style: {
                    fontSize: "30px",
                  },
                  children: "|",
                },
              },
              {
                type: "div",
                props: {
                  tw: "text-3xl",
                  children: siteConfig.title,
                },
              },
            ],
          },
        },
      ],
      tw: "w-full h-full flex items-center justify-center relative px-22",
      style: {
        background: "#f7f8e8",
        backgroundImage:
          "radial-gradient(circle at 32px 32px, lightgray 2%, transparent 0%), radial-gradient(circle at 72px 72px, lightgray 2%, transparent 0%)",
        backgroundSize: "200px 200px",
      },
    },
  };

  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: "DM Mono Bold",
        data: await fs.readFileSync("./src/assets/fonts/DMMono-Medium.ttf"),
        style: "normal",
        weight: 700,
      },
      {
        name: "Space Grotesk Regular",
        data: await fs.readFileSync(
          "./src/assets/fonts/SpaceGrotesk-Regular.otf"
        ),
        style: "normal",
        weight: 400,
      },
    ],
  });
}

// to generate an image for each blog posts in a collection
export async function getStaticPaths() {
  const blogPosts = await getCollection("post");
  return blogPosts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}
