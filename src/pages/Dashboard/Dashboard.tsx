// src/pages/Dashboard/Dashboard.tsx
import React from 'react';
import {
  Box,
  Card,
  Grid,
  Typography,
  Skeleton,
  Icon,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import PageContainer from '../../components/Common/PageContainer';

type ChartPoint = { mes: string; tiempo: number };

const chartData: ChartPoint[] = [
  { mes: 'Ene', tiempo: 400 },
  { mes: 'Feb', tiempo: 800 },
  { mes: 'Mar', tiempo: 650 },
  { mes: 'Abr', tiempo: 900 },
  { mes: 'May', tiempo: 300 },
];

const maxY = Math.max(...chartData.map((d) => d.tiempo));

const Dashboard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const loading = false;

  const chartWidth = 400;
  const chartHeight = 200;
  const padding = 40;
  const pointSpacing = (chartWidth - padding * 2) / (chartData.length - 1);
  const scaleY = (value: number) =>
    chartHeight - padding - (value / maxY) * (chartHeight - padding * 2);

  const pathD = chartData
    .map((point, index) => {
      const x = padding + index * pointSpacing;
      const y = scaleY(point.tiempo);
      return `${index === 0 ? 'M' : 'L'} ${x},${y}`;
    })
    .join(' ');

  return (
    <PageContainer>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
            {loading ? (
              <Skeleton variant="rectangular" height={60} />
            ) : (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>description</Icon>
                  Cantidad preoperacionales
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  21324
                </Typography>
              </>
            )}
          </Card>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Card sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
            {loading ? (
              <Skeleton variant="rectangular" height={60} />
            ) : (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  <Icon sx={{ verticalAlign: 'middle', mr: 1 }}>directions_car</Icon>
                  Vehículos utilizados
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  16703
                </Typography>
              </>
            )}
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Tiempo de uso en el mes
        </Typography>

        {loading ? (
          <Skeleton variant="rectangular" height={240} />
        ) : (
          <Box sx={{ mt: 2, width: '100%', overflowX: 'auto' }}>
            <Box
              component="svg"
              sx={{ width: '100%', height: 200, minWidth: 360 }}
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            >
              {/* Ejes */}
              <line
                x1={padding}
                y1={chartHeight - padding}
                x2={chartWidth - padding}
                y2={chartHeight - padding}
                stroke="#ccc"
              />
              <line
                x1={padding}
                y1={padding}
                x2={padding}
                y2={chartHeight - padding}
                stroke="#ccc"
              />

              {/* Línea de datos */}
              <path
                d={pathD}
                fill="none"
                stroke={theme.palette.primary.main}
                strokeWidth={2}
              />

              {/* Puntos de datos */}
              {chartData.map((point, i) => {
                const x = padding + i * pointSpacing;
                const y = scaleY(point.tiempo);
                return (
                  <circle key={i} cx={x} cy={y} r={4} fill={theme.palette.primary.main} />
                );
              })}

              {/* Etiquetas del eje X */}
              {chartData.map((point, i) => {
                const x = padding + i * pointSpacing;
                return (
                  <text
                    key={i}
                    x={x}
                    y={chartHeight - padding + 15}
                    fontSize={12}
                    textAnchor="middle"
                    fill={theme.palette.text.secondary}
                  >
                    {point.mes}
                  </text>
                );
              })}
            </Box>
          </Box>
        )}
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
