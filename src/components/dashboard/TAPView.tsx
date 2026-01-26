import { Card } from "@/components/ui/card";
import { ShoppingBag, TrendingUp, CheckCircle2, AlertCircle, Search, Filter, DollarSign, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TAPView() {
    const campaigns = [
        {
            id: 1,
            brand: "Scarlett Whitening",
            product: "Body Lotion Romansa",
            commission: "15%",
            price: "Rp 75.000",
            earnings: "Rp 11.250",
            status: "Active",
            image: "bg-pink-100",
            samples: "Available",
            deadline: "2 days left"
        },
        {
            id: 2,
            brand: "Erigo Apparel",
            product: "T-Shirt Oversized",
            commission: "10%",
            price: "Rp 129.000",
            earnings: "Rp 12.900",
            status: "Active",
            image: "bg-orange-100",
            samples: "Out of Stock",
            deadline: "5 days left"
        },
        {
            id: 3,
            brand: "Somethinc",
            product: "Ceramic Skin Saviou...",
            commission: "20%",
            price: "Rp 169.000",
            earnings: "Rp 33.800",
            status: "Coming Soon",
            image: "bg-blue-100",
            samples: "Available",
            deadline: "Starts Dec 1"
        }
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-3xl font-bold text-[#1A1A2E]">TikTok Affiliate Partner</h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-[#00F2EA]/10 text-[#009994] text-xs font-bold border border-[#00F2EA]/20">OFFICIAL PARTNER</span>
                    </div>
                    <p className="text-gray-500 mt-1">Discover high-converting campaigns and manage your affiliate products</p>
                </div>
                <Button className="bg-[#FF0050] hover:bg-[#D60043] text-white shadow-lg shadow-pink-200 rounded-xl h-11">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Find More Products
                </Button>
            </div>

            {/* Affiliate Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-0 shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 text-white/60">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-sm font-medium">Est. Commission (30d)</span>
                        </div>
                        <div className="text-3xl font-bold">Rp 12.500.000</div>
                        <div className="mt-2 text-sm text-green-400 flex items-center">
                            <TrendingUp className="w-3 h-3 mr-1" /> +15% from last month
                        </div>
                    </div>
                </Card>

                <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-sm font-medium">GMV Generated</span>
                    </div>
                    <div className="text-3xl font-bold text-[#1A1A2E]">Rp 158.4M</div>
                    <div className="mt-2 text-sm text-gray-500">
                        From 1,240 orders
                    </div>
                </Card>

                <Card className="p-6 border-0 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                        <Package className="w-4 h-4" />
                        <span className="text-sm font-medium">Free Samples</span>
                    </div>
                    <div className="text-3xl font-bold text-[#1A1A2E]">12 Received</div>
                    <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                        <span className="flex items-center text-green-600 font-medium text-xs bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> 10 Reviewed
                        </span>
                        <span className="flex items-center text-amber-600 font-medium text-xs bg-amber-50 px-2 py-0.5 rounded-full">
                            <AlertCircle className="w-3 h-3 mr-1" /> 2 Pending
                        </span>
                    </div>
                </Card>
            </div>

            {/* Campaign List */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-[#1A1A2E]">Featured Campaigns</h2>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#6F3FF5]/20 w-48 md:w-64"
                            />
                        </div>
                        <button className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                            <div className={`h-32 ${campaign.image} relative`}>
                                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-gray-800 shadow-sm">
                                    {campaign.brand}
                                </div>
                                {campaign.samples === 'Available' && (
                                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-sm flex items-center">
                                        <Package className="w-3 h-3 mr-1" /> Free Sample
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-[#1A1A2E] group-hover:text-[#6F3FF5] transition-colors">{campaign.product}</h3>

                                <div className="flex items-center justify-between mt-4 pb-4 border-b border-gray-100">
                                    <div>
                                        <div className="text-xs text-gray-500">Commission</div>
                                        <div className="text-lg font-bold text-[#FF0050]">{campaign.commission}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500">Est. Earnings</div>
                                        <div className="text-lg font-bold text-[#1A1A2E]">{campaign.earnings}</div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {campaign.deadline}
                                    </div>
                                    <Button className="h-9 text-sm">Join Campaign</Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Accountability Section */}
            <Card className="p-6 border-0 shadow-sm bg-blue-50/50 border-blue-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#1A1A2E]">Showcase Accountability</h3>
                        <p className="text-gray-600 text-sm mt-1 mb-3">You have 2 pending sample reviews. Post your video reviews before the deadline to maintain your <strong>High</strong> trust score and unlock more premium samples.</p>
                        <div className="flex gap-2">
                            <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Pending Tasks</button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
