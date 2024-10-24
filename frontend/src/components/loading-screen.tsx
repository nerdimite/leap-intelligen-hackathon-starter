import { Card } from "@/components/ui/card";

export default function Loading() {
  const circleCount = 3; // Number of circles moving
  const circleSize = 10; // Size of each circle in pixels
  const pathSize = 75; // Size of the square path

  const renderCircles = () => {
    return Array.from({ length: circleCount }).map((_, index) => (
      <div
        key={`circle-${index + 1}`}
        className="absolute bg-primary rounded-full"
        style={{
          width: `${circleSize}px`,
          height: `${circleSize}px`,
          animation: `moveCircle 2s linear infinite`,
          animationDelay: `${(index * 2) / circleCount}s`,
        }}
      />
    ));
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="p-4">
        <div
          className="relative"
          style={{
            width: `${pathSize}px`,
            height: `${pathSize}px`,
          }}
        >
          {renderCircles()}
        </div>
      </Card>
      <style>{`
        @keyframes moveCircle {
          0% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(${pathSize - circleSize}px, 0);
          }
          50% {
            transform: translate(
              ${pathSize - circleSize}px,
              ${pathSize - circleSize}px
            );
          }
          75% {
            transform: translate(0, ${pathSize - circleSize}px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </main>
  );
}
