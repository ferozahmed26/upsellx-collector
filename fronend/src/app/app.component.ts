import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, ValidatorFn, Validators} from '@angular/forms';
import {take} from 'rxjs/operators';
import {DataService} from './services/data.service';
import {Client} from './models/client';

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

  client: FormControl;
  clientList: Client[] = [];
  constructor(private data: DataService) {
  }
  ngOnInit() {
    this.client = new FormControl('', Validators.compose([Validators.required, siteValidator()]));
    this.data.getClientList().pipe(take(1)).subscribe((response: Client[]) => {
      this.clientList = response.map(m => {
        m.badge = m.status === 'done' ? 'badge-success' : 'badge-secondary';
        m.createdAt = new Date(m.createdAt);
        m.updatedAt = new Date(m.updatedAt);
        return m;
      });
      console.log(this.clientList);
    });
  }

  submit() {
    console.log(this.client.value);
    this.data.addClient(this.client.value).pipe(take(1)).subscribe(response => {
      console.log(response);
    }, error => console.log(error));
    return;
  }

  onFormSubmit() {
    return false;
  }
}
