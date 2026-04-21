import { Link } from 'react-router';
import { BookOpen, Briefcase, Home, Smartphone, Eye, ShieldAlert, ArrowRight, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { legalCategories, getLegalArticlesByCategory } from '../lib/legalContent';

const iconMap: Record<string, any> = {
  Briefcase,
  Home,
  Smartphone,
  Eye,
  ShieldAlert,
};

export function LegalHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Legal Knowledge Hub</h1>
        <p className="text-gray-600 mt-1">Learn about your rights and legal protections</p>
      </div>

      {/* Emergency Helplines Banner */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="size-6" />
            <h3 className="text-lg font-semibold">24/7 Helplines</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-white/80">Emergency</p>
              <a href="tel:112" className="text-2xl font-bold hover:underline">112</a>
            </div>
            <div>
              <p className="text-sm text-white/80">Women Helpline</p>
              <a href="tel:181" className="text-2xl font-bold hover:underline">181</a>
            </div>
            <div>
              <p className="text-sm text-white/80">Police</p>
              <a href="tel:100" className="text-2xl font-bold hover:underline">100</a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {legalCategories.map((category) => {
          const Icon = iconMap[category.icon];
          const articles = getLegalArticlesByCategory(category.id);
          
          return (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-3 rounded-lg">
                    <Icon className="size-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{articles.length} articles available</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {articles.map((article) => (
                    <Link to={`/legal/${article.id}`} key={article.id}>
                      <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                        <div className="flex items-center gap-3">
                          <BookOpen className="size-4 text-gray-400 group-hover:text-purple-600" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-purple-600">
                            {article.title}
                          </span>
                        </div>
                        <ArrowRight className="size-4 text-gray-400 group-hover:text-purple-600" />
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Important Notice */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-orange-900 mb-2">Important Legal Notice</h3>
          <p className="text-sm text-orange-800">
            This information is for educational purposes only and does not constitute legal advice. 
            For specific legal situations, please consult with a qualified lawyer or legal aid service.
            All laws referenced are applicable under Indian jurisdiction.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
