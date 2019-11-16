import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-location-scatter-chart',
  templateUrl: './location-scatter-chart.component.html',
  styleUrls: ['./location-scatter-chart.component.scss']
})
export class LocationScatterChartComponent implements OnInit {
  chart: any;
  @ViewChild('myChart', { static: true }) private chartRef;

  constructor() {}

  ngOnInit() {
    this.chart = new Chart(this.chartRef.nativeElement, {
      type: 'scatter',
      data: {
        labels: [], // your labels array
        datasets: []
      },
      options: {
        animation: {
          duration: 2000,
          easing: 'linear'
        },
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              display: false,
              ticks: {
                min: 60.1845,
                max: 60.1864
              }
            }
          ],
          yAxes: [
            {
              display: false,
              ticks: {
                min: 24.8225,
                max: 24.826
              }
            }
          ]
        }
      }
    });
    // setInterval(() => this.updateData(), 300);
  }

  setChartData(data: any) {
    this.chart.data.datasets = data;
    this.chart.update();
  }
  updateData(lookupTableOfUpdates: any) {
    let deleteCount = 0;
    this.chart.data.datasets.forEach(dataset => {
      dataset.data = dataset.data.map(data => {
        if (!!data && data.id && !!lookupTableOfUpdates[data.id]) {
          const newData = lookupTableOfUpdates[data.id];
          lookupTableOfUpdates[data.id] = null;
          delete lookupTableOfUpdates[data.id];
          deleteCount += 1;
          return newData;
        }
        return data;
      });
    });
    console.log('Deleted: ', deleteCount);
    console.log('Lookup length: ', Object.keys(lookupTableOfUpdates).length);
    console.log('Points before update: ', this.chart.data.datasets.length)
    // Add nodes that are new
    const dataSetsToAdd = [];
    if (lookupTableOfUpdates && this.chart.data.datasets) {
      Object.keys(lookupTableOfUpdates).map(key => {
        const userUpdate = lookupTableOfUpdates[key];
        //console.log('New data: ', userUpdate)
        if (!!userUpdate) {
          dataSetsToAdd.push({
            data: [
              {
                x: userUpdate.latitude,
                y: userUpdate.longitude,
                id: userUpdate.id
              }
            ],
            borderColor: '#00AEFF',
            fill: false,
            teamId: userUpdate.team
          });
        }
      });
    }

    this.chart.data.datasets = [...this.chart.data.datasets, ...dataSetsToAdd];
    console.log('Dataset length: ', this.chart.data.datasets.length);

    this.chart.update();
  }
}
