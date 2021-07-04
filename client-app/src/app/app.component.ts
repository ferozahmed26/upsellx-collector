import {Component, OnInit, TemplateRef} from '@angular/core';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {take} from 'rxjs/operators';
import {DataService} from './services/data.service';
import {Client} from './models/client';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

const isValidURL = (str) => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(str);
};

function siteValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    if (control.value !== undefined && !isValidURL(control.value)) {
      return { invalid: true };
    }
    return null;
  };
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  modalRef: BsModalRef | null;
  client: FormControl;
  clientList: any[] = [];
  facebookDataJson = {
    title: '',
    subTitle: '',
    starCount: '',
    likeCount: '',
    followersCount: '',
    checkInCount: '',
    location: '',
    phone: '',
    website: ''
  };
  twitterDataJson = {
    pageCreated: '',
    description: '',
    followersCount: 0,
    friendsCount: 0,
    location: '',
    name: '',
    normalFollowersCount: 0,
    profileBannerUrl: '',
    profileImageUrlHttps: '',
    screenName: '',
    postCount: 0
  };
  selectedClient: any;

  constructor(private data: DataService, private modalService: BsModalService) { }

  ngOnInit() {
    this.client = new FormControl('', Validators.compose([Validators.required, siteValidator()]));
    this.getClientList();
  }

  getClientList() {
    this.data.getClientList().pipe(take(1)).subscribe((response: Client[]) => {
      this.clientList = response.map(m => {
        m.badge = m.status === 'done' ? 'badge-success' : 'badge-secondary';
        m.createdAt = new Date(m.createdAt);
        m.updatedAt = new Date(m.updatedAt);
        return m;
      });
    });
  }

  prepareData(data) {
    Object.keys(this.facebookDataJson).forEach(f => this.facebookDataJson[f] = data['fb_' + f]);
    Object.keys(this.twitterDataJson).forEach(f => this.twitterDataJson[f] = data['twt_' + f]);
  }

  submit() {
    this.data.addClient(this.client.value).pipe(take(1)).subscribe(response => {
      setTimeout(() => this.getClientList(), 500);
    }, error => console.log(error));
    return;
  }

  onFormSubmit() {
    return false;
  }

  openClientModal(client, template: TemplateRef<any>) {
    this.selectedClient = client;
    this.prepareData(client);
    this.modalRef = this.modalService.show(template);
  }

  closeFirstModal() {
    if (!this.modalRef) {
      return;
    }
    this.modalRef.hide();
    this.modalRef = null;
  }

  trackByFn(index, item) {
    return item.id;
  }
}
