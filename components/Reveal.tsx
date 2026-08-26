"use client";

/**
 * Reveal is now a marker, not a mechanism.
 *
 * All scroll choreography is registered once in useScrollMotion() under a
 * single gsap.context, instead of one IntersectionObserver per element.
 * This component only tags the node and declares its stagger group.
 */
export default function Reveal({
  children,
  group,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  /** Elements sharing a group animate as one staggered batch. */
  group?: string;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  return (
    <Tag className={`gs-reveal ${className}`} data-reveal-group={group}>
      {children}
    </Tag>
  );
}
