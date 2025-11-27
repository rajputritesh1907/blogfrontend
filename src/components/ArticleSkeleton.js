import { Skeleton } from './ui/Skeleton';
import { Card, CardContent } from './ui/Card';

export default function ArticleSkeleton({ count = 1 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="border-0 bg-transparent shadow-none p-0">
          <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4">
            <Skeleton className="w-full h-full" />
          </div>
          <div className="space-y-3 px-2">
            <div className="flex items-center space-x-2">
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="w-16 h-4" />
              <Skeleton className="w-4 h-4 rounded" />
              <Skeleton className="w-20 h-4" />
            </div>
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-3/4 h-4" />
            <div className="flex items-center space-x-2 pt-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-20 h-4" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );
}
