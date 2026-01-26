import { Card } from "@/components/ui/card";
import { Users, Heart, Video, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight, Share2, Play } from "lucide-react";

export function AnalyticsView() {
    // Static mock data based on PRD
    const stats = [
        { label: "Total Followers", value: "125.4K", change: "+2.5%", trend: "up", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Likes", value: "4.2M", change: "+12.1%", trend: "up", icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" },
        { label: "Videos Posted", value: "342", change: "+5", trend: "up", icon: Video, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Avg. Engagement", value: "8.4%", change: "-0.2%", trend: "down", icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    const topVideos = [
        { title: "Review Skincare Viral", views: "1.2M", likes: "154K", date: "2 days ago", thumbnail: "bg-pink-100" },
        { title: "Unboxing Gadget Baru", views: "850K", likes: "92K", date: "5 days ago", thumbnail: "bg-blue-100" },
        { title: "Tutorial Masak Simple", views: "540K", likes: "45K", date: "1 week ago", thumbnail: "bg-amber-100" },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#1A1A2E]">Creator Analytics</h1>
                    <p className="text-gray-500 mt-1">Track your performance and growth across TikTok</p>
                </div>
                <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                    <button className="px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-900 rounded-md shadow-sm">7 Days</button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md transition-colors">30 Days</button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md transition-colors">90 Days</button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6 border-0 shadow-sm hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                                {stat.change}
                            </div>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
                            <h3 className="text-2xl font-bold text-[#1A1A2E] mt-1">{stat.value}</h3>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart Area */}
                <Card className="lg:col-span-2 p-6 border-0 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-[#1A1A2E]">Views Overview</h3>
                        <button className="text-sm text-[#6F3FF5] font-medium flex items-center hover:underline">
                            View Detailed Report <ArrowUpRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>

                    {/* CSS-only Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {[65, 45, 75, 55, 85, 95, 70, 60, 80, 50, 65, 90].map((height, i) => (
                            <div key={i} className="w-full relative group">
                                <div
                                    className="w-full bg-[#6F3FF5] opacity-20 group-hover:opacity-100 transition-all duration-300 rounded-t-sm"
                                    style={{ height: `${height}%` }}
                                ></div>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {height * 100} Views
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium border-t pt-4">
                        <span>Jan 01</span>
                        <span>Jan 05</span>
                        <span>Jan 10</span>
                        <span>Jan 15</span>
                        <span>Jan 20</span>
                        <span>Jan 25</span>
                    </div>
                </Card>

                {/* Top Videos */}
                <Card className="p-6 border-0 shadow-sm">
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-6">Top Performing Videos</h3>
                    <div className="space-y-4">
                        {topVideos.map((video, index) => (
                            <div key={index} className="flex gap-4 group cursor-pointer">
                                <div className={`w-16 h-20 rounded-lg ${video.thumbnail} flex-shrink-0 relative overflow-hidden`}>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                                        <Play className="w-6 h-6 text-white opacity-80" fill="currentColor" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0 py-1">
                                    <h4 className="text-sm font-semibold text-[#1A1A2E] truncate group-hover:text-[#6F3FF5] transition-colors">{video.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" /> {video.date}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-xs font-medium text-gray-600 flex items-center">
                                            <Play className="w-3 h-3 mr-1" /> {video.views}
                                        </span>
                                        <span className="text-xs font-medium text-gray-600 flex items-center">
                                            <Heart className="w-3 h-3 mr-1" /> {video.likes}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-200">
                        View All Content
                    </button>
                </Card>
            </div>

            {/* Audience Demographics Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-[#6F3FF5] to-[#8129d9] text-white">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-lg font-bold">Audience Insights</h3>
                            <p className="text-white/80 text-sm mt-1">Your audience is mostly active at 19:00 - 22:00 WIB</p>
                        </div>
                        <Users className="w-8 h-8 opacity-50" />
                    </div>
                    <div className="mt-8 flex gap-4">
                        <div className="flex-1">
                            <div className="text-3xl font-bold">78%</div>
                            <div className="text-sm text-white/70">Female</div>
                            <div className="w-full bg-white/20 h-2 rounded-full mt-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '78%' }}></div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="text-3xl font-bold">22%</div>
                            <div className="text-sm text-white/70">Male</div>
                            <div className="w-full bg-white/20 h-2 rounded-full mt-2">
                                <div className="bg-white h-2 rounded-full" style={{ width: '22%' }}></div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-0 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Share2 className="w-32 h-32 text-[#6F3FF5]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A1A2E]">Share Your Media Kit</h3>
                    <p className="text-gray-500 text-sm mt-2 max-w-xs">Generate a professional media kit with your latest stats to pitch to brands.</p>
                    <button className="mt-6 px-6 py-2.5 bg-[#1A1A2E] text-white text-sm font-semibold rounded-xl hover:bg-black transition-colors shadow-lg shadow-gray-200">
                        Generate Entroly Kit
                    </button>
                </Card>
            </div>
        </div>
    );
}
