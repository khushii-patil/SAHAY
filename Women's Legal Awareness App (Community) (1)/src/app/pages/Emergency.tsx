import { useState, useEffect } from 'react';
import { ShieldAlert, Phone, Plus, Trash2, MapPin, Clock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { api } from '../lib/api';
import { toast } from 'sonner';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '../components/ui/alert-dialog';

export function Emergency() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' });
  const [showSOSConfirm, setShowSOSConfirm] = useState(false);
  const [isSendingSOS, setIsSendingSOS] = useState(false);

  useEffect(() => {
    api.emergency.getContacts().then(setContacts).catch(console.error);
  }, []);

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Please fill in name and phone number');
      return;
    }
    try {
      const contact = await api.emergency.addContact({
        contactName: newContact.name,
        phoneNumber: newContact.phone,
        relationship: newContact.relationship,
      });
      setContacts(prev => [...prev, contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setShowAddContact(false);
      toast.success('Emergency contact added');
    } catch (err: any) {
      toast.error(err.message || 'Failed to add contact');
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      await api.emergency.deleteContact(id);
      setContacts(prev => prev.filter(c => c._id !== id));
      toast.success('Emergency contact removed');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove contact');
    }
  };

  const handleTriggerSOS = async () => {
    setIsSendingSOS(true);
    let location = 'Location unavailable';
    if (navigator.geolocation) {
      try {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
        );
        location = `Lat: ${pos.coords.latitude.toFixed(6)}, Lon: ${pos.coords.longitude.toFixed(6)}`;
      } catch {}
    }
    try {
      await api.emergency.logSOS(location);
      toast.success('SOS alert sent to all emergency contacts!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send SOS');
    } finally {
      setIsSendingSOS(false);
      setShowSOSConfirm(false);
    }
  };

  return (
    <div className="space-y-6 pb-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Emergency SOS</h1>
        <p className="text-gray-600 mt-1">Access immediate help and alert trusted contacts</p>
      </div>

      <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-none">
        <CardContent className="p-6 sm:p-8">
          <div className="text-center">
            <ShieldAlert className="size-14 sm:size-16 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Emergency Assistance</h2>
            <p className="text-white/90 mb-6 text-sm sm:text-base">
              Press the button below to send your location and emergency alert to all trusted contacts
            </p>
            <Button size="lg" onClick={() => setShowSOSConfirm(true)}
              className="bg-white text-red-600 hover:bg-white/90 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 h-auto">
              <ShieldAlert className="size-5 sm:size-6 mr-2" />TRIGGER SOS
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Phone className="size-5" />Emergency Helplines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: 'Emergency', number: '112', color: 'from-red-600 to-red-700' },
              { name: 'Women Helpline', number: '181', color: 'from-purple-600 to-purple-700' },
              { name: 'Police', number: '100', color: 'from-blue-600 to-blue-700' },
            ].map((h) => (
              <a key={h.number} href={`tel:${h.number}`}>
                <Card className={`bg-gradient-to-r ${h.color} text-white border-none hover:shadow-lg transition-shadow cursor-pointer`}>
                  <CardContent className="p-4 sm:p-6 text-center">
                    <Phone className="size-7 sm:size-8 mx-auto mb-2" />
                    <p className="text-sm mb-1">{h.name}</p>
                    <p className="text-xl sm:text-2xl font-bold">{h.number}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Emergency Contacts</CardTitle>
              <CardDescription>People who will be alerted when SOS is triggered</CardDescription>
            </div>
            <Button onClick={() => setShowAddContact(!showAddContact)} variant="outline" size="sm">
              <Plus className="size-4 mr-2" />Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddContact && (
            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="p-4 space-y-3">
                {[
                  { id: 'name', label: 'Name *', placeholder: 'Contact name', field: 'name' },
                  { id: 'phone', label: 'Phone Number *', placeholder: '+91 98765 43210', field: 'phone' },
                  { id: 'relationship', label: 'Relationship', placeholder: 'e.g., Friend, Family', field: 'relationship' },
                ].map(({ id, label, placeholder, field }) => (
                  <div key={id} className="space-y-1">
                    <Label htmlFor={id}>{label}</Label>
                    <Input id={id} placeholder={placeholder}
                      value={newContact[field as keyof typeof newContact]}
                      onChange={(e) => setNewContact({ ...newContact, [field]: e.target.value })} />
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button onClick={handleAddContact} size="sm" className="flex-1">Save Contact</Button>
                  <Button onClick={() => setShowAddContact(false)} variant="outline" size="sm">Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {contacts.length > 0 ? (
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <Phone className="size-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">{contact.contactName}</p>
                      <p className="text-sm text-gray-600">{contact.phoneNumber}</p>
                      {contact.relationship && <p className="text-xs text-gray-500">{contact.relationship}</p>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteContact(contact._id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Phone className="size-12 mx-auto mb-3 text-gray-300" />
              <p>No emergency contacts added yet</p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={showSOSConfirm} onOpenChange={setShowSOSConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="size-6" />Trigger SOS Alert?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will send your current location to all emergency contacts and log the SOS event.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSendingSOS}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleTriggerSOS} disabled={isSendingSOS}
              className="bg-red-600 hover:bg-red-700">
              {isSendingSOS ? 'Sending Alert...' : 'Yes, Send SOS'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
