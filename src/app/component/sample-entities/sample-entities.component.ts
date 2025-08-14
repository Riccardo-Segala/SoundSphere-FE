import {Component, inject, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef,
  MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {SampleEntity} from '../../dto/sample-entity.model';
import {SampleEntityService} from '../../service/sample-entity.service';
import {lastValueFrom} from 'rxjs';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-sample-entities',
  imports: [
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    MatButton
  ],
  templateUrl: './sample-entities.component.html',
  styleUrl: './sample-entities.component.scss'
})
export class SampleEntitiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: SampleEntity[]=[];
  readonly dialog = inject(MatDialog);


  constructor(private sampleEntitiesService: SampleEntityService) {}

  async ngOnInit() {
    await this.loadSampleEntities();
  }

  async loadSampleEntities(): Promise<void> {
    this.dataSource=await lastValueFrom(this.sampleEntitiesService.getAll());
    console.log(this.dataSource);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddEntity, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.loadSampleEntities().then(r => {
        console.log('Sample entities reloaded');
      });
    });
  }

  async deleteItem(id: string): Promise<void> {
    await lastValueFrom(this.sampleEntitiesService.delete(id));
    await this.loadSampleEntities();
  }
}

@Component(
  {
    selector: 'dialog-add-entity',
    templateUrl: './dialog-add-entity.html',
    imports: [
      MatFormFieldModule,
      MatInputModule,
      FormsModule,
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions
    ]
  }
)
export class DialogAddEntity{
  readonly dialogRef = inject(MatDialogRef<DialogAddEntity>);
  name: string='';
  onNoClick(): void {
    this.dialogRef.close();
  }

  constructor(private sampleEntityService: SampleEntityService) {}

  async save() {
    let entity = new SampleEntity();
    entity.name = this.name;
    await lastValueFrom(this.sampleEntityService.create(entity));
    this.dialogRef.close();
  }
}
