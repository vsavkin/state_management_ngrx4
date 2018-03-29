import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { CustomMaterialModule } from './custom-material.module';

import { AppComponent } from './app.component';
import { TalksComponent } from './talks/talks.component';
import { TalkComponent } from './talk/talk.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { appReducer, initialState, TalksEffects } from './model';
import { Backend } from './backend';
import { FiltersComponent } from './filters/filters.component';
import { TalksAndFiltersComponent } from './talks-and-filters/talks-and-filters.component';
import { TalkDetailsComponent } from './talk-details/talk-details.component';
import { RateButtonComponent } from './rate-button/rate-button.component';
import { WatchButtonComponent } from './watch-button/watch-button.component';
import { FormatRatingPipe } from './format-rating.pipe';


@NgModule({
  declarations: [
    AppComponent,
    TalksComponent,
    TalkComponent,
    PageNotFoundComponent,
    FiltersComponent,
    TalksAndFiltersComponent,
    TalkDetailsComponent,
    RateButtonComponent,
    WatchButtonComponent,
    FormatRatingPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    CustomMaterialModule,
    StoreModule.forRoot({ app: appReducer }, { initialState }),
    EffectsModule.forRoot([TalksEffects]),
    StoreRouterConnectingModule
  ],
  providers: [Backend],
  bootstrap: [AppComponent]
})
export class AppModule { }
