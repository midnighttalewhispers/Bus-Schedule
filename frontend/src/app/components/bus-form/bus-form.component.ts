import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { BusTimetable } from '../../models/bus-timetable.model';

/**
 * BusFormComponent
 *
 * A modal dialog used for BOTH adding a new bus record AND editing an existing one.
 * The parent (BusListComponent) controls visibility and passes in the bus to edit.
 *
 * Inputs:
 *   - isVisible: boolean  → show/hide the modal
 *   - busToEdit: BusTimetable | null → null = Add mode, object = Edit mode
 *
 * Outputs:
 *   - formSubmit: BusTimetable → emits the validated form data to the parent
 *   - formCancel: void         → emits when the user cancels / closes
 */
@Component({
  selector: 'app-bus-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bus-form.component.html',
  styleUrls: ['./bus-form.component.scss']
})
export class BusFormComponent implements OnInit, OnChanges {

  @Input() isVisible = false;
  @Input() busToEdit: BusTimetable | null = null;
  @Input() allRouteNumbers: string[] = [];

  @Output() formSubmit = new EventEmitter<BusTimetable>();
  @Output() formCancel = new EventEmitter<void>();

  busForm!: FormGroup;
  filteredRouteNumbers: string[] = [];

  // Sri Lankan phone regex: +94XXXXXXXXX or 0XXXXXXXXX (exactly 10 digits after prefix)
  private readonly phoneRegex = /^(\+94|0)[0-9]{9}$/;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.busForm.get('routeNumber')?.valueChanges.subscribe(value => {
      this.filterRouteNumbers(value);
    });
  }

  filterRouteNumbers(value: string | null): void {
    if (value && value.length >= 2) {
      const lowerValue = value.toLowerCase();
      this.filteredRouteNumbers = this.allRouteNumbers.filter(
        route => route.toLowerCase().includes(lowerValue) && route !== value
      );
    } else {
      this.filteredRouteNumbers = [];
    }
  }

  selectRouteNumber(route: string): void {
    this.busForm.get('routeNumber')?.setValue(route, { emitEvent: false });
    this.filteredRouteNumbers = [];
  }

  /**
   * React to changes in @Input() busToEdit.
   * When a bus is passed in → patch the form with its values (Edit mode).
   * When null is passed → reset the form (Add mode).
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['busToEdit'] && this.busForm) {
      if (this.busToEdit) {
        // Clear existing array
        this.contactPhones.clear();
        
        // Populate array from comma-separated string
        if (this.busToEdit.contactPhone) {
          const phones = this.busToEdit.contactPhone.split(',').map(p => p.trim());
          phones.forEach(p => this.addContactPhone(p));
        } else {
          this.addContactPhone();
        }

        // Patch other values
        this.busForm.patchValue({
          ...this.busToEdit
        });
      } else {
        this.busForm.reset();
        this.contactPhones.clear();
        this.addContactPhone();
      }
    }
  }

  /** Returns true if this form is in Edit mode (a bus was passed in) */
  get isEditMode(): boolean {
    return this.busToEdit !== null;
  }

  /** Build the reactive form with validators */
  private buildForm(): void {
    this.busForm = this.fb.group({
      busName:         ['', [Validators.required, Validators.maxLength(100)]],
      routeNumber:     ['', [Validators.maxLength(50)]],
      numberPlate:     ['', [Validators.maxLength(20)]],
      fromDestination: ['', [Validators.required, Validators.maxLength(100)]],
      toDestination:   ['', [Validators.required, Validators.maxLength(100)]],
      departureTime:   ['', [Validators.required]],
      returnTime:      [''],   // optional
      contactPhones:   this.fb.array([
        this.fb.control('', [Validators.required, Validators.pattern(this.phoneRegex)])
      ]),
      notes:           [''],   // optional
    });
  }

  /** Helper: get a form control for cleaner template access */
  f(field: string) {
    return this.busForm.get(field);
  }

  /** Helper: check if a field is invalid and has been touched */
  isInvalid(field: string): boolean {
    const ctrl = this.f(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  get contactPhones(): FormArray {
    return this.busForm.get('contactPhones') as FormArray;
  }

  addContactPhone(value: string = ''): void {
    this.contactPhones.push(this.fb.control(value, [Validators.required, Validators.pattern(this.phoneRegex)]));
  }

  removeContactPhone(index: number): void {
    if (this.contactPhones.length > 1) {
      this.contactPhones.removeAt(index);
    }
  }

  isPhoneInvalid(index: number): boolean {
    const ctrl = this.contactPhones.at(index);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  /** Called when the form is submitted */
  onSubmit(): void {
    if (this.busForm.invalid) {
      // Mark all fields as touched so error messages appear
      this.busForm.markAllAsTouched();
      return;
    }
    const formValue = this.busForm.value;
    const bus: BusTimetable = {
      ...formValue,
      contactPhone: formValue.contactPhones.join(', ')
    };
    delete (bus as any).contactPhones;
    this.formSubmit.emit(bus);
  }

  /** Called when Cancel button or backdrop is clicked */
  onCancel(): void {
    this.busForm.reset();
    this.formCancel.emit();
  }
}
