import { MatInputModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatMenuModule, MatButtonModule, MatCardModule, MatTooltipModule } from '@angular/material';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [MatInputModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatMenuModule],
    exports: [MatInputModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatToolbarModule, MatIconModule, MatMenuModule]
})
export class CustomMaterialModule { }