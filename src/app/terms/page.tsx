import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function TermsOfService() {
    return (
        <main className="min-h-screen relative overflow-hidden bg-[#F8F9FF]">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#FF0050]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-[#00F2EA]/5 rounded-full blur-[80px]" />
            </div>

            {/* Header */}
            <header className="fixed w-full top-0 z-50 border-b border-white/50 bg-white/50 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm border border-gray-100">
                                <Image src="/entropi_logo.ico" alt="Entropi" width={32} height={32} className="object-contain" />
                            </div>
                            <span className="text-xl font-bold gradient-text">ENTRO.LY 🇮🇩</span>
                        </Link>
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

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto my-32 bg-white/80 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-xl border border-gray-100">
                <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">Syarat dan Ketentuan Layanan / Terms of Service</h1>
                <p className="text-gray-500 text-sm mb-8">Terakhir Diperbarui: 25 Januari 2026 | Last Updated: January 25, 2026</p>

                <div className="bg-[#fff3cd]/50 border-l-4 border-[#ffc107] p-4 mb-8 rounded-r-lg">
                    <strong>🇮🇩 Untuk Pengguna Indonesia:</strong>
                    <p className="text-gray-700 mt-1">Syarat dan Ketentuan ini tunduk pada hukum Indonesia dan mematuhi UU ITE No. 19/2016, PP 71/2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik, dan peraturan Kominfo terkait.</p>
                </div>

                <div className="prose prose-lg prose-headings:text-[#1A1A2E] prose-p:text-gray-600 prose-li:text-gray-600 max-w-none">
                    <p>Selamat datang di ENTRO.LY. Syarat dan Ketentuan Layanan ("Syarat") ini mengatur penggunaan Anda atas platform ENTRO.LY yang dioperasikan oleh PT ENTROPI GLOBAL MARTECH ("kami," "kita," atau "Perusahaan"). Dengan mengakses atau menggunakan ENTRO.LY, Anda setuju untuk terikat dengan Syarat ini.</p>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">1. Penerimaan Syarat / Acceptance of Terms</h2>
                    <p>Dengan membuat akun, menghubungkan profil TikTok Anda, atau menggunakan bagian mana pun dari ENTRO.LY, Anda menerima Syarat ini dan Kebijakan Privasi kami. Jika Anda tidak setuju, harap jangan gunakan layanan kami.</p>
                    <p className="italic text-gray-500">By creating an account, connecting your TikTok profile, or using any part of ENTRO.LY, you accept these Terms and our Privacy Policy. If you do not agree, please do not use our service.</p>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">2. Kelayakan / Eligibility</h2>
                    <p>Untuk menggunakan ENTRO.LY, Anda harus:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Berusia minimal 18 tahun (atau usia mayoritas di yurisdiksi Anda) / Be at least 18 years old (or the age of majority in your jurisdiction)</li>
                        <li>Memiliki akun TikTok yang valid dan dalam kondisi baik / Have a valid TikTok account in good standing</li>
                        <li>Mematuhi Syarat Layanan dan Pedoman Komunitas TikTok / Comply with TikTok's Terms of Service and Community Guidelines</li>
                        <li>Memberikan informasi yang akurat selama pendaftaran / Provide accurate information during registration</li>
                        <li>Tidak dilarang menggunakan layanan kami berdasarkan hukum yang berlaku / Not be prohibited from using our service under applicable laws</li>
                        <li>Warga negara Indonesia atau beroperasi di Indonesia / Indonesian citizen or operating in Indonesia</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">3. Pendaftaran Akun dan Keamanan / Account Registration and Security</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">3.1 Koneksi OAuth TikTok</h3>
                    <p>ENTRO.LY menggunakan Login Kit TikTok untuk autentikasi yang aman. Saat Anda menghubungkan akun TikTok Anda:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Anda mengizinkan kami untuk mengakses data tertentu seperti yang diungkapkan selama proses OAuth</li>
                        <li>Anda dapat mencabut akses ini kapan saja melalui pengaturan aplikasi TikTok</li>
                        <li>Anda tetap bertanggung jawab atas semua aktivitas di akun ENTRO.LY Anda</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">3.2 Keamanan Akun</h3>
                    <p>Anda setuju untuk:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Menjaga kerahasiaan kredensial akun Anda</li>
                        <li>Memberi tahu kami segera jika terjadi akses tidak sah</li>
                        <li>Bertanggung jawab atas semua aktivitas di bawah akun Anda</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">4. Penggunaan yang Diizinkan / Permitted Use</h2>
                    <p>Anda dapat menggunakan ENTRO.LY untuk:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Melacak dan menganalisis performa konten TikTok Anda / Track and analyze your TikTok content performance</li>
                        <li>Membuat portofolio kreator profesional / Create professional creator portfolios</li>
                        <li>Mengelola kemitraan brand dan kampanye / Manage brand partnerships and campaigns</li>
                        <li>Mengakses analitik dan insight tentang audiens Anda / Access analytics and insights about your audience</li>
                        <li>Menerima notifikasi tentang konten Anda / Receive notifications about your content</li>
                        <li>Melacak performa TikTok Shop dan TikTok GO / Track TikTok Shop and TikTok GO performance</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">5. Perilaku yang Dilarang / Prohibited Conduct</h2>
                    <p>Anda setuju untuk TIDAK:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Melanggar hukum atau peraturan yang berlaku di Indonesia / Violate any applicable laws or regulations in Indonesia</li>
                        <li>Melanggar hak kekayaan intelektual / Infringe upon intellectual property rights</li>
                        <li>Mencoba mengakses akun pengguna lain tanpa izin / Attempt to access other users' accounts without permission</li>
                        <li>Melakukan reverse engineering, decompile, atau meretas platform ENTRO.LY / Reverse engineer, decompile, or hack the ENTRO.LY platform</li>
                        <li>Menggunakan alat otomatis (bot, scraper) untuk mengakses layanan kami / Use automated tools (bots, scrapers) to access our service</li>
                        <li>Membagikan atau menjual akses akun Anda kepada pihak ketiga / Share or sell your account access to third parties</li>
                        <li>Mengunggah kode berbahaya, virus, atau konten yang merugikan / Upload malicious code, viruses, or harmful content</li>
                        <li>Memalsukan identitas atau afiliasi Anda / Misrepresent your identity or affiliation</li>
                        <li>Menggunakan ENTRO.LY dengan cara yang melanggar Syarat Layanan TikTok / Use ENTRO.LY in ways that violate TikTok's Terms of Service</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">6. Kepatuhan Penggunaan Data TikTok / TikTok Data Usage Compliance</h2>
                    <div className="bg-[#f0f4ff] p-6 border-l-4 border-[#6F3FF5] my-6 rounded-r-lg not-prose">
                        <strong>Penting / Important:</strong> Anda mengakui bahwa:
                        <ul className="list-disc pl-8 mt-2 space-y-1 text-gray-600">
                            <li>ENTRO.LY mengakses data TikTok Anda melalui API Developer TikTok resmi / ENTRO.LY accesses your TikTok data via official TikTok Developer APIs</li>
                            <li>Kami mematuhi Syarat Layanan Developer TikTok dan Perjanjian Pembagian Data / We comply with TikTok's Developer Terms of Service and Data Sharing Agreement</li>
                            <li>Pelanggaran terhadap kebijakan TikTok dapat mengakibatkan penghentian akun ENTRO.LY Anda / Any violations of TikTok's policies may result in termination of your ENTRO.LY account</li>
                            <li>TikTok dapat mengubah atau membatasi akses API, yang dapat mempengaruhi fitur ENTRO.LY / TikTok may change or restrict API access, which could affect ENTRO.LY features</li>
                        </ul>
                    </div>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">7. Hak Kekayaan Intelektual / Intellectual Property Rights</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">7.1 Properti ENTRO.LY</h3>
                    <p>Semua konten, fitur, dan fungsi ENTRO.LY (termasuk namun tidak terbatas pada perangkat lunak, desain, teks, grafik, logo) dimiliki oleh PT ENTROPI GLOBAL MARTECH dan dilindungi oleh hak cipta, merek dagang, dan hukum kekayaan intelektual lainnya yang berlaku di Indonesia.</p>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">7.2 Konten Anda</h3>
                    <p>Anda mempertahankan semua hak atas konten TikTok Anda. Dengan menggunakan ENTRO.LY, Anda memberikan kami lisensi terbatas untuk:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Menampilkan informasi profil dan video TikTok Anda dalam dashboard Anda / Display your TikTok profile information and videos within your dashboard</li>
                        <li>Menghasilkan analitik dan metrik performa / Generate analytics and performance metrics</li>
                        <li>Membuat portofolio publik (hanya jika Anda memilih fitur ini) / Create public portfolios (only if you opt-in to this feature)</li>
                    </ul>
                    <p>Lisensi ini berakhir saat Anda memutuskan hubungan akun TikTok Anda.</p>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">8. Ketersediaan dan Modifikasi Layanan / Service Availability and Modifications</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">8.1 Perubahan Layanan</h3>
                    <p>Kami berhak untuk:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Memodifikasi, menangguhkan, atau menghentikan bagian mana pun dari ENTRO.LY kapan saja / Modify, suspend, or discontinue any part of ENTRO.LY at any time</li>
                        <li>Mengubah fitur, harga, atau tingkat layanan dengan pemberitahuan 30 hari / Change features, pricing, or service tiers with 30 days' notice</li>
                        <li>Melakukan pemeliharaan yang dapat sementara mengganggu layanan / Perform maintenance that may temporarily interrupt service</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">8.2 Tanpa Jaminan / No Warranty</h3>
                    <p>ENTRO.LY disediakan "SEBAGAIMANA ADANYA" dan "SEBAGAIMANA TERSEDIA" tanpa jaminan apa pun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Layanan akan tidak terputus atau bebas kesalahan / The service will be uninterrupted or error-free</li>
                        <li>Data akan selalu akurat atau lengkap / Data will always be accurate or complete</li>
                        <li>Akses API TikTok akan tetap tidak berubah / TikTok API access will remain unchanged</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">9. Batasan Tanggung Jawab / Limitation of Liability</h2>
                    <p>Sejauh diizinkan oleh hukum Indonesia:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>PT ENTROPI GLOBAL MARTECH tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, atau konsekuensial / PT ENTROPI GLOBAL MARTECH shall not be liable for any indirect, incidental, special, or consequential damages</li>
                        <li>Total tanggung jawab kami untuk klaim apa pun tidak akan melebihi jumlah yang Anda bayarkan kepada kami dalam 12 bulan terakhir (atau Rp 1.000.000 jika Anda menggunakan paket gratis) / Our total liability for any claim shall not exceed the amount you paid us in the past 12 months (or IDR 1,000,000 if you're on a free plan)</li>
                        <li>Kami tidak bertanggung jawab atas perubahan platform TikTok, pembatasan API, atau penangguhan akun / We are not responsible for TikTok platform changes, API restrictions, or account suspensions</li>
                        <li>Kami tidak bertanggung jawab atas kehilangan data karena perubahan kebijakan TikTok atau pemutusan akun Anda / We are not liable for data loss due to TikTok policy changes or your account disconnection</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">10. Ganti Rugi / Indemnification</h2>
                    <p>Anda setuju untuk mengganti rugi dan membebaskan PT ENTROPI GLOBAL MARTECH, afiliasinya, pejabat, direktur, dan karyawannya dari klaim, kerusakan, kerugian, atau pengeluaran (termasuk biaya hukum) yang timbul dari:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Pelanggaran Anda terhadap Syarat ini / Your violation of these Terms</li>
                        <li>Pelanggaran Anda terhadap Syarat Layanan TikTok / Your violation of TikTok's Terms of Service</li>
                        <li>Penyalahgunaan Anda terhadap ENTRO.LY / Your misuse of ENTRO.LY</li>
                        <li>Konten atau data Anda / Your content or data</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">11. Penghentian / Termination</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">11.1 Oleh Anda</h3>
                    <p>Anda dapat menghentikan akun Anda kapan saja dengan:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Memutuskan akun TikTok Anda melalui pengaturan aplikasi TikTok / Disconnecting your TikTok account via TikTok's app settings</li>
                        <li>Menghubungi tim dukungan kami / Contacting our support team</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">11.2 Oleh Kami</h3>
                    <p>Kami dapat menangguhkan atau menghentikan akun Anda jika Anda:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Melanggar Syarat ini / Violate these Terms</li>
                        <li>Terlibat dalam perilaku yang dilarang / Engage in prohibited conduct</li>
                        <li>Melanggar kebijakan TikTok (mengakibatkan kehilangan akses API) / Violate TikTok's policies (resulting in API access loss)</li>
                        <li>Gagal membayar layanan premium (jika berlaku) / Fail to pay for premium services (if applicable)</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">11.3 Efek Penghentian</h3>
                    <p>Setelah penghentian:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Akses Anda ke ENTRO.LY akan segera berhenti / Your access to ENTRO.LY will cease immediately</li>
                        <li>Data Anda akan dihapus dalam 90 hari (sesuai Kebijakan Privasi kami) / Your data will be deleted within 90 days (per our Privacy Policy)</li>
                        <li>Anda tetap bertanggung jawab atas kewajiban yang belum diselesaikan / You remain liable for any outstanding obligations</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">12. Layanan Pihak Ketiga / Third-Party Services</h2>
                    <p>ENTRO.LY terintegrasi dengan TikTok dan dapat terintegrasi dengan layanan pihak ketiga lainnya. Kami tidak bertanggung jawab atas:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Ketersediaan atau akurasi layanan pihak ketiga / The availability or accuracy of third-party services</li>
                        <li>Perubahan pada API atau kebijakan pihak ketiga / Changes to third-party APIs or policies</li>
                        <li>Syarat, praktik privasi, atau konten pihak ketiga / Third-party terms, privacy practices, or content</li>
                    </ul>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">13. Penyelesaian Sengketa / Dispute Resolution</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">13.1 Hukum yang Berlaku</h3>
                    <div className="bg-[#fff3cd]/50 border-l-4 border-[#ffc107] p-4 mb-6 rounded-r-lg not-prose">
                        <p className="text-gray-700">Syarat ini diatur oleh dan ditafsirkan sesuai dengan hukum Republik Indonesia, tanpa memperhatikan prinsip konflik hukum.</p>
                        <p className="italic text-gray-500">These Terms are governed by and construed in accordance with the laws of the Republic of Indonesia, without regard to conflict of law principles.</p>
                    </div>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">13.2 Yurisdiksi</h3>
                    <p>Setiap sengketa yang timbul dari atau sehubungan dengan Syarat ini akan diselesaikan melalui:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li>Negosiasi dengan itikad baik sebagai langkah pertama / Good faith negotiation as a first step</li>
                        <li>Jika tidak terselesaikan, sengketa akan diselesaikan melalui arbitrase di Tangerang, Indonesia sesuai dengan aturan Badan Arbitrase Nasional Indonesia (BANI) / If unresolved, disputes will be settled through arbitration in Tangerang, Indonesia according to the rules of the Indonesian National Arbitration Board (BANI)</li>
                        <li>Pengadilan Tangerang, Indonesia akan memiliki yurisdiksi eksklusif untuk penegakan keputusan arbitrase / The courts of Tangerang, Indonesia shall have exclusive jurisdiction for enforcement of arbitration decisions</li>
                    </ul>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">13.3 Pengecualian Class Action</h3>
                    <p>Anda setuju untuk menyelesaikan sengketa secara individual dan melepaskan hak untuk berpartisipasi dalam gugatan class action.</p>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">14. Lain-lain / Miscellaneous</h2>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">14.1 Keseluruhan Perjanjian</h3>
                    <p>Syarat ini, bersama dengan Kebijakan Privasi kami, merupakan keseluruhan perjanjian antara Anda dan PT ENTROPI GLOBAL MARTECH mengenai ENTRO.LY.</p>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">14.2 Keterpisahan</h3>
                    <p>Jika ada ketentuan dari Syarat ini yang dianggap tidak dapat diberlakukan, ketentuan lainnya akan tetap berlaku sepenuhnya.</p>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">14.3 Pengesampingan</h3>
                    <p>Kegagalan kami untuk menegakkan hak atau ketentuan apa pun tidak akan merupakan pengesampingan atas hak atau ketentuan tersebut.</p>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">14.4 Pengalihan</h3>
                    <p>Anda tidak dapat mengalihkan atau mentransfer Syarat ini. Kami dapat mengalihkan hak dan kewajiban kami tanpa batasan.</p>

                    <h3 className="mt-10 mb-4 text-xl font-bold text-[#1A1A2E]">14.5 Pembaruan Syarat</h3>
                    <p>Kami dapat memperbarui Syarat ini dari waktu ke waktu. Perubahan material akan diberitahukan melalui email atau pemberitahuan dalam aplikasi. Penggunaan yang berlanjut setelah perubahan merupakan penerimaan.</p>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">15. Kepatuhan terhadap Peraturan Indonesia / Indonesian Regulatory Compliance</h2>
                    <div className="bg-[#fff3cd]/50 border-l-4 border-[#ffc107] p-4 mb-6 rounded-r-lg not-prose">
                        <strong>Kepatuhan Hukum Indonesia:</strong>
                        <ul className="list-disc pl-8 mt-2 space-y-1 text-gray-700">
                            <li>ENTRO.LY mematuhi UU ITE No. 19 Tahun 2016 tentang Informasi dan Transaksi Elektronik</li>
                            <li>PP 71/2019 tentang Penyelenggaraan Sistem dan Transaksi Elektronik</li>
                            <li>Peraturan Menkominfo No. 20/2016 tentang Perlindungan Data Pribadi</li>
                            <li>Peraturan OJK terkait (jika berlaku untuk layanan keuangan di masa depan)</li>
                        </ul>
                    </div>

                    <h2 className="text-[#6F3FF5] mt-16 mb-6 text-2xl font-bold">16. Informasi Kontak / Contact Information</h2>
                    <p>Untuk pertanyaan tentang Syarat ini, silakan hubungi:</p>
                    <ul className="space-y-3 my-6 pl-6 list-disc text-gray-600">
                        <li><strong>Email:</strong> <a href="mailto:info@entropimartech.com" className="text-[#6F3FF5] hover:underline">info@entropimartech.com</a></li>
                        <li><strong>Legal:</strong> <a href="mailto:info@entropimartech.com" className="text-[#6F3FF5] hover:underline">info@entropimartech.com</a></li>
                        <li><strong>Perusahaan / Company:</strong> PT ENTROPI GLOBAL MARTECH</li>
                        <li><strong>Alamat / Address:</strong> Tangerang, Indonesia</li>
                    </ul>

                    <div className="bg-[#ffe5e5] border-l-4 border-[#dc3545] p-6 my-8 rounded-r-lg not-prose">
                        <strong>⚠️ Pengakuan / Acknowledgment:</strong>
                        <p className="mt-2 font-bold text-gray-800">DENGAN MENGGUNAKAN ENTRO.LY, ANDA MENGAKUI BAHWA ANDA TELAH MEMBACA, MEMAHAMI, DAN SETUJU UNTUK TERIKAT DENGAN SYARAT DAN KETENTUAN LAYANAN INI.</p>
                        <p className="italic text-gray-600 mt-2">BY USING ENTRO.LY, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.</p>
                    </div>

                    <div className="bg-[#f0f4ff] p-6 border-l-4 border-[#6F3FF5] my-8 rounded-r-lg not-prose">
                        <strong>Praktik Data Khusus TikTok / TikTok-Specific Data Practices:</strong>
                        <p className="mt-2 text-gray-600">ENTRO.LY menggunakan API Developer TikTok sesuai dengan Syarat Layanan Developer TikTok dan Perjanjian Pembagian Data. Data TikTok Anda diproses semata-mata untuk menyediakan layanan ENTRO.LY kepada Anda. Kami menjaga kepatuhan terhadap kebijakan TikTok dan tidak menggunakan data TikTok Anda dengan cara yang akan melanggar aturan platform TikTok.</p>
                        <p className="italic text-gray-500 mt-2">ENTRO.LY uses TikTok's Developer API in accordance with TikTok's Developer Terms of Service and Data Sharing Agreement. Your TikTok data is processed solely to provide ENTRO.LY services to you. We maintain compliance with TikTok policies and do not use your TikTok data in ways that would violate TikTok's platform rules.</p>
                    </div>
                </div>

                <div className="text-center mt-12">
                    <Link href="/">
                        <Button variant="outline" size="lg" className="rounded-full">Kembali ke Beranda / Back to Home</Button>
                    </Link>
                </div>
            </div>

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
