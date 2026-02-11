interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-chat-secondary-bg rounded-xl ${className}`}
    />
  );
}

export default Skeleton;
