import { useParams, Link } from 'react-router';
import { ArrowLeft, Phone, Scale, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { getLegalArticleById } from '../lib/legalContent';

export function LegalContent() {
  const { id } = useParams<{ id: string }>();
  const article = id ? getLegalArticleById(id) : undefined;

  if (!article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Article not found</h2>
        <Link to="/legal">
          <Button className="mt-4">Back to Legal Hub</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <Link to="/legal">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="size-4 mr-2" />
          Back to Legal Hub
        </Button>
      </Link>

      <div>
        <Badge className="mb-3">{article.category.toUpperCase()}</Badge>
        <h1 className="text-3xl font-bold text-gray-900">{article.title}</h1>
        <p className="text-gray-600 mt-2">{article.description}</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="size-5" />
            Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <div className="whitespace-pre-line text-gray-700">{article.content}</div>
        </CardContent>
      </Card>

      {/* Steps to Take */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="size-5 text-green-600" />
            What to Do: Step-by-Step Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3">
            {article.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <div className="flex-shrink-0 flex items-center justify-center size-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm">
                  {index + 1}
                </div>
                <p className="text-gray-700 pt-1">{step}</p>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Helplines */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="size-5 text-blue-600" />
            Emergency Helplines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {article.helplines.map((helpline, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">{helpline.name}</p>
                <a 
                  href={`tel:${helpline.number}`} 
                  className="text-2xl font-bold text-blue-600 hover:underline"
                >
                  {helpline.number}
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Related Laws */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="size-5 text-purple-600" />
            Related Legal Provisions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {article.relatedLaws.map((law, index) => (
              <Badge key={index} variant="outline" className="text-sm py-1.5 px-3">
                {law}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <h3 className="font-semibold text-purple-900 mb-3">Ready to take action?</h3>
          <div className="flex flex-wrap gap-3">
            <Link to="/incidents/new">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Log an Incident
              </Button>
            </Link>
            <Link to="/complaints/new">
              <Button variant="outline">
                File a Complaint
              </Button>
            </Link>
            <Link to="/emergency">
              <Button variant="destructive">
                Emergency SOS
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
