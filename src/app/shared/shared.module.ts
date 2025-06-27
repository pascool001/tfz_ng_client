import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterLink, RouterModule, RouterOutlet } from "@angular/router";
import { NgIconComponent } from "@ng-icons/core";

@NgModule({
    declarations: [],
    imports:[
        RouterModule,
        CommonModule,
        RouterOutlet,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
        NgIconComponent
    ],
    exports:[
        RouterModule,
        CommonModule,
        RouterOutlet,
        RouterLink,
        ReactiveFormsModule,
        FormsModule,
        NgIconComponent
    ]
})
export class SharedModule {}
