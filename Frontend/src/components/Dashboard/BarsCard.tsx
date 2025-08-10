import { Card, CardContent, CardHeader } from '@mui/material';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from 'recharts';

type Item = { label: string; value: number };

type Props = {
  title: string;
  items: Item[];
  suffix?: string; // e.g., '%'
};

const BarsCard = ({ title, items, suffix = '' }: Props) => {
  const data = items.map((it) => ({ name: it.label, value: it.value }));

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} />
      <CardContent sx={{ height: 300, pt: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: any) => `${v}${suffix}`} />
            <Bar dataKey="value" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default BarsCard;
