export default function SkeletonBlock({ title }: { title: string }) {
    return (
        <div className="animate-pulse space-y-3">
            <div className="h-4 w-40 bg-gray-700 rounded" />
            <div className="h-24 bg-gray-800 rounded-xl" />
        </div>
    );
}