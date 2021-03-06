import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {take} from 'rxjs/operators';
import {DataService} from './services/data.service';
import {Client} from './models/client';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import {WebSocketService} from "./services/web-socket.service";
import {Subscription} from "rxjs";
import {WebSocketSubject} from "rxjs/internal-compatibility";

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
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('templateError', { read: TemplateRef }) templateError: TemplateRef<any>;
  modalRef: BsModalRef | null;
  client: FormControl;
  submitting = false;
  clientList: any[] = [];
  errorData = {};
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
  private socket$: WebSocketSubject<any>;
  constructor(private data: DataService, private webSocket: WebSocketService, private modalService: BsModalService) { }

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
    const data = this.client.value;
    this.client.setValue('');
    this.submitting = true;
    this.errorData = {};
    this.data.addClient(data).pipe(take(1)).subscribe(response => {
      this.submitting = false;
      setTimeout(() => this.getClientList(), 100);
    }, error => {
      this.submitting = false;
      if (error.hasOwnProperty('error')) {
        this.errorData = error.error;
      } else {
        this.errorData = {message: error.message};
      }
      this.openErrorModal(this.templateError);
    });
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

  openErrorModal(template: TemplateRef<any>) {
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

  ngAfterViewInit() {
    // this.webSocket.connect({reconnect: true});
    this.socket$ = new WebSocketSubject('ws://localhost:8081');
    this.socket$.subscribe(
      (data) => {
        this.getClientList();
      },
      (err) => console.error(err),
      () => console.warn('Completed!')
    );
  }

  ngOnDestroy() {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}
