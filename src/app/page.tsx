import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto text-center p-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏗️ Full Court Control Pro
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          İnşaat Proje Yönetim Platformu
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
          <Link 
            href="/dashboard"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            📊 Kontrol Paneli
          </Link>
          
          <Link 
            href="/advanced-demo"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🚀 Gelişmiş Demo
          </Link>
          
          <Link 
            href="/projects"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🏢 Projeler
          </Link>
          
          <Link 
            href="/auth/signin"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            🔐 Giriş Yap
          </Link>
        </div>
        
        <p className="text-sm text-gray-500 mt-8">
          Tüm demolar örnek verilerle çalışır - backend gerektirmez!
        </p>
      </div>
    </div>
  );
}
