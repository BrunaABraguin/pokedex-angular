import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PokemonService } from './../../shared/services/pokemon.service';
import { Component, OnInit } from '@angular/core';
import { Pokemon } from 'src/app/shared/models/pokemon';
import { PokemonList } from 'src/app/shared/models/pokemon-list';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.scss'],
})
export class PokemonListComponent implements OnInit {
  pokemons: Pokemon[] = [];

  private offset: number;
  isLastPage = false;

  constructor(
    private pokemonService: PokemonService,
    private snackBar: MatSnackBarModule
  ) {
    this.offset = 0;
  }

  ngOnInit(): void {
    this.getPagination(this.offset);
  }

  getPagination(offset: number) {
    if (!this.isLastPage) {
      this.pokemonService
        .getPokemons(offset)
        .subscribe((list: PokemonList[]) => {
          if (list.length === 0) {
            this.isLastPage = true;
          }
          if (!this.isLastPage) {
            this.getPokemonDetail(list);
            console.log(list);
          }
        });
    }
  }

  getPokemonDetail(list: PokemonList[]) {
    const arr: Observable<Pokemon>[] = [];
    list.map((value: PokemonList) => {
      arr.push(this.pokemonService.getPokemon(value.name));
    });

    forkJoin([...arr]).subscribe((pokemons: []) => {
      this.pokemons.push(...pokemons);
      this.offset += 9;
      console.log(this.pokemons);
    });
  }

  morePokemons(): void {
    this.getPagination(this.offset);
    console.log(this.offset);

  }
}
