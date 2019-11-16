import { LocationScatterChartComponent } from './../../charts/location-scatter-chart/location-scatter-chart.component';
import {
  LocationUpdate,
  LeaderboardEntry
} from './../../services/location-update.model';
import { LocationUpdatesService } from './../../services/location-updates.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { take, debounceTime, auditTime } from 'rxjs/operators';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.scss']
})
export class GamePageComponent implements OnInit {
  @ViewChild(LocationScatterChartComponent, { static: true })
  scatterChart: LocationScatterChartComponent;
  initalized: boolean;
  leaderBoard: LeaderboardEntry[] = [];
  constructor(private updatesService: LocationUpdatesService) {}

  ngOnInit() {
    this.startServer();
  }

  async startServer() {
    this.updatesService
      .startServer()
      .pipe(take(1))
      .toPromise();
    this.updatesService
      .getUpdates()
      .pipe(auditTime(100))
      .subscribe((message: LocationUpdate) => {
        console.log('Got value...');
        if (!this.initalized) {
          this.initChart(message as LocationUpdate);
        } else {
          this.updateChart(message as LocationUpdate);
        }
        if (message.leaderboard.length) {
          this.leaderBoard = message.leaderboard;
        }
      });
  }

  private initChart(locationUpdate: LocationUpdate) {
    this.scatterChart.setChartData(this.convertToChart(locationUpdate));
    this.initalized = true;
  }

  private updateChart(locationUpdate: LocationUpdate) {
    const lookup = this.convertToLookupTable(locationUpdate);
    this.scatterChart.updateData(lookup);
  }

  private convertToLookupTable(locationUpdate: LocationUpdate) {
    const lookupTable = {};
    locationUpdate.users.forEach(userUpdate => {
      lookupTable[userUpdate.id] = {
        x: userUpdate.latitude,
        y: userUpdate.longitude,
        id: userUpdate.id
      };
    });
    console.log('User count: ', locationUpdate.users.length);
    // console.log(lookupTable);
    return lookupTable;
  }
  private convertToChart(locationUpdate: LocationUpdate) {
    const chartUpdate = locationUpdate.users.map(userUpdate => {
      return {
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
      };
    });
    return chartUpdate;
  }
}
