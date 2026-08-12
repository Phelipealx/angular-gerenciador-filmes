import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { AuthenticationScreen } from './features/authentication/layout/authentication-screen/authentication-screen';
import { LoginForm } from './features/authentication/pages/login-form/login-form';
import { RegisterUserForm } from './features/authentication/pages/register-user-form/register-user-form';
import { FavoriteMovies } from './features/favorites/pages/favorite-movies/favorite-movies';
import { CreateMovie } from './features/movies/pages/create-movie/create-movie';
import { ExploreMovies } from './features/movies/pages/explore-movies/explore-movies';
import { MovieDetails } from './features/movies/pages/movie-details/movie-details';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthenticationScreen,
    canActivate: [guestGuard],
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        component: LoginForm,
      },
      { path: 'register', component: RegisterUserForm },
    ],
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'explore',
        component: ExploreMovies,
      },
      {
        path: 'favorites',
        component: FavoriteMovies,
      },
      {
        path: 'details/:id',
        component: MovieDetails,
      },
      {
        path: 'create',
        component: CreateMovie,
      },
    ],
  },
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' },
];
