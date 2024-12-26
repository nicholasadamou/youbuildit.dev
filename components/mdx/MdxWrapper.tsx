import { useMDXComponent } from "next-contentlayer/hooks";

import Alert from "@/components/mdx/Alert";
import LinkPreview from "@/components/mdx/LinkPreview";
import PlantUML from "@/components/mdx/PlantUML";
import CustomImage from "@/components/mdx/Image";
import CustomLink from "@/components/mdx/CustomLink";
import YouTubeEmbed from "@/components/mdx/YouTube/YouTubeEmbed";

const components = {
	Image: CustomImage,
	a: CustomLink,
	Link: CustomLink,
	Alert: Alert,
	LinkPreview: LinkPreview,
	plantuml: PlantUML,
	PlantUML: PlantUML,
	YouTubeEmbed: YouTubeEmbed,
};

export default function MdxWrapper({ code }: { code: string }) {
  const Component = useMDXComponent(code, { components });

  return <Component components={components} />;
}
