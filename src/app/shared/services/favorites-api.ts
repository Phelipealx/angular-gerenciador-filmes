import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MoviesListResponse } from '../types/movies-list-response';

@Injectable({
  providedIn: 'root',
})
export class FavoritesApi {
  private readonly _http = inject(HttpClient);

  getFavorites() {
    return this._http.get<MoviesListResponse>('http://localhost:3000/favorites');
  }

  addMovieToFavorites(movieId: string) {
    return this._http.post('http://localhost:3000/favorites', { movieId });
  }

  removeMovieFromFavorites(movieId: string) {
    return this._http.delete(`http://localhost:3000/favorites/${movieId}`);
  }
}
