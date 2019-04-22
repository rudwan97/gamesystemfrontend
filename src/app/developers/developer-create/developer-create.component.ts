import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { DevelopersService } from '../developers.service';
import { Developer } from '../developer.model';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-developer-create',
  templateUrl: './developer-create.component.html',
  styleUrls: ['./developer-create.component.css']
})
export class DeveloperCreateComponent implements OnInit, OnDestroy {
  enteredName = '';
  enteredDescription = '';
  enteredCity = '';
  developer: Developer;
  isLoading = false;
  form: FormGroup;
  private mode = 'create';
  private developerId: string;
  private authStatusSub: Subscription;

  constructor(
    public developersService: DevelopersService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      description: new FormControl(null, { validators: [Validators.required] }),
      city: new FormControl(null, { validators: [Validators.required] })
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('developerId')) {
        this.mode = 'edit';
        this.developerId = paramMap.get('developerId');
        this.isLoading = true;
        this.developersService.getDeveloper(this.developerId).subscribe(developerData => {
          this.isLoading = false;
          this.developer = {
            id: developerData._id,
            name: developerData.name,
            description: developerData.description,
            city: developerData.city,
            creator: developerData.creator
          };
          this.form.setValue({
            name: this.developer.name,
            description: this.developer.description,
            city: this.developer.city
          });
        });
      } else {
        this.mode = 'create';
        this.developerId = null;
      }
    });
  }

  onSaveDeveloper() {
    if (this.form.invalid) {
      console.log('Developer form is invalid!');
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      console.log('Saving Developer!');
      this.developersService.addDeveloper(
        this.form.value.name,
        this.form.value.description,
        this.form.value.city
      );
    } else {
      this.developersService.updateDeveloper(
        this.developerId,
        this.form.value.name,
        this.form.value.description,
        this.form.value.city
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
