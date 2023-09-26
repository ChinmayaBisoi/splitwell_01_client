import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function Tooltip({ content, children, contentCss = "text-sm" }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div>{children}</div>
      </HoverCardTrigger>
      <HoverCardContent className={contentCss}>{content}</HoverCardContent>
    </HoverCard>
  );
}
