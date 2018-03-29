import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TalksAndFiltersComponent } from './talks-and-filters/talks-and-filters.component';
import { TalkDetailsComponent } from './talk-details/talk-details.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'talks' },
  { path: 'talks', component: TalksAndFiltersComponent },
  { path: 'talk/:id', component: TalkDetailsComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
