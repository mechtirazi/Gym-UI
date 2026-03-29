import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { 
  NgApexchartsModule, 
  ChartComponent, 
  ApexAxisChartSeries, 
  ApexChart, 
  ApexXAxis, 
  ApexDataLabels, 
  ApexStroke, 
  ApexGrid, 
  ApexYAxis, 
  ApexTooltip, 
  ApexTheme, 
  ApexFill,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexPlotOptions
} from 'ng-apexcharts';
import { AdminAnalyticsService, RevenueAnalytics } from '../../../../core/services/admin-analytics.service';
import { AdminGymsService } from '../../../../core/services/admin-gyms.service';
import { GymDto } from '../../../../core/models/api.models';
import { catchError, finalize, of } from 'rxjs';

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  theme: ApexTheme;
  fill: ApexFill;
  colors: string[];
};

export type DonutChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  theme: ApexTheme;
  colors: string[];
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
};

@Component({
  selector: 'app-revenue-analytics',
  standalone: true,
  imports: [CommonModule, MatIconModule, NgApexchartsModule],
  templateUrl: './revenue-analytics.component.html',
  styleUrl: './revenue-analytics.component.scss'
})
export class RevenueAnalyticsComponent implements OnInit {
  private analyticsService = inject(AdminAnalyticsService);
  private gymsService = inject(AdminGymsService);

  loading = signal(true);
  error = signal<string | null>(null);
  mrr = signal(0);
  activeSubscriptions = signal(0);
  arpu = signal(0);
  mrrGrowth = signal(0);
  isHealthyGrowth = signal(true);
  
  atRiskRevenue = signal(0);
  churnedRevenue = signal(0);
  expiringGyms = signal<GymDto[]>([]);
  
  actionLoading = signal<string | null>(null);

  public lineChartOptions: Partial<LineChartOptions> | any;
  public donutChartOptions: Partial<DonutChartOptions> | any;

  ngOnInit() {
    this.initChartOptions();
    this.loadData();
  }

  private initChartOptions() {
    this.lineChartOptions = {
      series: [{ name: "Revenue", data: [0, 0, 0, 0, 0, 0] }],
      chart: {
        height: 300,
        type: "area",
        toolbar: { show: false },
        fontFamily: 'Inter, system-ui, sans-serif',
        animations: { enabled: true, easing: 'easeinout', speed: 800 }
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 4, colors: ['#0284c7'] }, // primary-600
      colors: ['#0284c7'],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.02,
          stops: [0, 90, 100]
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 4,
        padding: { left: 0, right: 0 },
        yaxis: { lines: { show: true } }
      },
      xaxis: {
        categories: [],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 } }
      },
      yaxis: {
        labels: {
          style: { colors: '#94a3b8', fontSize: '11px', fontWeight: 600 },
          formatter: (val: number) => `$${Math.round(val/1000)}k`
        }
      },
      tooltip: { 
        theme: 'light',
        x: { show: true },
        marker: { show: false }
      }
    };

    this.donutChartOptions = {
      series: [0, 0],
      chart: {
        type: "donut",
        height: 280,
        fontFamily: 'Inter, system-ui, sans-serif'
      },
      labels: ["Basic", "Pro"],
      colors: ['#10b981', '#c026d3'], // Emerald & secondary-600
      stroke: { show: true, width: 2, colors: ['#ffffff'] },
      plotOptions: {
        pie: {
          donut: {
            size: '80%',
            labels: {
              show: true,
              name: { show: true, fontSize: '12px', fontWeight: 600, color: '#64748b', offsetY: -10 },
              value: { 
                show: true, 
                fontSize: '24px', 
                fontWeight: 800, 
                color: '#0f172a', 
                offsetY: 10,
                formatter: (val: string) => val 
              },
              total: {
                show: true,
                label: 'TOTAL GYMS',
                color: '#94a3b8',
                fontSize: '10px',
                fontWeight: 700,
                formatter: (w: any) => {
                  return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                }
              }
            }
          }
        }
      },
      legend: { show: false },
      tooltip: { theme: 'light' }
    };
  }

  loadData() {
    this.loading.set(true);
    this.analyticsService.getRevenueAnalytics().pipe(
      catchError(err => {
        this.error.set('Failed to load revenue analytics');
        return of(null);
      }),
      finalize(() => this.loading.set(false))
    ).subscribe(data => {
      if (data) {
        this.mrr.set(data.mrr || 0);
        const activeSub = (data?.basic_gyms_count || 0) + (data?.pro_gyms_count || 0);
        this.activeSubscriptions.set(activeSub);
        this.arpu.set(activeSub > 0 ? (data.mrr || 0) / activeSub : 0);
        
        this.atRiskRevenue.set(data.at_risk_revenue || 0);
        this.churnedRevenue.set(data.churned_revenue || 0);
        this.expiringGyms.set(data.expiring_gyms || []);

        if (data?.revenue_trend && data.revenue_trend.length >= 2) {
          const currentMonthRev = data.revenue_trend[data.revenue_trend.length - 1].revenue;
          const lastMonthRev = data.revenue_trend[data.revenue_trend.length - 2].revenue;
          if (lastMonthRev > 0) {
            const growth = ((currentMonthRev - lastMonthRev) / lastMonthRev) * 100;
            this.mrrGrowth.set(Math.round(growth));
            this.isHealthyGrowth.set(growth > 0);
          } else if (currentMonthRev > 0) {
            this.mrrGrowth.set(100);
            this.isHealthyGrowth.set(true);
          } else {
            this.mrrGrowth.set(0);
            this.isHealthyGrowth.set(true);
          }
        }

        // Update Line Chart
        this.lineChartOptions.series = [{
          name: 'Revenue',
          data: data?.revenue_trend?.map(item => item.revenue) || [0, 0, 0, 0, 0, 0]
        }];
        this.lineChartOptions.xaxis = {
          ...this.lineChartOptions.xaxis,
          categories: data?.revenue_trend?.map(item => item.month) || ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
        };

        // Update Donut Chart
        this.donutChartOptions.series = [
          data?.basic_gyms_count || 0,
          data?.pro_gyms_count || 0
        ];
      }
    });
  }

  renewGym(gymId: string) {
    this.actionLoading.set(gymId);
    this.gymsService.renewGym(gymId).subscribe({
      next: () => {
        this.actionLoading.set(null);
        this.loadData();
      },
      error: () => this.actionLoading.set(null)
    });
  }

  trackByGymId(index: number, gym: GymDto) {
    return gym.id_gym;
  }
}
