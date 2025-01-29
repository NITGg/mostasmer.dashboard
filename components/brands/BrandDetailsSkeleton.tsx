const BrandDetailsSkeleton = () => {
    return (
        <div className="animate-pulse p-4 md:p-6 space-y-4 md:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Left Column */}
                <div className="space-y-4 md:space-y-6">
                    {/* Cover and Logo Skeleton */}
                    <div className="bg-white rounded-xl p-4 shadow-xl">
                        <div className="relative mb-12">
                            <div className="w-full h-[160px] bg-gray-200 rounded-lg" />
                            <div className="absolute -bottom-6 left-4">
                                <div className="w-[80px] h-[80px] bg-white p-1 rounded-lg">
                                    <div className="w-full h-full bg-gray-200 rounded-lg" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="bg-white rounded-xl p-4 shadow-xl space-y-4">
                        <div className="h-6 w-32 bg-gray-200 rounded" />
                        <div className="h-40 bg-gray-200 rounded-lg" />
                    </div>
                </div>

                {/* Right Column */}
                <div className="bg-white rounded-[32px] p-4 md:p-7 shadow-2xl space-y-4">
                    <div className="flex justify-between">
                        <div className="space-y-2">
                            <div className="h-6 w-24 bg-gray-200 rounded" />
                            <div className="h-4 w-20 bg-gray-200 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-6 w-16 bg-gray-200 rounded" />
                            <div className="h-8 w-20 bg-gray-200 rounded-full" />
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-20 h-4 bg-gray-200 rounded" />
                                <div className="flex-1 h-8 bg-gray-200 rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tabs Skeleton */}
            <div className="bg-white rounded-xl p-4 shadow-xl">
                <div className="flex flex-wrap gap-2">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="h-8 w-24 bg-gray-200 rounded-full flex-shrink-0" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BrandDetailsSkeleton 