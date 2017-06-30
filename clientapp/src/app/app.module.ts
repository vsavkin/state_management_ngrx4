import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { WatchButtonComponent } from './watch-button/watch-button.component';
import { TalksAndFiltersComponent } from './talks-and-filters/talks-and-filters.component';
import { TalksComponent } from './talks/talks.component';
import { TalkDetailsComponent } from './talk-details/talk-details.component';
import { TalkComponent } from './talk/talk.component';
import { RateButtonComponent } from './rate-button/rate-button.component';
import { FormatRatingPipe } from './format-rating.pipe';
import { FiltersComponent } from './filters/filters.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterialModule, MdInputModule, MdCheckboxModule } from '@angular/material';
import { Backend } from "./backend";
import { WatchService } from "./watch";
import { appReducer, initialState, State, TalksEffects } from './model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule, ActionReducer, combineReducers } from '@ngrx/store';
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";

@NgModule({
  declarations: [
    AppComponent,
    WatchButtonComponent,
    TalksAndFiltersComponent,
    TalksComponent,
    TalkDetailsComponent,
    TalkComponent,
    RateButtonComponent,
    FormatRatingPipe,
    FiltersComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,
    NoopAnimationsModule,

    MaterialModule,
    MdInputModule,
    MdCheckboxModule,

    RouterModule.forRoot([
      { path: '',  pathMatch: 'full', redirectTo: 'talks' },
      { path: 'talks',  pathMatch: 'full', component: TalksAndFiltersComponent },
      { path: 'talk/:id', component: TalkDetailsComponent }
    ], {useHash: true}),

    StoreModule.forRoot(<any>{app: appReducer}, {initialState}),

    EffectsModule.forRoot([
      TalksEffects
    ]),

    StoreRouterConnectingModule
  ],
  providers: [
    Backend,
    WatchService,
    TalksEffects
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
