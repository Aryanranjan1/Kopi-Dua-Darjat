'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Outlet } from '@/lib/types';

const outlets: Omit<Outlet, 'id'>[] = [
    { name: 'Kajang Prima', slug: 'kajang-prima', address: '123 Jalan Prima, Kajang', city: 'Selangor', lat: 2.9935, lng: 101.7874, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Bandar Baru Bangi', slug: 'bangi', address: '456 Seksyen 9, Bangi', city: 'Selangor', lat: 2.9555, lng: 101.7616, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Shah Alam', slug: 'shah-alam', address: '789 Seksyen 7, Shah Alam', city: 'Selangor', lat: 3.0738, lng: 101.5183, hours: '8 AM - 11 PM', isOpenNow: true },
    { name: 'Puchong Perdana', slug: 'puchong', address: '101 Jalan Perdana, Puchong', city: 'Selangor', lat: 3.008, lng: 101.613, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Subang Jaya', slug: 'subang-jaya', address: '212 Jalan SS15/4, Subang Jaya', city: 'Selangor', lat: 3.076, lng: 101.587, hours: '9 AM - 11 PM', isOpenNow: true },
    { name: 'Damansara Utama', slug: 'damansara', address: '333 Jalan SS21/37, Damansara Utama', city: 'Selangor', lat: 3.136, lng: 101.621, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Ampang', slug: 'ampang', address: '444 Jalan Ampang, Ampang', city: 'Selangor', lat: 3.15, lng: 101.75, hours: '8 AM - 10 PM', isOpenNow: false },
    { name: 'Klang', slug: 'klang', address: '555 Jalan Meru, Klang', city: 'Selangor', lat: 3.045, lng: 101.44, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Gombak', slug: 'gombak', address: '666 Jalan Gombak, Gombak', city: 'Selangor', lat: 3.23, lng: 101.7, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Cheras', slug: 'cheras-selangor', address: '777 Jalan Cheras, Cheras', city: 'Selangor', lat: 3.09, lng: 101.74, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Bukit Bintang', slug: 'bukit-bintang', address: '888 Jalan Bukit Bintang', city: 'Kuala Lumpur', lat: 3.146, lng: 101.71, hours: '10 AM - 12 AM', isOpenNow: true },
    { name: 'KL Sentral', slug: 'kl-sentral', address: '999 Jalan Stesen Sentral, KL Sentral', city: 'Kuala Lumpur', lat: 3.134, lng: 101.686, hours: '7 AM - 10 PM', isOpenNow: true },
    { name: 'Mont Kiara', slug: 'mont-kiara', address: '111 Jalan Kiara, Mont Kiara', city: 'Kuala Lumpur', lat: 3.165, lng: 101.65, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'TTDI', slug: 'ttdi', address: '222 Lorong Rahim Kajai, TTDI', city: 'Kuala Lumpur', lat: 3.14, lng: 101.63, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Wangsa Maju', slug: 'wangsa-maju', address: '333 Jalan Wangsa Delima, Wangsa Maju', city: 'Kuala Lumpur', lat: 3.205, lng: 101.74, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Setapak', slug: 'setapak', address: '444 Jalan Genting Klang, Setapak', city: 'Kuala Lumpur', lat: 3.19, lng: 101.71, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Presint 15', slug: 'putrajaya-p15', address: '789 Jalan Diplomatik, Presint 15', city: 'Putrajaya', lat: 2.9264, lng: 101.6964, hours: '9 AM - 9 PM', isOpenNow: false },
    { name: 'Ayer@8', slug: 'putrajaya-ayer8', address: 'Jalan P8, Presint 8', city: 'Putrajaya', lat: 2.93, lng: 101.67, hours: '10 AM - 10 PM', isOpenNow: true },
    { name: 'Johor Bahru City Square', slug: 'jb-city-square', address: '106-108 Jalan Wong Ah Fook, Johor Bahru', city: 'Johor', lat: 1.46, lng: 103.76, hours: '10 AM - 10 PM', isOpenNow: true },
    { name: 'Taman Mount Austin', slug: 'mount-austin', address: 'Jalan Austin Heights 8/5, Taman Mount Austin', city: 'Johor', lat: 1.56, lng: 103.77, hours: '9 AM - 11 PM', isOpenNow: true },
    { name: 'Kluang', slug: 'kluang', address: 'Jalan Lambak, Kluang', city: 'Johor', lat: 2.03, lng: 103.32, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Batu Pahat', slug: 'batu-pahat', address: 'Jalan Rahmat, Batu Pahat', city: 'Johor', lat: 1.85, lng: 102.93, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Muar', slug: 'muar', address: 'Jalan Sisi, Muar', city: 'Johor', lat: 2.05, lng: 102.57, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Skudai', slug: 'skudai', address: 'Jalan Laksamana, Skudai', city: 'Johor', lat: 1.54, lng: 103.66, hours: '8 AM - 10 PM', isOpenNow: false },
    { name: 'Georgetown', slug: 'georgetown', address: '25 Lebuh Campbell, Georgetown', city: 'Penang', lat: 5.419, lng: 100.33, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Bayan Lepas', slug: 'bayan-lepas', address: 'Jalan Mayang Pasir, Bayan Lepas', city: 'Penang', lat: 5.32, lng: 100.28, hours: '8 AM - 10 PM', isOpenNow: true },
    { name: 'Gurney Drive', slug: 'gurney-drive', address: 'Persiaran Gurney, Georgetown', city: 'Penang', lat: 5.43, lng: 100.31, hours: '10 AM - 11 PM', isOpenNow: true },
    { name: 'Bukit Mertajam', slug: 'bukit-mertajam', address: 'Jalan Arumugam Pillai, Bukit Mertajam', city: 'Penang', lat: 5.36, lng: 100.45, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Butterworth', slug: 'butterworth', address: 'Jalan Bagan Luar, Butterworth', city: 'Penang', lat: 5.39, lng: 100.36, hours: '8 AM - 9 PM', isOpenNow: true },
    { name: 'Tanjung Tokong', slug: 'tanjung-tokong', address: 'Jalan Seri Tanjung Pinang', city: 'Penang', lat: 5.45, lng: 100.3, hours: '9 AM - 10 PM', isOpenNow: false },
    { name: 'Ipoh Old Town', slug: 'ipoh-old-town', address: 'Jalan Panglima, Ipoh', city: 'Perak', lat: 4.59, lng: 101.07, hours: '9 AM - 9 PM', isOpenNow: true },
    { name: 'Taiping', slug: 'taiping', address: 'Jalan Kota, Taiping', city: 'Perak', lat: 4.85, lng: 100.74, hours: '8 AM - 8 PM', isOpenNow: true },
    { name: 'Teluk Intan', slug: 'teluk-intan', address: 'Jalan Ah Cheong, Teluk Intan', city: 'Perak', lat: 4.02, lng: 101.02, hours: '8 AM - 8 PM', isOpenNow: true },
    { name: 'Jonker Street', slug: 'jonker-street', address: 'Jalan Hang Jebat, Melaka', city: 'Melaka', lat: 2.19, lng: 102.24, hours: '10 AM - 10 PM', isOpenNow: true },
    { name: 'Mahkota Parade', slug: 'mahkota-parade', address: 'Jalan Merdeka, Melaka', city: 'Melaka', lat: 2.18, lng: 102.25, hours: '10 AM - 10 PM', isOpenNow: true },
    { name: 'Seremban', slug: 'seremban', address: 'Jalan Dato Bandar Tunggal, Seremban', city: 'Negeri Sembilan', lat: 2.72, lng: 101.94, hours: '9 AM - 9 PM', isOpenNow: true },
    { name: 'Port Dickson', slug: 'port-dickson', address: 'Jalan Pantai, Port Dickson', city: 'Negeri Sembilan', lat: 2.52, lng: 101.79, hours: '10 AM - 9 PM', isOpenNow: false },
    { name: 'Kuantan', slug: 'kuantan', address: 'Jalan Mahkota, Kuantan', city: 'Pahang', lat: 3.81, lng: 103.32, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Genting Highlands', slug: 'genting', address: 'Genting Highlands', city: 'Pahang', lat: 3.42, lng: 101.79, hours: '10 AM - 12 AM', isOpenNow: true },
    { name: 'Kuala Terengganu', slug: 'kuala-terengganu', address: 'Jalan Sultan Zainal Abidin, Kuala Terengganu', city: 'Terengganu', lat: 5.33, lng: 103.13, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Kota Bharu', slug: 'kota-bharu', address: 'Jalan Pintu Pong, Kota Bharu', city: 'Kelantan', lat: 6.13, lng: 102.23, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Alor Setar', slug: 'alor-setar', address: 'Jalan Langgar, Alor Setar', city: 'Kedah', lat: 6.12, lng: 100.36, hours: '9 AM - 9 PM', isOpenNow: true },
    { name: 'Langkawi', slug: 'langkawi', address: 'Pantai Cenang, Langkawi', city: 'Kedah', lat: 6.29, lng: 99.72, hours: '10 AM - 10 PM', isOpenNow: true },
    { name: 'Kangar', slug: 'kangar', address: 'Jalan Penjara, Kangar', city: 'Perlis', lat: 6.44, lng: 100.19, hours: '9 AM - 9 PM', isOpenNow: false },
    { name: 'Kota Kinabalu', slug: 'kota-kinabalu', address: 'Jalan Gaya, Kota Kinabalu', city: 'Sabah', lat: 5.98, lng: 116.07, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Sandakan', slug: 'sandakan', address: 'Jalan Pelabuhan, Sandakan', city: 'Sabah', lat: 5.84, lng: 118.11, hours: '8 AM - 8 PM', isOpenNow: true },
    { name: 'Tawau', slug: 'tawau', address: 'Jalan Kuhara, Tawau', city: 'Sabah', lat: 4.24, lng: 117.88, hours: '8 AM - 8 PM', isOpenNow: true },
    { name: 'Kuching', slug: 'kuching', address: 'Jalan Main Bazaar, Kuching', city: 'Sarawak', lat: 1.55, lng: 110.34, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Miri', slug: 'miri', address: 'Jalan North Yu Seng, Miri', city: 'Sarawak', lat: 4.41, lng: 114.0, hours: '9 AM - 10 PM', isOpenNow: true },
    { name: 'Sibu', slug: 'sibu', address: 'Jalan Channel, Sibu', city: 'Sarawak', lat: 2.29, lng: 111.82, hours: '8 AM - 9 PM', isOpenNow: false },
];

export default function OutletDataMigration() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMigrate = async () => {
    if (!firestore) return;
    if (!confirm('This will add 50 outlet documents to your "outlets" collection in Firestore. It will not delete any existing data. Do you want to proceed?')) {
      return;
    }
    
    setIsLoading(true);
    setStatus('Starting outlet data migration...');

    try {
      const batch = writeBatch(firestore);
      const outletsRef = collection(firestore, 'outlets');
      
      outlets.forEach((outletData) => {
        const outletRef = doc(outletsRef);
        batch.set(outletRef, {
            ...outletData,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
      });
      
      setStatus(`Preparing to write ${outlets.length} outlets...`);
      await batch.commit();

      setStatus(`Successfully migrated ${outlets.length} outlets to Firestore.`);
      toast({ title: 'Migration Complete', description: `${outlets.length} outlets have been added.` });
    } catch (error: any) {
      console.error('Outlet migration failed:', error);
      setStatus(`Error: ${error.message}`);
      toast({ variant: 'destructive', title: 'Migration Failed', description: 'Check console for details.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <p className="text-zinc-400">
            Click the button below to populate your Firestore database with 50 mock outlet locations. This is useful for testing the "Linked Outlets" feature in promotions.
        </p>
        <Button onClick={handleMigrate} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            Migrate 50 Outlets to Firestore
        </Button>
      {(isLoading || status) && (
        <div className="p-4 bg-zinc-800 rounded-md">
          <h3 className="font-semibold text-zinc-300">Status:</h3>
          <p className="text-sm text-zinc-400 font-mono">{status}</p>
        </div>
      )}
    </div>
  );
}
