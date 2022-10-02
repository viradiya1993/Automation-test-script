import { ChartOptions } from 'chart.js';
import { Color } from 'ng2-charts';

export const chartBarThickness = 10;
export const chartColors: Array<Color> = [
    { backgroundColor: 'rgba(151, 204, 100, 1)' },
    { backgroundColor: 'rgba(228, 77, 37, 1)' },
    { backgroundColor: 'rgba(207, 192, 187, 1)' },
    { backgroundColor: 'rgba(122, 163, 229, 1)' },
    { backgroundColor: 'rgba(168, 56, 93, 1)' },
    { backgroundColor: 'rgba(170, 227, 245, 1)' },
];

export const piChartColors: Color[] = [
    { backgroundColor: ['rgba(151, 204, 100, 1)', 'rgba(253, 115, 91, 1)', 'rgba(255, 215, 107, 1)'] }
]

export const areaChartColors: Color[] = [
    { borderColor: 'rgba(151, 204, 100, 1)' },
    { borderColor: 'rgba(253, 115, 91, 1)' },
    { borderColor: 'rgba(255, 215, 107, 1)' }
]

export const lineChartColors: Color[] = [
    { backgroundColor: 'rgba(151, 204, 100, 1)' },
    { backgroundColor: 'rgba(253, 115, 91, 1)' },
    { backgroundColor: 'rgba(255, 215, 107, 1)' }
]

export const chartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'bottom' },
    tooltips: { intersect: false, mode: 'index' }
};

export const piChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'right' }
}

export const barChartOption = {
    ...{
        scales: {
            xAxes: [{ stacked: true, gridLines: { display: false }, ticks: { stepSize: 1 } }],
            yAxes: [{ stacked: true, gridLines: { display: false }, ticks: { stepSize: 1, precision: 0 } }]
        }
    }, ...chartOptions
}

export const areaChartOption = {
    ...{
        scales: {
            yAxes: [{ stacked: true, ticks: { precision: 0 } }]
        }
    }, ...chartOptions
}

