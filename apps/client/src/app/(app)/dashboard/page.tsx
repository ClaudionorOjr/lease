import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchSchedulings } from '@/http/schedulings/fetch-schedulings';
import { fetchSolicitations } from '@/http/solicitations/fetch-solicitations';
import { CalendarCheck2, CalendarPlus } from 'lucide-react';

export default async function DashboardPage() {
  const { schedulings } = await fetchSchedulings();
  const { solicitations } = await fetchSolicitations();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Solicitations</CardTitle>
          <CalendarPlus className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {solicitations.length}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Schedulings</CardTitle>
          <CalendarCheck2 className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {schedulings.length}
        </CardContent>
      </Card>
    </div>
  );
}
