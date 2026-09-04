import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { FavoritesApi } from '../../../../shared/services/favorites-api';
import { MoviesApi } from '../../services/movies-api';

@Component({
  selector: 'app-movie-details',
  imports: [DecimalPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {
  private readonly _movieApi = inject(MoviesApi);
  private readonly _favoritesApi = inject(FavoritesApi);

  readonly BASE_PATH = 'http://localhost:3000';

  id = input.required<string>();

  movieDetailsResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._movieApi.getMovieDetails(+params),
  });

  movieDetails = linkedSignal(() => {
    const ERROR_ON_RESPONSE = !!this.movieDetailsResource.error();

    if (ERROR_ON_RESPONSE) return undefined;

    return this.movieDetailsResource.value();
  });

  currentRating = signal<number | undefined>(undefined);

  starsStatusFilled = computed(() => {
    const currentRating = this.currentRating() ?? 0;

    return [0, 1, 2, 3, 4].map((index) => index < currentRating);
  });

  rateMovieResource = rxResource({
    params: () => {
      const rating = this.currentRating() ?? 0;

      if (rating > 0) return { id: this.id(), rating };

      return undefined;
    },
    stream: ({ params }) =>
      this._movieApi
        .rateMovie(+params.id, params.rating)
        .pipe(tap((movieUpdated) => this.movieDetails.set(movieUpdated))),
  });

  isMovieFavoriteResource = rxResource({
    params: () => this.id(),
    stream: ({ params }) => this._favoritesApi.isMovieInFavorites(+params),
  });

  isFavorite = linkedSignal(() => {
    const ERROR_ON_RESPONSE = !!this.isMovieFavoriteResource.error();

    if (ERROR_ON_RESPONSE) return false;

    return this.isMovieFavoriteResource.value() ?? false;
  });

  toggleFavoriteParams = signal<boolean | undefined>(undefined);

  toggleMovieFavoriteResource = rxResource({
    params: () => {
      const status = this.toggleFavoriteParams();
      const movieId = this.id();

      if (status === undefined) return undefined;
      else return { currentMovieFavorite: status, movieId: +movieId };
    },
    stream: ({ params }) =>
      this._favoritesApi
        .toggleMovieFavorite(params.currentMovieFavorite, params.movieId)
        .pipe(tap(() => this.isFavorite.update((currentValue) => !currentValue))),
  });

  toggleFavorite() {
    this.toggleFavoriteParams.set(this.isFavorite());
  }

  updateRating(newRating: number) {
    if (newRating === this.currentRating()) this.currentRating.set(0);
    else this.currentRating.set(newRating);
  }
}
