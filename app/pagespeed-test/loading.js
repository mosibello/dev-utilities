import Bounded from "@/components/wrappers/Bounded";
import Container from "@/components/wrappers/Container";

function Bone({ className }) {
  return <div className={`animate-pulse rounded-md bg-muted ${className}`} />;
}

function AverageCardSkeleton() {
  return (
    <div className="border-2 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-5">
        <div className="w-24 h-24 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="flex flex-col gap-2">
          <Bone className="h-3 w-32" />
          <Bone className="h-12 w-16" />
          <Bone className="h-3 w-24" />
        </div>
      </div>
      <div className="border-t pt-3 flex flex-col gap-3">
        <Bone className="h-3 w-36" />
        <div className="grid grid-cols-3 gap-x-3 gap-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col gap-1">
              <Bone className="h-4 w-14" />
              <Bone className="h-2.5 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RunCardSkeleton() {
  return (
    <div className="border rounded-lg p-4 flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted animate-pulse shrink-0" />
        <div className="flex flex-col gap-1.5">
          <Bone className="h-2.5 w-10" />
          <Bone className="h-6 w-8" />
          <Bone className="h-2.5 w-16" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <Bone className="h-4 w-14" />
            <Bone className="h-2.5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <Bounded className="b__size-fit-to-screen b__hero_variant01 relative">
      <div className="pt-[4rem] pb-[4rem]">
        <Container>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Bone className="h-3 w-36 mb-3" />
            <Bone className="h-8 w-64" />
          </div>
        </Container>

        <Container className="mt-[2rem]">
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="c__util-card border bg-card text-card-foreground flex-1 transition flex flex-col p-6 hover:shadow-none shadow-none rounded-xl">
              <div className="flex flex-col gap-8">
                {/* header */}
                <div className="flex flex-col gap-2 border-b pb-4">
                  <Bone className="h-5 w-48" />
                  <Bone className="h-3 w-72" />
                  <Bone className="h-3 w-40 mt-1" />
                </div>

                {/* mobile section */}
                <div className="flex flex-col gap-4">
                  <Bone className="h-5 w-16" />
                  <AverageCardSkeleton />
                  <Bone className="h-3 w-24" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => <RunCardSkeleton key={i} />)}
                  </div>
                </div>

                {/* desktop section */}
                <div className="flex flex-col gap-4">
                  <Bone className="h-5 w-20" />
                  <AverageCardSkeleton />
                  <Bone className="h-3 w-24" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                    {[...Array(3)].map((_, i) => <RunCardSkeleton key={i} />)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Bounded>
  );
}
