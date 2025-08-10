import { Card, CardContent, CardHeader, Box, Typography } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

type PieDatum = { name: string; value: number };

const COLORS = ['#1976d2', '#ff9800', '#2e7d32', '#9c27b0', '#607d8b'];

type Props = {
  title: string;
  data: PieDatum[];
};

const PieCard = ({ title, data }: Props) => {
  const total = data.reduce((s, d) => s + (d.value || 0), 0);

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title={title} />
      <CardContent sx={{ height: 300, pt: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={2}
            >
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: any) => String(v)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            Total: {total}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PieCard;
