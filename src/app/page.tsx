import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Share2, Users, Link2, Heart, Check, TrendingUp, BarChart2, Layout, Bell, Play } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#F8F9FF]">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#FF0050]/5 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-[#00F2EA]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-[#6F3FF5]/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed w-full top-0 z-50 border-b border-white/50 bg-white/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
              <Image src="/entropi_logo.ico" alt="Entropi" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-xl font-bold gradient-text">ENTRO.LY 🇮🇩</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-gray-900">Beranda</Link>
            <Link href="/features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Fitur</Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900">Tentang Kami</Link>
            <Link href="/privacy" className="text-sm font-medium text-gray-600 hover:text-gray-900">Privasi</Link>
            <Link href="/login">
              <Button variant="ghost" className="font-medium">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="font-medium">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-100 mb-4 animate-slide-up">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2EA] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F2EA]"></span>
            </span>
            <span className="text-sm font-medium text-gray-600">Upgrade Bisnis Konten Kreator Anda 🚀</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-5xl mx-auto text-[#1A1A2E]">
            Link-in-bio service untuk <br className="hidden md:block" />
            <span className="gradient-text">Kreator TikTok</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Lacak performa, optimalkan konten, dan kembangkan bisnis kreator Anda—semua dalam satu platform terpadu sebagai Mitra Resmi TikTok Shop.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="text-lg h-14 px-8 rounded-full shadow-lg shadow-[#6F3FF5]/20 hover:shadow-[#6F3FF5]/40 transition-all duration-300 hover:-translate-y-1">
                <Sparkles className="w-5 h-5" />
                Daftar Sekarang
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg h-14 px-8 rounded-full border-2 hover:bg-gray-50/50">
                Masuk Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-12 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 opacity-80">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <div className="text-left">
                <p className="font-bold text-sm text-[#1A1A2E]">Mitra Resmi</p>
                <p className="text-xs text-gray-500">TikTok Shop TSP/TAP/CAP</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#6F3FF5]" />
              <span className="font-semibold text-[#1A1A2E]">10,000+ Kreator</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00F2EA]" />
              <span className="font-semibold text-[#1A1A2E]">Rp 30M+ GMV/Bln</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A2E]">
            Dibuat untuk Kreator <span className="gradient-text">TikTok Shop</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-600">
            Tools profesional untuk kreator afiliasi dan kreator konten layanan lokal Indonesia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 0: Link in Bio */}
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6F3FF5] to-[#00F2EA] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Link2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">Link-in-Bio Pintar</h3>
            <p className="text-gray-600 leading-relaxed">
              Kumpulkan semua link penting Anda dalam satu halaman cantik. Arahkan follower ke produk shop, sosmed lain, atau kontak WA.
            </p>
          </div>
          {/* Feature 1 */}
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF0050] to-[#6F3FF5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BarChart2 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">Analitik Real-Time</h3>
            <p className="text-gray-600 leading-relaxed">
              Lacak performa video, metrik engagement, dan pertumbuhan follower dalam satu dashboard terpadu.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00F2EA] to-[#6F3FF5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">Optimasi Konten</h3>
            <p className="text-gray-600 leading-relaxed">
              Insight berbasis data tentang video terbaik. Identifikasi tren dan optimalkan strategi posting Anda.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF0050] to-[#00F2EA] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Layout className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">Portofolio Profesional</h3>
            <p className="text-gray-600 leading-relaxed">
              Profil kreator otomatis menampilkan konten terbaik Anda. Sempurna untuk kemitraan brand.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6F3FF5] to-[#FF0050] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">Manajemen Kampanye</h3>
            <p className="text-gray-600 leading-relaxed">
              Lacak kolaborasi brand dan kampanye afiliasi. Kelola semuanya di satu tempat.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00F2EA] to-[#FF0050] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">Tracking Pertumbuhan</h3>
            <p className="text-gray-600 leading-relaxed">
              Monitor pertumbuhan akun dengan grafik tren 30 dan 90 hari. Pahami apa yang berhasil.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="group p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF0050] to-[#6F3FF5] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bell className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">Notifikasi Pintar</h3>
            <p className="text-gray-600 leading-relaxed">
              Dapatkan alert instan saat video tayang dan lacak performa real-time. Jangan lewatkan momen.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-32 max-w-5xl mx-auto">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#FF0050] via-[#6F3FF5] to-[#00F2EA] p-1 shadow-2xl animate-pulse-glow">
          <div className="rounded-3xl bg-white p-12 md:p-16 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1A2E]">
              Siap Tingkatkan Bisnis Anda?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Bergabunglah dengan ENTRO.LY dan dapatkan tools profesional yang Anda butuhkan untuk sukses.
            </p>
            <div className="pt-4">
              <Link href="/register">
                <Button size="lg" className="text-lg px-12">
                  <Sparkles className="w-5 h-5" />
                  Akses Awal Gratis
                </Button>
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              Mitra Resmi TikTok Shop Indonesia
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200/50 bg-white/50 backdrop-blur-xl">
        <div className="px-6 py-12 max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
              <Image src="/entropi_logo.ico" alt="Entropi" width={32} height={32} className="object-contain" />
            </div>
            <span className="text-xl font-bold gradient-text">Entro.ly</span>
          </div>
          <div className="flex justify-center flex-wrap gap-6 mb-6 text-sm font-medium text-gray-600">
            <Link href="/about" className="hover:text-gray-900">Tentang Kami</Link>
            <Link href="/features" className="hover:text-gray-900">Fitur</Link>
            <Link href="/privacy" className="hover:text-gray-900">Kebijakan Privasi</Link>
            <Link href="/terms" className="hover:text-gray-900">Syarat & Ketentuan</Link>
            <a href="mailto:info@entropimartech.com" className="hover:text-gray-900">Kontak</a>
          </div>
          <p className="text-gray-600">
            Made with <Heart className="w-4 h-4 inline text-[#FF0050] fill-[#FF0050]" /> for Indonesian creators
          </p>
          <div className="text-xs text-gray-400 mt-4 space-y-1">
            <p>© {new Date().getFullYear()} PT ENTROPI GLOBAL MARTECH. Hak Cipta Dilindungi.</p>
            <p>Mitra Resmi TikTok Shop Indonesia | Terdaftar di Indonesia</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
