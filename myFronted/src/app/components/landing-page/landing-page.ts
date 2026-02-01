import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink, Icon],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {

}
