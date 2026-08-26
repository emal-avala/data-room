import { Github } from "lucide-react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Octocat that opens the public template repo.
 * Empty `NEXT_PUBLIC_REPO_URL` hides it — a live raise should not advertise
 * the example repository.
 */
export function GitHubLink({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  if (!siteConfig.repoUrl) return null;
  return (
    <a
      href={siteConfig.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub repository"
      className={cn(
        "inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary",
        className,
      )}
    >
      <Github size={16} strokeWidth={1.75} aria-hidden="true" />
      {showLabel ? <span>Source</span> : null}
    </a>
  );
}
