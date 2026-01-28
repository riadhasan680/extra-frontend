import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background text-foreground flex h-screen w-full flex-col items-center justify-center">
      <h1 className="text-primary/20 text-9xl font-extrabold tracking-tight">
        404
      </h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight">Page Not Found</h2>
      <p className="text-muted-foreground mt-4 max-w-[500px] text-center">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might
        have been moved or doesn&apos;t exist.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button size="lg" className="rounded-full">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
