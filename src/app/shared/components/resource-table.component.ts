import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ColumnDef<T> {
  key: Extract<keyof T, string> | string;
  header: string;
  type?: 'text' | 'badge' | 'date' | 'actions' | 'custom';
  sortable?: boolean;
}

@Component({
  selector: 'app-resource-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule],
  template: `
    <div class="bg-white dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
      <!-- Toolbar -->
      <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-700/50 flex flex-wrap justify-between items-center bg-slate-50/50 dark:bg-slate-900/50 gap-4">
        <h3 class="text-lg font-bold text-slate-800 dark:text-white">{{title}}</h3>
        <div class="flex items-center gap-3">
          <ng-content select="[toolbar-actions]"></ng-content>
        </div>
      </div>

      <!-- Table Wrapper -->
      <div class="overflow-x-auto">
        <table mat-table [dataSource]="data" matSort (matSortChange)="sortData($event)" class="w-full bg-transparent">
          
          <ng-container *ngFor="let col of columns" [matColumnDef]="col.key">
            <th mat-header-cell *matHeaderCellDef mat-sort-header [disabled]="!col.sortable" 
                class="!text-sm !font-semibold !uppercase !tracking-wider !text-slate-500 !bg-transparent border-b border-slate-100 dark:border-slate-800 !p-4"> 
              {{col.header}} 
            </th>
            
            <td mat-cell *matCellDef="let element" class="!p-4 border-b border-slate-100 dark:border-slate-800 !text-slate-700 dark:!text-slate-300">
              <ng-container [ngSwitch]="col.type">
                
                <!-- Default text -->
                <span *ngSwitchDefault class="font-medium">{{ element[col.key] || '-' }}</span>
                
                <!-- Date -->
                <span *ngSwitchCase="'date'" class="text-slate-500 dark:text-slate-400">
                  {{ element[col.key] ? (element[col.key] | date:'mediumDate') : '-' }}
                </span>
                
                <!-- Actions -->
                <div *ngSwitchCase="'actions'" class="flex items-center gap-1 justify-end">
                  <button *ngIf="showImpersonate" mat-icon-button (click)="$event.stopPropagation(); impersonate.emit(element)" 
                          matTooltip="Impersonate {{title}}"
                          class="!w-8 !h-8 !text-slate-400 hover:!text-amber-600 hover:!bg-amber-50 dark:hover:!bg-amber-900/30 transition-colors">
                    <mat-icon class="!text-[18px]">visibility</mat-icon>
                  </button>
                  <button mat-icon-button (click)="$event.stopPropagation(); edit.emit(element)" 
                          matTooltip="Edit {{title}}"
                          class="!w-8 !h-8 !text-slate-400 hover:!text-blue-600 hover:!bg-blue-50 dark:hover:!bg-blue-900/30 transition-colors">
                    <mat-icon class="!text-[18px]">edit</mat-icon>
                  </button>
                  <button mat-icon-button (click)="$event.stopPropagation(); delete.emit(element)"
                          matTooltip="Delete {{title}}" 
                          class="!w-8 !h-8 !text-slate-400 hover:!text-red-600 hover:!bg-red-50 dark:hover:!bg-red-900/30 transition-colors">
                    <mat-icon class="!text-[18px]">delete_outline</mat-icon>
                  </button>
                </div>
                
                <!-- Custom mapped in the parent via ng-template, but simplified here by emitting click for custom cells. Alternatively, pass templateRefs -->
              </ng-container>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              (click)="rowClick.emit(row)"
              class="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer group"
              [class.hidden]="loading">
          </tr>
          
          <!-- Loading State -->
          <tr class="mat-row" *ngIf="loading">
             <td class="mat-cell !p-6" [colSpan]="columns.length">
               <div class="flex flex-col gap-4 w-full">
                 <div *ngFor="let _ of [1,2,3,4,5]" class="h-12 bg-slate-200 dark:bg-slate-700/50 rounded-xl animate-pulse w-full"></div>
               </div>
             </td>
          </tr>

          <!-- No Data State -->
          <tr class="mat-row" *ngIf="!loading && data.length === 0">
            <td class="mat-cell !p-8 text-center" [colSpan]="columns.length">
               <div class="flex flex-col items-center justify-center py-12">
                  <div class="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                     <mat-icon class="text-slate-300 dark:text-slate-500 scale-150">search_off</mat-icon>
                  </div>
                  <h4 class="text-lg font-bold text-slate-700 dark:text-slate-200 mb-1">No Data Found</h4>
                  <p class="text-sm text-slate-500 dark:text-slate-400 max-w-sm text-center">There are no generic {{title | lowercase}} available or matching the current view constraints.</p>
               </div>
            </td>
          </tr>
        </table>
      </div>

      <!-- Pagination -->
      <mat-paginator [length]="totalItems"
                     [pageSize]="pageSize"
                     [pageSizeOptions]="pageSizeOptions"
                     (page)="page.emit($event)"
                     class="!bg-transparent border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
      </mat-paginator>
    </div>
  `
})
export class ResourceTableComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: ColumnDef<T>[] = [];
  @Input() title = 'Resouces';
  @Input() totalItems = 0;
  @Input() showImpersonate: boolean = false;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Input() loading = false;

  @Output() sortChange = new EventEmitter<Sort>();
  @Output() page = new EventEmitter<PageEvent>();
  @Output() impersonate = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() rowClick = new EventEmitter<T>();

  get displayedColumns(): string[] {
    return this.columns.map(c => c.key);
  }

  sortData(sort: Sort) {
    this.sortChange.emit(sort);
  }
}
