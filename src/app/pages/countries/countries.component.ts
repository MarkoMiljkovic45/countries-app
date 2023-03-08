import {Component, OnInit} from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import {CountriesService} from "../../services/countries.service";
import {Country} from "../../models/country.interface";
import {map, Observable, shareReplay, startWith, switchMap} from "rxjs";
import {CommonModule} from "@angular/common";
import {CountryCardComponent} from "../../components/country-card/country-card.component";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, MatInputModule, CountryCardComponent, ReactiveFormsModule],
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.scss'],
})
export class CountriesComponent implements OnInit{
  search = new FormControl("");
  filteredCountries$: Observable<Country[]> = this.countriesService.getAllCountries().pipe(shareReplay());
  countries$: Observable<Country[]> = this.filteredCountries$;
  constructor(private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.filteredCountries$ = this.search.valueChanges.pipe(
      startWith(""),
      switchMap((search) => {
        if (search) {
          return this.countries$.pipe(
            map((countries) => {
              return countries.filter((country) => country.name.toLowerCase().
                                                            includes(search.toLowerCase()))
            }))
        } else {
          return this.countries$
        }
      })
    );

  }
}
