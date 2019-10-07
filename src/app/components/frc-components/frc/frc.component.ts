import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FlamelinkService} from '../../../services/flamelink.service';

@Component({
  selector: 'app-frc',
  templateUrl: './frc.component.html',
  styleUrls: ['./frc.component.css']
})
export class FrcComponent implements OnInit {

  teamId: string;
  dbPromise: Promise<any>;
  teamMember = [];
  isMemberLoaded = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _fl: FlamelinkService
  ) { }

  private loadMembers = () => {
    this.route.params.subscribe(async params => {
      this.isMemberLoaded = false;
      this.teamId = params['teamNum'];
      this.dbPromise = await this._fl.getApp().content.getByField({
        schemaKey: 'teams',
        field: 'teamName',
        value: this.teamId
      });
      for (const e of this.dbPromise[Object.keys(this.dbPromise)[0]].teamMemberPhotos) {
        e['image_url'] = await this._fl.getApp().storage.getURL({ fileId: e.image[0].id });
      }
      this.teamMember = this.dbPromise[Object.keys(this.dbPromise)[0]].teamMemberPhotos;
      this.isMemberLoaded = true;
    });
  }

  async ngOnInit() {
    this.loadMembers();
  }
}