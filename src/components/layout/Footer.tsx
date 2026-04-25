import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-slate-950 text-white pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-[1920px] w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <h3 className="text-3xl font-black tracking-tight">AutoDrive</h3>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              {t('footer.desc')}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-slate-100">{t('footer.quick_services')}</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><Link to="/vehicules" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>{t('footer.car_rental')}</Link></li>
              <li><Link to="/vehicules" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>{t('footer.special_offers')}</Link></li>
              <li><Link to="/blog" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>{t('footer.blog_news')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-slate-100">{t('footer.navigation')}</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><Link to="/about" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>{t('footer.about_us')}</Link></li>
              <li><Link to="/faq" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>{t('footer.faq_title')}</Link></li>
              <li><Link to="/contact" className="hover:text-blue-400 transition-colors flex items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>{t('footer.contact_us')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6 text-slate-100">{t('footer.contact_title')}</h4>
            <div className="space-y-4 text-slate-400 font-medium">
              <p className="flex items-center"><span className="mr-3 bg-slate-800 p-2 rounded-lg">📧</span> contact@autodrive.com</p>
              <p className="flex items-center"><span className="mr-3 bg-slate-800 p-2 rounded-lg">📞</span> +228 22 22 67 89</p>
              <p className="flex items-center"><span className="mr-3 bg-slate-800 p-2 rounded-lg">📍</span> Lomé, Togo</p>
            </div>
          </div>
        </div>
        
        <Separator className="bg-slate-800/50 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">
          <p className="text-slate-500 text-sm font-medium text-center md:text-left">
            © {new Date().getFullYear()} AutoDrive. {t('footer.all_rights')}
          </p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <Link to="/about" className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium">{t('footer.about')}</Link>
            <Link to="/contact" className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium">{t('footer.contact')}</Link>
            <Link to="/faq" className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-medium">{t('footer.faq')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
