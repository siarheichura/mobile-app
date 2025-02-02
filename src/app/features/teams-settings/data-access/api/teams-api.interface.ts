import { Observable } from 'rxjs';
import { Team } from '../store/models/team.model';

export interface ITeamsApi {
  get(): Observable<Team[] | null>;
  set(teams: Team[]): Observable<void>;
  clear(): Observable<void>;
}
