import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { IMovieToFavoriteSuccessResponse } from '../models/movie-to-favorite-sucess-response';
import { MoviesListResponse } from '../types/movies-list-response';

@Injectable({
  providedIn: 'root',
})
export class FavoritesApi {
  private readonly _http = inject(HttpClient);

  getFavorites() {
    return this._http.get<MoviesListResponse>('http://localhost:3000/favorites');
  }

  isMovieInFavorites(movieId: number): Observable<boolean> {
    return this.getFavorites().pipe(
      map((favoritesListResponse: MoviesListResponse) =>
        favoritesListResponse.some((favoriteMovie) => favoriteMovie.id === movieId),
      ),
    );
  }

  addMovieToFavorites(movieId: number) {
    return this._http.post<IMovieToFavoriteSuccessResponse>(
      `http://localhost:3000/favorites/${movieId}`,
      {},
    );
  }

  removeMovieFromFavorites(movieId: number) {
    return this._http.delete<void>(`http://localhost:3000/favorites/${movieId}`);
  }

  toggleMovieFavorite(
    isCurrentMovieFavorite: boolean,
    movieId: number,
  ): Observable<IMovieToFavoriteSuccessResponse | void> {
    return isCurrentMovieFavorite
      ? this.removeMovieFromFavorites(movieId)
      : this.addMovieToFavorites(movieId);
  }
}
