import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ShowcaseView } from "./showcase-view";

export const metadata: Metadata = {
  title: "Design System Showcase | TalentScreen",
  description: "TalentScreen Editorial Slate & Peach Design Tokens and UI Foundation",
};

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <ShowcaseView />;
}
